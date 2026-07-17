/**
 * Pure text-processing utilities for the deterministic Quick-mode generator.
 * No randomness that isn't seeded — identical input must yield identical output.
 */

/** cyrb53 string hash → unsigned 32-bit-ish integer, stable across runs. */
export function hashString(input: string, seed = 0): number {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h2 >>> 0) ^ (h1 >>> 0);
}

/** Deterministic PRNG. Returns a function producing floats in [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function next(): number {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher-Yates shuffle driven by a seeded rng; returns a new array. */
export function shuffle<T>(items: readonly T[], rng: () => number): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Normalise free-text answers for tolerant exact/normalised comparison. */
export function normalizeAnswer(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Collapse the noisy whitespace that PDF extraction tends to produce. */
export function cleanText(raw: string): string {
  return raw
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/­/g, "")
    .replace(/-\n(\w)/g, "$1")
    .replace(/\n{2,}/g, "\n\n")
    .trim();
}

const ABBREVIATIONS = new Set([
  "mr",
  "mrs",
  "ms",
  "dr",
  "prof",
  "sr",
  "jr",
  "st",
  "vs",
  "etc",
  "e.g",
  "i.e",
  "fig",
  "no",
  "vol",
]);

/** Split text into trimmed sentences, tolerant of common abbreviations. */
export function splitSentences(text: string): string[] {
  const normalized = text.replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
  if (!normalized) return [];
  const rough = normalized.split(/(?<=[.!?])\s+(?=[A-Z0-9"'(])/);
  const sentences: string[] = [];
  let buffer = "";
  for (const piece of rough) {
    const candidate = buffer ? `${buffer} ${piece}` : piece;
    const lastWord = piece.trim().replace(/[.!?"')]+$/, "").split(/\s+/).pop() ?? "";
    if (ABBREVIATIONS.has(lastWord.toLowerCase())) {
      buffer = candidate;
      continue;
    }
    sentences.push(candidate.trim());
    buffer = "";
  }
  if (buffer) sentences.push(buffer.trim());
  return sentences.filter((s) => s.length > 0);
}

export const STOPWORDS: ReadonlySet<string> = new Set([
  "the", "a", "an", "and", "or", "but", "if", "then", "else", "when", "at", "by",
  "for", "with", "about", "against", "between", "into", "through", "during",
  "before", "after", "above", "below", "to", "from", "up", "down", "in", "out",
  "on", "off", "over", "under", "again", "further", "of", "is", "are", "was",
  "were", "be", "been", "being", "have", "has", "had", "having", "do", "does",
  "did", "doing", "this", "that", "these", "those", "it", "its", "as", "so",
  "than", "too", "very", "can", "will", "just", "should", "now", "also", "such",
  "which", "who", "whom", "what", "where", "why", "how", "all", "any", "both",
  "each", "few", "more", "most", "other", "some", "no", "not", "only", "own",
  "same", "he", "she", "they", "them", "his", "her", "their", "we", "our", "you",
  "your", "i", "me", "my", "there", "here", "one", "two", "three", "may", "might",
  "must", "shall", "would", "could", "because", "while", "however", "therefore",
]);

export interface Keyword {
  term: string;
  /** Lowercased comparison key. */
  key: string;
  count: number;
  score: number;
}

/**
 * Rank salient terms: multi-word capitalised phrases and frequent content words.
 * Deterministic (frequency + position + shape, no randomness).
 */
export function extractKeywords(text: string): Keyword[] {
  const sentences = splitSentences(text);
  const counts = new Map<string, { term: string; count: number; score: number }>();

  const bump = (term: string, weight: number) => {
    const key = term.toLowerCase();
    const existing = counts.get(key);
    if (existing) {
      existing.count += 1;
      existing.score += weight;
    } else {
      counts.set(key, { term, count: 1, score: weight });
    }
  };

  for (const sentence of sentences) {
    // Capitalised phrases (proper nouns / defined terms), not sentence-initial only.
    const phraseRe = /\b([A-Z][a-zA-Z0-9]+(?:\s+[A-Z][a-zA-Z0-9]+){0,2})\b/g;
    let m: RegExpExecArray | null;
    while ((m = phraseRe.exec(sentence)) !== null) {
      const phrase = m[1];
      const firstWord = phrase.split(/\s+/)[0].toLowerCase();
      // Skip likely sentence-initial single words that are common stopwords.
      if (m.index === 0 && !phrase.includes(" ") && STOPWORDS.has(firstWord)) continue;
      bump(phrase, phrase.includes(" ") ? 3 : 1.5);
    }

    // Numeric facts are strong quiz candidates.
    const numRe = /\b\d[\d,.]*(?:%|\s?(?:kg|km|m|cm|mm|ms|s|hz|gb|mb))?\b/gi;
    while ((m = numRe.exec(sentence)) !== null) {
      bump(m[0].trim(), 2);
    }

    // Frequent lowercase content words.
    const words = sentence.toLowerCase().match(/\b[a-z][a-z-]{3,}\b/g) ?? [];
    for (const w of words) {
      if (STOPWORDS.has(w)) continue;
      bump(w, 1);
    }
  }

  return Array.from(counts.entries())
    .map(([key, v]) => ({ term: v.term, key, count: v.count, score: v.score }))
    .filter((k) => k.term.length >= 3)
    .sort((a, b) => b.score - a.score || b.count - a.count || a.term.localeCompare(b.term));
}

/** Count word-ish tokens (used for per-source stats and readiness checks). */
export function wordCount(text: string): number {
  return (text.match(/\b[\p{L}\p{N}][\p{L}\p{N}'-]*\b/gu) ?? []).length;
}
