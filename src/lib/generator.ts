import type { Difficulty, Flashcard, Question, QuestionType } from "./types";
import {
  cleanText,
  extractKeywords,
  hashString,
  type Keyword,
  mulberry32,
  shuffle,
  splitSentences,
  wordCount,
} from "./text";

export interface GenerateQuizOptions {
  count: number;
  types: QuestionType[];
  difficulty: Difficulty;
}

export interface GenerateQuizResult {
  questions: Question[];
  warnings: string[];
}

export const MIN_WORDS_FOR_GENERATION = 40;
const BLANK = "_____";

/** Stable, content-derived id so identical input yields identical output (incl. ids). */
function stableId(prefix: string, ...parts: (string | number)[]): string {
  return `${prefix}_${hashString(parts.join("|")).toString(36)}`;
}

interface Blankable {
  sentence: string;
  before: string;
  term: string;
  after: string;
  keyword: Keyword;
}

/** Shape class used to keep MCQ distractors and TF swaps plausible. */
function shapeOf(term: string): "number" | "phrase" | "word" {
  if (/\d/.test(term)) return "number";
  if (term.includes(" ") || /^[A-Z]/.test(term)) return "phrase";
  return "word";
}

/** Find a blankable keyword occurrence inside a sentence (prefer strongest keyword). */
function findBlankable(sentence: string, keywords: Keyword[]): Blankable | null {
  for (const keyword of keywords) {
    if (keyword.term.length < 3) continue;
    const idx = sentence.toLowerCase().indexOf(keyword.key);
    if (idx < 0) continue;
    // Align to a word boundary using the original-cased slice.
    const term = sentence.slice(idx, idx + keyword.term.length);
    if (normalizeLoose(term) !== keyword.key) continue;
    const before = sentence.slice(0, idx);
    const after = sentence.slice(idx + term.length);
    return { sentence, before, term, after, keyword };
  }
  return null;
}

function normalizeLoose(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
}

/** Pick candidate sentences suitable for quiz items, ordered by difficulty preference. */
function pickSentences(sentences: string[], difficulty: Difficulty): string[] {
  const seen = new Set<string>();
  const scored = sentences
    .map((s) => s.trim())
    .filter((s) => {
      const len = s.length;
      if (len < 40 || len > 260) return false;
      const key = normalizeLoose(s);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((s) => ({ s, len: s.length }));

  const target =
    difficulty === "easy" ? 90 : difficulty === "hard" ? 210 : difficulty === "mixed" ? 140 : 140;
  return scored
    .sort((a, b) => Math.abs(a.len - target) - Math.abs(b.len - target))
    .map((x) => x.s);
}

function buildDistractors(
  answer: string,
  pool: Keyword[],
  rng: () => number,
  difficulty: Difficulty,
): string[] {
  const answerShape = shapeOf(answer);
  const answerKey = normalizeLoose(answer);
  const sameShape = pool.filter(
    (k) => shapeOf(k.term) === answerShape && normalizeLoose(k.term) !== answerKey,
  );
  const others = pool.filter((k) => normalizeLoose(k.term) !== answerKey);

  // Hard difficulty prefers close (high-score, similar length) distractors.
  const ranked = (difficulty === "hard" ? sameShape : shuffle(sameShape, rng)).slice();
  const chosen: string[] = [];
  const used = new Set<string>([answerKey]);

  const take = (candidates: Keyword[]) => {
    for (const k of candidates) {
      const key = normalizeLoose(k.term);
      if (used.has(key)) continue;
      chosen.push(k.term);
      used.add(key);
      if (chosen.length >= 3) return;
    }
  };

  take(ranked);
  if (chosen.length < 3) take(shuffle(others, rng));

  // Numeric fallback: perturb the number so we always reach four options.
  if (chosen.length < 3 && answerShape === "number") {
    const base = parseFloat(answer.replace(/[^\d.]/g, "")) || 1;
    for (const factor of [2, 0.5, 3]) {
      if (chosen.length >= 3) break;
      const val = Math.round(base * factor).toString();
      if (!used.has(val)) {
        chosen.push(val);
        used.add(val);
      }
    }
  }
  return chosen.slice(0, 3);
}

function makeFill(b: Blankable): Question {
  const prompt = `${b.before}${BLANK}${b.after}`.trim();
  return {
    id: stableId("q", "fill", prompt),
    type: "fill",
    prompt,
    options: [],
    correctIndex: -1,
    acceptableAnswers: [b.term.trim()],
    explanation: `From the source: "${b.sentence.trim()}"`,
    source: "quick",
  };
}

function makeShort(b: Blankable): Question {
  const cloze = `${b.before}${BLANK}${b.after}`.trim();
  const prompt = `Which term completes this statement? "${cloze}"`;
  return {
    id: stableId("q", "short", prompt),
    type: "short",
    prompt,
    options: [],
    correctIndex: -1,
    acceptableAnswers: [b.term.trim()],
    explanation: `From the source: "${b.sentence.trim()}"`,
    source: "quick",
  };
}

function makeMcq(
  b: Blankable,
  pool: Keyword[],
  rng: () => number,
  difficulty: Difficulty,
): Question | null {
  const distractors = buildDistractors(b.term, pool, rng, difficulty);
  if (distractors.length < 3) return null;
  const cloze = `${b.before}${BLANK}${b.after}`.trim();
  const prompt = `Which word or phrase best completes this statement? "${cloze}"`;
  const optionSet = shuffle([b.term.trim(), ...distractors], rng);
  const correctIndex = optionSet.findIndex((o) => o === b.term.trim());
  return {
    id: stableId("q", "mcq", prompt, optionSet.join(",")),
    type: "mcq",
    prompt,
    options: optionSet,
    correctIndex,
    acceptableAnswers: [],
    explanation: `From the source: "${b.sentence.trim()}"`,
    source: "quick",
  };
}

function makeTf(
  b: Blankable,
  pool: Keyword[],
  rng: () => number,
  makeFalse: boolean,
): Question {
  let statement = b.sentence.trim();
  let explanation = `This restates the source: "${b.sentence.trim()}"`;
  if (makeFalse) {
    const [swap] = buildDistractors(b.term, pool, rng, "medium");
    if (swap) {
      statement = `${b.before}${swap}${b.after}`.trim();
      explanation = `False. The source says "${b.term.trim()}", not "${swap}".`;
    } else {
      // No plausible swap available; keep as a true statement instead.
      makeFalse = false;
    }
  }
  return {
    id: stableId("q", "tf", statement, makeFalse ? "F" : "T"),
    type: "tf",
    prompt: statement,
    options: ["True", "False"],
    correctIndex: makeFalse ? 1 : 0,
    acceptableAnswers: [],
    explanation,
    source: "quick",
  };
}

/**
 * Deterministic Quick-mode quiz generator. No AI, no network.
 * Identical (text, options) always yields identical questions.
 */
export function generateQuiz(rawText: string, opts: GenerateQuizOptions): GenerateQuizResult {
  const warnings: string[] = [];
  const text = cleanText(rawText);
  const words = wordCount(text);
  const types = opts.types.length > 0 ? opts.types : (["mcq", "fill"] as QuestionType[]);

  if (words < MIN_WORDS_FOR_GENERATION) {
    return {
      questions: [],
      warnings: [
        `The source has only ${words} words. Add at least ${MIN_WORDS_FOR_GENERATION} words of readable text to generate questions.`,
      ],
    };
  }

  const rng = mulberry32(hashString(text));
  const keywords = extractKeywords(text);
  const sentences = pickSentences(splitSentences(text), opts.difficulty);

  if (keywords.length < 4) warnings.push("Few distinct key terms found; some options may repeat.");

  const blankables: Blankable[] = [];
  for (const sentence of sentences) {
    const b = findBlankable(sentence, keywords);
    if (b) blankables.push(b);
  }
  if (blankables.length === 0) {
    return {
      questions: [],
      warnings: [
        "Couldn't find quiz-worthy sentences in this source. Try a longer or more prose-like passage.",
      ],
    };
  }

  const questions: Question[] = [];
  const usedPrompts = new Set<string>();
  const target = Math.max(1, Math.min(opts.count, blankables.length * types.length));
  let typeCursor = 0;
  let blankCursor = 0;
  let tfToggle = false;
  let guard = 0;

  while (questions.length < target && guard < blankables.length * types.length * 2) {
    guard++;
    const type = types[typeCursor % types.length];
    const b = blankables[blankCursor % blankables.length];
    typeCursor++;
    blankCursor++;

    let q: Question | null = null;
    if (type === "fill") q = makeFill(b);
    else if (type === "short") q = makeShort(b);
    else if (type === "mcq") q = makeMcq(b, keywords, rng, opts.difficulty);
    else if (type === "tf") {
      q = makeTf(b, keywords, rng, tfToggle);
      tfToggle = !tfToggle;
    }

    if (!q) continue;
    const dedupeKey = `${q.type}:${normalizeLoose(q.prompt)}`;
    if (usedPrompts.has(dedupeKey)) continue;
    usedPrompts.add(dedupeKey);
    questions.push(q);
  }

  if (questions.length < opts.count) {
    warnings.push(
      `Generated ${questions.length} of ${opts.count} requested — the source didn't have enough distinct material for more.`,
    );
  }

  return { questions, warnings };
}

// ---- Flashcards ----

const DEFINITION_RE =
  /^(.{2,60}?)\s+(?:is|are|was|were|means|refers to|is defined as|describes)\s+(.{8,})$/i;

function initialCardSrs(): Pick<
  Flashcard,
  "due" | "intervalDays" | "ease" | "reps" | "lapses"
> {
  return { due: new Date(0).toISOString(), intervalDays: 0, ease: 2.5, reps: 0, lapses: 0 };
}

export interface GenerateDeckResult {
  cards: Flashcard[];
  warnings: string[];
}

/** Deterministic Quick-mode flashcard generator. */
export function generateFlashcards(rawText: string, count: number): GenerateDeckResult {
  const warnings: string[] = [];
  const text = cleanText(rawText);
  if (wordCount(text) < MIN_WORDS_FOR_GENERATION) {
    return { cards: [], warnings: ["Not enough text to build flashcards."] };
  }

  const sentences = splitSentences(text);
  const keywords = extractKeywords(text);
  const cards: Flashcard[] = [];
  const usedFronts = new Set<string>();

  const push = (front: string, back: string, source: "quick" = "quick") => {
    const key = normalizeLoose(front);
    if (usedFronts.has(key) || !front.trim() || !back.trim()) return;
    usedFronts.add(key);
    cards.push({
      id: stableId("c", front, back),
      front: front.trim(),
      back: back.trim(),
      source,
      ...initialCardSrs(),
    });
  };

  // 1) Definition sentences → term / definition cards.
  for (const sentence of sentences) {
    if (cards.length >= count) break;
    const m = sentence.match(DEFINITION_RE);
    if (m) {
      const term = m[1].replace(/^(the|a|an)\s+/i, "").trim();
      if (term.length >= 3 && term.split(/\s+/).length <= 6) {
        push(term.charAt(0).toUpperCase() + term.slice(1), sentence.trim());
      }
    }
  }

  // 2) Fill from top keywords with their first context sentence.
  for (const kw of keywords) {
    if (cards.length >= count) break;
    const context = sentences.find((s) => s.toLowerCase().includes(kw.key));
    if (context) push(`Define: ${kw.term}`, context.trim());
  }

  if (cards.length < count) {
    warnings.push(
      `Built ${cards.length} of ${count} cards — the source didn't have enough distinct terms for more.`,
    );
  }
  return { cards: cards.slice(0, count), warnings };
}
