"use client";

import { GraduationCap, Layers, Sparkles } from "lucide-react";
import { useId, useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { QuickModeBadge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import { getByokKey, setByokKey } from "@/lib/prefs";
import {
  DIFFICULTY_LABELS,
  type Difficulty,
  QUESTION_TYPE_LABELS,
  type QuestionType,
  type GenMode,
  type Audience,
} from "@/lib/types";

export type OutputType = "quiz" | "flashcards";

export interface QuizConfigValues {
  count: number;
  types: QuestionType[];
  difficulty: Difficulty;
  audience: Audience;
  timed: boolean;
  timeLimitSec: number;
}

export interface GenerateRequest {
  output: OutputType;
  mode: GenMode;
  quiz: QuizConfigValues;
  cardCount: number;
  byok: string | null;
}

const ALL_TYPES: QuestionType[] = ["mcq", "tf", "short", "fill"];
const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard", "mixed"];

interface GenerateConfigProps {
  wordCount: number;
  generating: boolean;
  onBack: () => void;
  onGenerate: (req: GenerateRequest) => void;
  onCancel?: () => void;
}

export function GenerateConfig({ wordCount, generating, onBack, onGenerate, onCancel }: GenerateConfigProps) {
  const [output, setOutput] = useState<OutputType>("quiz");
  const [mode, setMode] = useState<GenMode>("quick");
  const [count, setCount] = useState(10);
  const [types, setTypes] = useState<QuestionType[]>(["mcq", "fill"]);
  const [difficulty, setDifficulty] = useState<Difficulty>("mixed");
  const [audience, setAudience] = useState<Audience>("university");
  const [timed, setTimed] = useState(false);
  const [timeLimitMin, setTimeLimitMin] = useState(10);
  const [cardCount, setCardCount] = useState(15);
  const [byok, setByok] = useState("");

  const countId = useId();
  const difficultyId = useId();
  const audienceId = useId();
  const timeId = useId();
  const cardCountId = useId();

  useEffect(() => {
    const k = getByokKey() || "";
    window.setTimeout(() => {
      setByok(k);
    }, 0);
  }, []);

  const toggleType = (type: QuestionType) => {
    setTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  // AI mode is never hard-blocked: it uses the server's shared allowance first
  // (free daily quota via the AI Gateway / OIDC on deploy) and only needs a
  // personal key if the server is unconfigured or the limit is reached. On a
  // failed AI call the workspace shows an honest message and Quick mode remains.
  const canGenerate = output === "flashcards" || types.length > 0;

  return (
    <section aria-labelledby="config-heading" className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 id="config-heading" className="font-display text-2xl text-ink">
            Configure
          </h2>
          <p className="mt-1 text-sm text-ink-secondary">
            <span className="font-mono">{wordCount}</span> words of source ready.
          </p>
        </div>
        {mode === "quick" ? (
          <QuickModeBadge />
        ) : (
          <span className="inline-flex items-center gap-1 rounded-sm bg-accent-tint px-2 py-1 text-2xs font-semibold uppercase tracking-[0.08em] text-accent">
            <Sparkles size={11} className="shrink-0" /> AI Mode
          </span>
        )}
      </div>

      {/* Generation Mode Selector */}
      <fieldset className="flex flex-col gap-2.5">
        <legend className="text-sm font-semibold text-ink mb-1">Generation Mode</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setMode("quick")}
            className={cn(
              "flex flex-col gap-1 rounded-2xl border p-4 text-left transition-all duration-200 cursor-pointer shadow-sm",
              mode === "quick"
                ? "border-accent bg-accent-tint/70 dark:bg-accent-tint/35 text-ink"
                : "border-white/20 dark:border-white/5 bg-white/25 dark:bg-slate-900/25 hover:border-accent dark:hover:border-accent hover:bg-white/30"
            )}
          >
            <span className="font-display font-bold text-sm text-ink">Quick mode (no AI)</span>
            <span className="text-xs text-ink-secondary mt-0.5">
              Deterministic, uses sentence heuristics. Fully offline, no keys needed.
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMode("ai")}
            className={cn(
              "flex flex-col gap-1 rounded-2xl border p-4 text-left transition-all duration-200 cursor-pointer shadow-sm",
              mode === "ai"
                ? "border-accent bg-accent-tint/70 dark:bg-accent-tint/35 text-ink"
                : "border-white/20 dark:border-white/5 bg-white/25 dark:bg-slate-900/25 hover:border-accent dark:hover:border-accent hover:bg-white/30"
            )}
          >
            <span className="font-display font-bold text-sm text-ink flex items-center gap-1.5">
              <Sparkles size={14} className="text-accent" /> AI mode
            </span>
            <span className="text-xs text-ink-secondary mt-0.5">
              Uses high-quality language models to parse, reword, and structure concepts.
            </span>
          </button>
        </div>
      </fieldset>

      {/* Optional BYOK key for AI mode. AI mode uses the shared server allowance
          first; a personal key is only needed if the server has no credentials
          or the daily free limit is reached. */}
      {mode === "ai" && (
        <div className="flex flex-col gap-3 rounded-2xl border border-white/20 dark:border-white/5 bg-white/25 dark:bg-slate-900/25 p-5 text-sm text-ink shadow-sm">
          <p className="font-bold text-ink">
            Your own API key <span className="font-normal text-ink-muted">(optional)</span>
          </p>
          <p className="text-ink-secondary text-xs leading-relaxed">
            AI mode uses this site&apos;s shared free daily allowance. If AI is unavailable on this
            deployment or you&apos;ve hit the daily limit, add a Vercel AI Gateway key to keep going.
            It stays in this browser tab only and is never stored on our servers.
          </p>
          <div className="flex gap-2 max-w-sm mt-1">
            <input
              type="password"
              placeholder="Vercel AI Gateway key (vck_…)"
              aria-label="Vercel AI Gateway API key (optional)"
              value={byok}
              onChange={(e) => {
                setByok(e.target.value);
                setByokKey(e.target.value);
              }}
              className="flex-1 rounded-xl border border-white/20 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 px-3 py-2 text-xs text-ink outline-none focus:border-accent focus:bg-white/40 dark:focus:bg-slate-900/40 transition-all shadow-sm"
            />
          </div>
        </div>
      )}

      {/* Output type */}
      <fieldset className="flex flex-col gap-2.5">
        <legend className="text-sm font-semibold text-ink mb-1">What should we make?</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <OutputCard
            active={output === "quiz"}
            onClick={() => setOutput("quiz")}
            icon={GraduationCap}
            title="A quiz"
            body="Multiple choice, true/false, short answer and fill-in-the-blank questions to play and score."
          />
          <OutputCard
            active={output === "flashcards"}
            onClick={() => setOutput("flashcards")}
            icon={Layers}
            title="A flashcard deck"
            body="Term-and-definition cards with spaced self-grading for repeated review."
          />
        </div>
      </fieldset>

      {output === "quiz" ? (
        <>
          <fieldset className="flex flex-col gap-2.5">
            <legend className="text-sm font-semibold text-ink">Question types</legend>
            <div className="flex flex-wrap gap-2">
              {ALL_TYPES.map((type) => {
                const checked = types.includes(type);
                return (
                  <label
                    key={type}
                    className={cn(
                      "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-sm transition-all duration-200",
                      checked
                        ? "border-accent bg-accent-tint/70 dark:bg-accent-tint/25 text-accent font-semibold"
                        : "border-white/20 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 text-ink-secondary hover:border-ink-muted",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleType(type)}
                      className="size-4 rounded accent-[var(--color-accent-strong)]"
                    />
                    {QUESTION_TYPE_LABELS[type]}
                  </label>
                );
              })}
            </div>
            {types.length === 0 ? (
              <p role="alert" className="text-xs font-semibold text-error mt-0.5">
                Pick at least one question type.
              </p>
            ) : null}
          </fieldset>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor={countId} className="text-xs font-semibold text-ink">
                Number of questions: <span className="font-mono text-accent font-bold">{count}</span>
              </label>
              <input
                id={countId}
                type="range"
                min={1}
                max={30}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="accent-[var(--color-accent-strong)] cursor-pointer h-2 bg-white/20 dark:bg-slate-800 rounded-lg appearance-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor={difficultyId} className="text-xs font-semibold text-ink">
                  Difficulty
                </label>
                <select
                  id={difficultyId}
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                  className="min-h-11 rounded-xl border border-white/20 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 px-3 text-sm text-ink outline-none hover:border-accent focus:border-accent focus:bg-white/40 dark:focus:bg-slate-900/40 transition-all shadow-sm cursor-pointer"
                >
                  {DIFFICULTIES.map((d) => (
                    <option key={d} value={d}>
                      {DIFFICULTY_LABELS[d]}
                    </option>
                  ))}
                </select>
              </div>

              {mode === "ai" ? (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor={audienceId} className="text-xs font-semibold text-ink">
                    Target Audience Level
                  </label>
                  <select
                    id={audienceId}
                    value={audience}
                    onChange={(e) => setAudience(e.target.value as Audience)}
                    className="min-h-11 rounded-xl border border-white/20 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 px-3 text-sm text-ink outline-none hover:border-accent focus:border-accent focus:bg-white/40 dark:focus:bg-slate-900/40 transition-all shadow-sm cursor-pointer"
                  >
                    <option value="school">School / K-12</option>
                    <option value="university">University / Higher Ed</option>
                    <option value="professional">Professional / Certification</option>
                  </select>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-white/20 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 p-4 shadow-sm">
            <label className="inline-flex cursor-pointer items-center gap-3 text-sm font-semibold text-ink">
              <input
                type="checkbox"
                checked={timed}
                onChange={(e) => setTimed(e.target.checked)}
                className="size-4 rounded accent-[var(--color-accent-strong)]"
              />
              Timed mode <span className="font-normal text-ink-muted">(optional)</span>
            </label>
            {timed ? (
              <div className="flex items-center gap-3 mt-1 pl-7">
                <label htmlFor={timeId} className="text-xs font-semibold text-ink-secondary">
                  Time limit
                </label>
                <input
                  id={timeId}
                  type="number"
                  min={1}
                  max={180}
                  value={timeLimitMin}
                  onChange={(e) => setTimeLimitMin(Math.max(1, Number(e.target.value)))}
                  className="w-20 rounded-xl border border-white/20 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 px-3 py-1.5 font-mono text-xs text-ink outline-none focus:border-accent shadow-sm"
                />
                <span className="text-xs text-ink-secondary">minutes</span>
              </div>
            ) : null}
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-1.5">
          <label htmlFor={cardCountId} className="text-xs font-semibold text-ink">
            Number of cards: <span className="font-mono text-accent font-bold">{cardCount}</span>
          </label>
          <input
            id={cardCountId}
            type="range"
            min={1}
            max={40}
            value={cardCount}
            onChange={(e) => setCardCount(Number(e.target.value))}
            className="accent-[var(--color-accent-strong)] cursor-pointer h-2 bg-white/20 dark:bg-slate-800 rounded-lg appearance-none"
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 mt-2">
        <Button
          loading={generating}
          disabled={!canGenerate}
          onClick={() =>
            onGenerate({
              output,
              mode,
              quiz: { count, types, difficulty, audience, timed, timeLimitSec: timeLimitMin * 60 },
              cardCount,
              byok: mode === "ai" ? byok || null : null,
            })
          }
        >
          <Sparkles size={16} strokeWidth={1.75} aria-hidden />
          Generate {output === "quiz" ? "quiz" : "flashcards"}
        </Button>
        {generating && onCancel ? (
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        ) : (
          <Button variant="ghost" onClick={onBack} disabled={generating}>
            Back to source
          </Button>
        )}
      </div>
    </section>
  );
}

function OutputCard({
  active,
  onClick,
  icon: Icon,
  title,
  body,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof GraduationCap;
  title: string;
  body: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex flex-col gap-2 rounded-2xl border p-4 text-left transition-all duration-200 cursor-pointer shadow-sm",
        active
          ? "border-accent bg-accent-tint/70 dark:bg-accent-tint/35 text-ink"
          : "border-white/20 dark:border-white/5 bg-white/25 dark:bg-slate-900/25 hover:border-accent dark:hover:border-accent hover:bg-white/30",
      )}
    >
      <span
        className={cn(
          "flex size-9 items-center justify-center rounded-xl transition-colors",
          active ? "bg-accent-strong text-on-accent shadow-sm" : "bg-white/30 dark:bg-slate-800 text-accent border border-white/20 dark:border-white/5",
        )}
      >
        <Icon size={18} strokeWidth={2} aria-hidden />
      </span>
      <span className="font-display font-bold text-base text-ink">{title}</span>
      <span className="text-xs text-ink-secondary leading-relaxed">{body}</span>
    </button>
  );
}
