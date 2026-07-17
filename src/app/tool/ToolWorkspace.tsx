"use client";

import { AlertCircle, Layers, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { QuickModeBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { GenerateConfig, type GenerateRequest, type QuizConfigValues } from "@/components/tool/GenerateConfig";
import { QuestionEditor } from "@/components/tool/QuestionEditor";
import { SourceInput, type WorkspaceSource } from "@/components/tool/SourceInput";
import { QuizPlayer, type PlaySession } from "@/components/player/QuizPlayer";
import { QuizResults } from "@/components/player/QuizResults";
import { runObjectCapability } from "@/lib/ai/client";
import { generateFlashcards, generateQuiz } from "@/lib/generator";
import { newId } from "@/lib/id";
import { getByokKey, getHistoryEnabled } from "@/lib/prefs";
import { isCorrect, scoreQuiz } from "@/lib/scoring";
import { decodeQuizPayload, SHARE_PREFIX } from "@/lib/share";
import { getQuiz, saveDeck, saveQuiz, saveResult } from "@/lib/storage";
import { wordCount } from "@/lib/text";
import {
  type Deck,
  type Question,
  type Quiz,
  type QuizResult,
  SCHEMA_VERSION,
} from "@/lib/types";

interface RawQuestion {
  type: Question["type"];
  prompt: string;
  options?: string[];
  correctIndex?: number;
  acceptableAnswers?: string[];
  explanation?: string;
}

interface RawCard {
  front: string;
  back: string;
}

type Phase = "source" | "configure" | "review" | "deck" | "play" | "results";

function normalizePrompt(s: string): string {
  return s
    .toLowerCase()
    .replace(/_+/g, " ")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function nowIso(): string {
  return new Date().toISOString();
}

export function ToolWorkspace() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [phase, setPhase] = useState<Phase>("source");
  const [source, setSource] = useState<WorkspaceSource | null>(null);
  const [genConfig, setGenConfig] = useState<QuizConfigValues | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [deck, setDeck] = useState<Deck | null>(null);
  const [playQuestions, setPlayQuestions] = useState<Question[]>([]);
  const [session, setSession] = useState<PlaySession | null>(null);

  const [warnings, setWarnings] = useState<string[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deckSaving, setDeckSaving] = useState(false);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [regeneratingAll, setRegeneratingAll] = useState(false);
  const [edited, setEdited] = useState(false);
  const [confirmRegenAll, setConfirmRegenAll] = useState(false);

  const bootstrapped = useRef(false);

  // Load a saved quiz (?quiz=id) or a shared quiz (#quiz=...) once on mount.
  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    window.setTimeout(() => {
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      if (hash.startsWith(SHARE_PREFIX)) {
        try {
          const shared = decodeQuizPayload(hash);
          setQuiz(shared);
          setPhase("review");
          history.replaceState(null, "", window.location.pathname);
          return;
        } catch (err) {
          const msg = err instanceof Error ? err.message : "This shared quiz couldn't be loaded.";
          setLoadError(msg);
          return;
        }
      }

      const quizId = searchParams.get("quiz");
      if (quizId) {
        void getQuiz(quizId).then((found) => {
          if (found) {
            setQuiz(found);
            setSaved(true);
            setPhase("review");
          } else {
            setLoadError("That quiz is no longer in your local library.");
          }
        });
      }
    }, 0);
  }, [searchParams]);

  const buildQuiz = useCallback(
    (questions: Question[], src: WorkspaceSource, cfg: QuizConfigValues, mode: "quick" | "ai"): Quiz => {
      const iso = nowIso();
      return {
        id: newId(),
        title: `${src.name} — quiz`,
        questions,
        createdAt: iso,
        updatedAt: iso,
        sourceName: src.name,
        mode,
        timed: cfg.timed,
        timeLimitSec: cfg.timed ? cfg.timeLimitSec : null,
        schemaVersion: SCHEMA_VERSION,
      };
    },
    [],
  );

  const handleGenerate = useCallback(
    (req: GenerateRequest) => {
      if (!source) return;
      setGenerating(true);
      setWarnings([]);

      if (req.mode === "ai") {
        const run = async () => {
          try {
            if (req.output === "quiz") {
              const res = await runObjectCapability<{ questions: RawQuestion[] }>({
                id: "quiz",
                body: {
                  text: source.text,
                  count: req.quiz.count,
                  types: req.quiz.types,
                  difficulty: req.quiz.difficulty,
                  audience: req.quiz.audience,
                },
                byok: req.byok,
              });
              const qs: Question[] = res.result.questions.map((q) => ({
                id: newId(),
                type: q.type,
                prompt: q.prompt,
                options: q.options || [],
                correctIndex: q.correctIndex ?? -1,
                acceptableAnswers: q.acceptableAnswers || [],
                explanation: q.explanation || "",
                source: "ai",
              }));
              setGenConfig(req.quiz);
              setQuiz(buildQuiz(qs, source, req.quiz, "ai"));
              setSaved(false);
              setEdited(false);
              setPhase("review");
            } else {
              const res = await runObjectCapability<{ cards: RawCard[] }>({
                id: "flashcards",
                body: {
                  text: source.text,
                  count: req.cardCount,
                },
                byok: req.byok,
              });
              const cards = res.result.cards.map((c) => ({
                id: newId(),
                front: c.front,
                back: c.back,
                source: "ai" as const,
                due: new Date(0).toISOString(),
                intervalDays: 0,
                ease: 2.5,
                reps: 0,
                lapses: 0,
              }));
              const iso = nowIso();
              setDeck({
                id: newId(),
                title: `${source.name} — deck`,
                cards,
                createdAt: iso,
                updatedAt: iso,
                sourceName: source.name,
                mode: "ai",
                schemaVersion: SCHEMA_VERSION,
              });
              setPhase("deck");
            }
          } catch (err) {
            console.error("AI generation failed:", err);
            const msg = err instanceof Error ? err.message : "AI generation failed. Try again or use Quick mode.";
            setWarnings([msg]);
          } finally {
            setGenerating(false);
          }
        };
        void run();
      } else {
        window.setTimeout(() => {
          if (req.output === "quiz") {
            const result = generateQuiz(source.text, {
              count: req.quiz.count,
              types: req.quiz.types,
              difficulty: req.quiz.difficulty,
            });
            setGenConfig(req.quiz);
            setWarnings(result.warnings);
            if (result.questions.length === 0) {
              setGenerating(false);
              return;
            }
            setQuiz(buildQuiz(result.questions, source, req.quiz, "quick"));
            setSaved(false);
            setEdited(false);
            setPhase("review");
          } else {
            const result = generateFlashcards(source.text, req.cardCount);
            setWarnings(result.warnings);
            if (result.cards.length === 0) {
              setGenerating(false);
              return;
            }
            const iso = nowIso();
            setDeck({
              id: newId(),
              title: `${source.name} — deck`,
              cards: result.cards,
              createdAt: iso,
              updatedAt: iso,
              sourceName: source.name,
              mode: "quick",
              schemaVersion: SCHEMA_VERSION,
            });
            setPhase("deck");
          }
          setGenerating(false);
        }, 30);
      }
    },
    [buildQuiz, source],
  );

  const patchQuiz = useCallback((patch: Partial<Quiz>) => {
    setQuiz((prev) => (prev ? { ...prev, ...patch, updatedAt: nowIso() } : prev));
    setSaved(false);
  }, []);

  const handleUpdateQuestion = useCallback(
    (id: string, patch: Partial<Question>) => {
      setEdited(true);
      setQuiz((prev) =>
        prev
          ? {
              ...prev,
              questions: prev.questions.map((q) => (q.id === id ? { ...q, ...patch } : q)),
              updatedAt: nowIso(),
            }
          : prev,
      );
      setSaved(false);
    },
    [],
  );

  const handleMove = useCallback((id: string, direction: "up" | "down") => {
    setEdited(true);
    setQuiz((prev) => {
      if (!prev) return prev;
      const i = prev.questions.findIndex((q) => q.id === id);
      if (i < 0) return prev;
      const j = direction === "up" ? i - 1 : i + 1;
      if (j < 0 || j >= prev.questions.length) return prev;
      const questions = prev.questions.slice();
      [questions[i], questions[j]] = [questions[j], questions[i]];
      return { ...prev, questions, updatedAt: nowIso() };
    });
    setSaved(false);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setEdited(true);
    setQuiz((prev) =>
      prev
        ? { ...prev, questions: prev.questions.filter((q) => q.id !== id), updatedAt: nowIso() }
        : prev,
    );
    setSaved(false);
  }, []);

  const handleRegenerateOne = useCallback(
    (id: string) => {
      if (!source || !quiz || !genConfig) return;
      const target = quiz.questions.find((q) => q.id === id);
      if (!target) return;
      setRegeneratingId(id);

      if (quiz.mode === "ai") {
        const run = async () => {
          try {
            const byok = getByokKey();
            const res = await runObjectCapability<RawQuestion>({
              id: "regenerate-one",
              body: {
                text: source.text,
                type: target.type,
                difficulty: genConfig.difficulty,
                existingPrompts: quiz.questions.map((q) => q.prompt),
              },
              byok,
            });
            const q = res.result;
            const replacement: Question = {
              id: newId(),
              type: q.type,
              prompt: q.prompt,
              options: q.options || [],
              correctIndex: q.correctIndex ?? -1,
              acceptableAnswers: q.acceptableAnswers || [],
              explanation: q.explanation || "",
              source: "ai",
            };
            setQuiz((prev) =>
              prev
                ? {
                    ...prev,
                    questions: prev.questions.map((item) => (item.id === id ? replacement : item)),
                    updatedAt: nowIso(),
                  }
                : prev,
            );
            setSaved(false);
          } catch (err) {
            const msg = err instanceof Error ? err.message : "Failed to regenerate question using AI.";
            setWarnings([msg]);
          } finally {
            setRegeneratingId(null);
          }
        };
        void run();
      } else {
        window.setTimeout(() => {
          const existing = new Set(
            quiz.questions.filter((q) => q.id !== id).map((q) => normalizePrompt(q.prompt)),
          );
          existing.add(normalizePrompt(target.prompt));
          const pool = generateQuiz(source.text, {
            count: quiz.questions.length + 10,
            types: [target.type],
            difficulty: genConfig.difficulty,
          }).questions;
          const replacement = pool.find((q) => !existing.has(normalizePrompt(q.prompt)));
          if (replacement) {
            setQuiz((prev) =>
              prev
                ? {
                    ...prev,
                    questions: prev.questions.map((q) => (q.id === id ? replacement : q)),
                    updatedAt: nowIso(),
                  }
                : prev,
            );
            setSaved(false);
          } else {
            setWarnings(["Couldn't find a different question for that slot from this source."]);
          }
          setRegeneratingId(null);
        }, 30);
      }
    },
    [genConfig, quiz, source],
  );

  const runRegenerateAll = useCallback(() => {
    if (!source || !quiz || !genConfig) return;
    setRegeneratingAll(true);
    setConfirmRegenAll(false);

    if (quiz.mode === "ai") {
      const run = async () => {
        try {
          const byok = getByokKey();
          const res = await runObjectCapability<{ questions: RawQuestion[] }>({
            id: "quiz",
            body: {
              text: source.text,
              count: genConfig.count,
              types: genConfig.types,
              difficulty: genConfig.difficulty,
              audience: genConfig.audience || "university",
            },
            byok,
          });
          const qs: Question[] = res.result.questions.map((q) => ({
            id: newId(),
            type: q.type,
            prompt: q.prompt,
            options: q.options || [],
            correctIndex: q.correctIndex ?? -1,
            acceptableAnswers: q.acceptableAnswers || [],
            explanation: q.explanation || "",
            source: "ai",
          }));
          setQuiz((prev) =>
            prev ? { ...prev, questions: qs, updatedAt: nowIso() } : prev,
          );
          setEdited(false);
          setSaved(false);
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Failed to regenerate quiz using AI.";
          setWarnings([msg]);
        } finally {
          setRegeneratingAll(false);
        }
      };
      void run();
    } else {
      window.setTimeout(() => {
        const result = generateQuiz(source.text, {
          count: genConfig.count,
          types: genConfig.types,
          difficulty: genConfig.difficulty,
        });
        setWarnings(result.warnings);
        if (result.questions.length > 0) {
          setQuiz((prev) =>
            prev ? { ...prev, questions: result.questions, updatedAt: nowIso() } : prev,
          );
          setEdited(false);
          setSaved(false);
        }
        setRegeneratingAll(false);
      }, 30);
    }
  }, [genConfig, quiz, source]);

  const handleRegenerateAll = useCallback(() => {
    if (edited) setConfirmRegenAll(true);
    else runRegenerateAll();
  }, [edited, runRegenerateAll]);

  const handleSave = useCallback(async () => {
    if (!quiz) return;
    setSaving(true);
    try {
      await saveQuiz(quiz);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }, [quiz]);

  const startPlay = useCallback((questions: Question[]) => {
    setPlayQuestions(questions);
    setPhase("play");
  }, []);

  const handleFinish = useCallback(
    async (result: PlaySession) => {
      setSession(result);
      setPhase("results");
      if (!quiz || !getHistoryEnabled()) return;
      const summary = scoreQuiz(playQuestions, result.answers);
      const record: QuizResult = {
        id: newId(),
        quizId: quiz.id,
        quizTitle: quiz.title,
        createdAt: nowIso(),
        durationSec: result.durationSec,
        total: summary.total,
        correct: summary.correct,
        items: playQuestions.map((q) => ({
          questionId: q.id,
          type: q.type,
          correct: isCorrect(q, result.answers[q.id] ?? null),
        })),
        mode: quiz.mode,
      };
      // Persist the quiz too so dashboard "quizzes created" reflects reality.
      await saveQuiz(quiz);
      setSaved(true);
      await saveResult(record);
    },
    [playQuestions, quiz],
  );

  const handleSaveDeck = useCallback(async () => {
    if (!deck) return;
    setDeckSaving(true);
    try {
      await saveDeck(deck);
      router.push("/flashcards");
    } finally {
      setDeckSaving(false);
    }
  }, [deck, router]);

  if (loadError) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border border-error bg-error-tint p-8 text-center">
        <AlertCircle size={28} className="text-error" aria-hidden />
        <p className="text-ink">{loadError}</p>
        <Button
          onClick={() => {
            setLoadError(null);
            setPhase("source");
          }}
        >
          Start a new quiz
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {warnings.length > 0 && (phase === "configure" || phase === "review") ? (
        <div className="flex flex-col gap-1 rounded-md border border-warning bg-warning-tint p-3 text-sm text-ink">
          {warnings.map((w) => (
            <p key={w} className="flex items-start gap-2">
              <AlertCircle size={15} className="mt-0.5 shrink-0 text-warning" aria-hidden />
              {w}
            </p>
          ))}
        </div>
      ) : null}

      {phase === "source" ? <SourceInput onReady={(s) => { setSource(s); setPhase("configure"); }} /> : null}

      {phase === "configure" && source ? (
        <GenerateConfig
          wordCount={wordCount(source.text)}
          generating={generating}
          onBack={() => setPhase("source")}
          onGenerate={handleGenerate}
        />
      ) : null}

      {phase === "review" && quiz ? (
        <QuestionEditor
          quiz={quiz}
          quick={quiz.mode === "quick"}
          saving={saving}
          saved={saved}
          canRegenerate={source !== null && genConfig !== null}
          regeneratingId={regeneratingId}
          regeneratingAll={regeneratingAll}
          onChangeTitle={(title) => patchQuiz({ title })}
          onUpdateQuestion={handleUpdateQuestion}
          onMove={handleMove}
          onDelete={handleDelete}
          onRegenerateOne={handleRegenerateOne}
          onRegenerateAll={handleRegenerateAll}
          onPlay={() => startPlay(quiz.questions)}
          onSave={handleSave}
          onBack={() => setPhase(source ? "configure" : "source")}
        />
      ) : null}

      {phase === "deck" && deck ? (
        <section className="flex flex-col gap-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-2xl text-ink">Your flashcard deck</h2>
            <QuickModeBadge />
          </div>
          <p className="text-sm text-ink-secondary">
            {deck.cards.length} {deck.cards.length === 1 ? "card" : "cards"}. Save the deck to study
            it with spaced review.
          </p>
          <ol className="grid gap-3 sm:grid-cols-2">
            {deck.cards.map((c) => (
              <li key={c.id} className="flex flex-col gap-2 rounded-md border border-line bg-surface-2 p-4">
                <span className="font-display text-lg text-ink">{c.front}</span>
                <span className="text-sm text-ink-secondary">{c.back}</span>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-3">
            <Button loading={deckSaving} onClick={handleSaveDeck}>
              <Layers size={16} strokeWidth={1.75} aria-hidden /> Save deck &amp; study
            </Button>
            <Button variant="ghost" onClick={() => setPhase("configure")}>
              Back to configure
            </Button>
          </div>
        </section>
      ) : null}

      {phase === "play" && quiz ? (
        <QuizPlayer
          title={quiz.title}
          questions={playQuestions}
          quick={quiz.mode === "quick"}
          timed={quiz.timed}
          timeLimitSec={quiz.timeLimitSec}
          onFinish={handleFinish}
          onExit={() => setPhase("review")}
        />
      ) : null}

      {phase === "results" && quiz && session ? (
        <QuizResults
          title={quiz.title}
          questions={playQuestions}
          answers={session.answers}
          durationSec={session.durationSec}
          onRetakeAll={() => startPlay(quiz.questions)}
          onRetakeIncorrect={(ids) =>
            startPlay(quiz.questions.filter((q) => ids.includes(q.id)))
          }
          onDone={() => setPhase("review")}
        />
      ) : null}

      {generating && phase === "configure" ? (
        <p className="inline-flex items-center gap-2 text-sm text-ink-secondary">
          <Loader2 size={16} className="animate-spin" aria-hidden /> Generating…
        </p>
      ) : null}

      <ConfirmDialog
        open={confirmRegenAll}
        title="Regenerate all questions?"
        description="This replaces every question with a fresh set from your source. Your edits to the current questions will be lost."
        confirmLabel="Regenerate"
        confirmVariant="primary"
        onConfirm={runRegenerateAll}
        onCancel={() => setConfirmRegenAll(false)}
      />
    </div>
  );
}
