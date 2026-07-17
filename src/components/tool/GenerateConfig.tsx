"use client";

import { GraduationCap, Layers, Sparkles } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { QuickModeBadge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import {
  DIFFICULTY_LABELS,
  type Difficulty,
  QUESTION_TYPE_LABELS,
  type QuestionType,
} from "@/lib/types";

export type OutputType = "quiz" | "flashcards";

export interface QuizConfigValues {
  count: number;
  types: QuestionType[];
  difficulty: Difficulty;
  timed: boolean;
  timeLimitSec: number;
}

export interface GenerateRequest {
  output: OutputType;
  quiz: QuizConfigValues;
  cardCount: number;
}

const ALL_TYPES: QuestionType[] = ["mcq", "tf", "short", "fill"];
const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard", "mixed"];

interface GenerateConfigProps {
  wordCount: number;
  generating: boolean;
  onBack: () => void;
  onGenerate: (req: GenerateRequest) => void;
}

export function GenerateConfig({ wordCount, generating, onBack, onGenerate }: GenerateConfigProps) {
  const [output, setOutput] = useState<OutputType>("quiz");
  const [count, setCount] = useState(10);
  const [types, setTypes] = useState<QuestionType[]>(["mcq", "fill"]);
  const [difficulty, setDifficulty] = useState<Difficulty>("mixed");
  const [timed, setTimed] = useState(false);
  const [timeLimitMin, setTimeLimitMin] = useState(10);
  const [cardCount, setCardCount] = useState(15);

  const countId = useId();
  const difficultyId = useId();
  const timeId = useId();
  const cardCountId = useId();

  const toggleType = (type: QuestionType) => {
    setTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

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
        <QuickModeBadge />
      </div>

      {/* Output type */}
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium text-ink">What should we make?</legend>
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
          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm font-medium text-ink">Question types</legend>
            <div className="flex flex-wrap gap-2">
              {ALL_TYPES.map((type) => {
                const checked = types.includes(type);
                return (
                  <label
                    key={type}
                    className={cn(
                      "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
                      checked
                        ? "border-accent bg-accent-tint text-accent"
                        : "border-line-strong bg-surface-2 text-ink-secondary hover:border-ink-muted",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleType(type)}
                      className="size-4 accent-[var(--color-accent-strong)]"
                    />
                    {QUESTION_TYPE_LABELS[type]}
                  </label>
                );
              })}
            </div>
            {types.length === 0 ? (
              <p role="alert" className="text-sm text-error">
                Pick at least one question type.
              </p>
            ) : null}
          </fieldset>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor={countId} className="text-sm font-medium text-ink">
                Number of questions: <span className="font-mono text-accent">{count}</span>
              </label>
              <input
                id={countId}
                type="range"
                min={1}
                max={30}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="accent-[var(--color-accent-strong)]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor={difficultyId} className="text-sm font-medium text-ink">
                Difficulty
              </label>
              <select
                id={difficultyId}
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="min-h-11 rounded-sm border border-line-strong bg-surface-2 px-3 text-sm text-ink outline-none hover:border-ink-muted focus:border-accent"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {DIFFICULTY_LABELS[d]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-md border border-line bg-surface-2 p-4">
            <label className="inline-flex cursor-pointer items-center gap-3 text-sm font-medium text-ink">
              <input
                type="checkbox"
                checked={timed}
                onChange={(e) => setTimed(e.target.checked)}
                className="size-4 accent-[var(--color-accent-strong)]"
              />
              Timed mode <span className="font-normal text-ink-muted">(optional)</span>
            </label>
            {timed ? (
              <div className="flex items-center gap-2">
                <label htmlFor={timeId} className="text-sm text-ink-secondary">
                  Time limit
                </label>
                <input
                  id={timeId}
                  type="number"
                  min={1}
                  max={180}
                  value={timeLimitMin}
                  onChange={(e) => setTimeLimitMin(Math.max(1, Number(e.target.value)))}
                  className="w-20 rounded-sm border border-line-strong bg-raised px-2 py-1.5 font-mono text-sm text-ink outline-none focus:border-accent"
                />
                <span className="text-sm text-ink-secondary">minutes</span>
              </div>
            ) : null}
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-1.5">
          <label htmlFor={cardCountId} className="text-sm font-medium text-ink">
            Number of cards: <span className="font-mono text-accent">{cardCount}</span>
          </label>
          <input
            id={cardCountId}
            type="range"
            min={1}
            max={40}
            value={cardCount}
            onChange={(e) => setCardCount(Number(e.target.value))}
            className="accent-[var(--color-accent-strong)]"
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button
          loading={generating}
          disabled={!canGenerate}
          onClick={() =>
            onGenerate({
              output,
              quiz: { count, types, difficulty, timed, timeLimitSec: timeLimitMin * 60 },
              cardCount,
            })
          }
        >
          <Sparkles size={16} strokeWidth={1.75} aria-hidden />
          Generate {output === "quiz" ? "quiz" : "flashcards"}
        </Button>
        <Button variant="ghost" onClick={onBack} disabled={generating}>
          Back to source
        </Button>
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
        "flex flex-col gap-2 rounded-md border p-4 text-left transition-colors",
        active
          ? "border-accent bg-accent-tint"
          : "border-line-strong bg-surface-2 hover:border-ink-muted",
      )}
    >
      <span
        className={cn(
          "flex size-9 items-center justify-center rounded-md",
          active ? "bg-accent-strong text-on-accent" : "bg-raised text-accent",
        )}
      >
        <Icon size={18} strokeWidth={1.75} aria-hidden />
      </span>
      <span className="font-display text-lg text-ink">{title}</span>
      <span className="text-sm text-ink-secondary">{body}</span>
    </button>
  );
}
