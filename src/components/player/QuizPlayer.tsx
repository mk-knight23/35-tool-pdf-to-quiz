"use client";

import { ArrowRight, Check, Clock, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { QuickModeBadge } from "@/components/ui/Badge";
import { useAudio } from "@/lib/audio";
import { cn } from "@/lib/cn";
import { type AnswerValue, isCorrect } from "@/lib/scoring";
import { QUESTION_TYPE_LABELS, type Question } from "@/lib/types";

export interface PlaySession {
  answers: Record<string, AnswerValue>;
  durationSec: number;
}

interface QuizPlayerProps {
  title: string;
  questions: Question[];
  quick: boolean;
  timed: boolean;
  timeLimitSec: number | null;
  onFinish: (session: PlaySession) => void;
  onExit: () => void;
}

function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function QuizPlayer({
  title,
  questions,
  quick,
  timed,
  timeLimitSec,
  onFinish,
  onExit,
}: QuizPlayerProps) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [revealed, setRevealed] = useState(false);
  const [textDraft, setTextDraft] = useState("");
  const [remaining, setRemaining] = useState(timed && timeLimitSec ? timeLimitSec : 0);
  const startRef = useRef(Date.now());
  const { playCorrect, playWrong } = useAudio();

  const question = questions[index];
  const isLast = index === questions.length - 1;
  const currentAnswer = answers[question.id] ?? null;
  const isTextType = question.type === "short" || question.type === "fill";

  const finish = useCallback(
    (finalAnswers: Record<string, AnswerValue>) => {
      const durationSec = Math.max(0, Math.round((Date.now() - startRef.current) / 1000));
      onFinish({ answers: finalAnswers, durationSec });
    },
    [onFinish],
  );

  // Countdown timer for timed mode.
  useEffect(() => {
    if (!timed || !timeLimitSec) return;
    const id = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          window.clearInterval(id);
          finish(answers);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timed, timeLimitSec]);

  const select = useCallback(
    (value: AnswerValue) => {
      if (revealed) return;
      setAnswers((prev) => ({ ...prev, [question.id]: value }));
    },
    [question.id, revealed],
  );

  const reveal = useCallback(() => {
    if (revealed) return;
    const answer = isTextType ? (textDraft.trim() ? textDraft : null) : currentAnswer;
    if (answer === null || answer === "") return;
    const settled = { ...answers, [question.id]: answer };
    setAnswers(settled);
    setRevealed(true);
    if (isCorrect(question, answer)) playCorrect();
    else playWrong();
  }, [answers, currentAnswer, isTextType, playCorrect, playWrong, question, revealed, textDraft]);

  const next = useCallback(() => {
    if (isLast) {
      finish(answers);
      return;
    }
    setIndex((i) => i + 1);
    setRevealed(false);
    setTextDraft("");
  }, [answers, finish, isLast]);

  // Keyboard map: 1–4 select, Enter confirm/next, Escape exit (spec F3).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onExit();
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        if (revealed) next();
        else reveal();
        return;
      }
      if (!revealed && !isTextType && /^[1-9]$/.test(e.key)) {
        const optionIndex = Number(e.key) - 1;
        if (optionIndex < question.options.length) {
          const target = e.target as HTMLElement | null;
          if (target?.tagName !== "INPUT" && target?.tagName !== "TEXTAREA") {
            select(optionIndex);
          }
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isTextType, next, onExit, question.options.length, reveal, revealed, select]);

  const progress = (index + (revealed ? 1 : 0)) / questions.length;
  const answeredCorrectly = revealed && isCorrect(question, isTextType ? textDraft : currentAnswer);

  const canReveal = isTextType ? textDraft.trim().length > 0 : currentAnswer !== null;

  const correctText = useMemo(() => {
    if (question.type === "mcq" || question.type === "tf") {
      return question.options[question.correctIndex] ?? "";
    }
    return question.acceptableAnswers.join(" / ");
  }, [question]);

  return (
    <section aria-label={`Playing ${title}`} className="flex flex-col gap-6">
      {/* Sticky progress + timer */}
      <div className="sticky top-14 z-30 flex flex-col gap-2 rounded-md border border-line bg-surface-2/95 p-3 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {quick ? <QuickModeBadge /> : null}
            <span className="text-sm text-ink-secondary">
              Question {index + 1} of {questions.length}
            </span>
          </div>
          {timed && timeLimitSec ? (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 font-mono text-sm tabular-nums",
                remaining <= 30 ? "text-error" : "text-ink-secondary",
              )}
              role="timer"
              aria-live="off"
            >
              <Clock size={14} strokeWidth={1.75} aria-hidden />
              {formatClock(remaining)} left
            </span>
          ) : null}
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-[240ms] ease-(--ease-enter)"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="flex flex-col gap-5 rounded-lg border border-line bg-surface-2 p-6 shadow-paper">
        <p className="text-2xs font-medium uppercase tracking-[0.08em] text-ink-muted">
          {QUESTION_TYPE_LABELS[question.type]}
        </p>
        <h2 className="font-display text-xl leading-snug text-ink">{question.prompt}</h2>

        {isTextType ? (
          <input
            type="text"
            autoComplete="off"
            value={textDraft}
            disabled={revealed}
            onChange={(e) => setTextDraft(e.target.value)}
            placeholder="Type your answer"
            aria-label="Your answer"
            className="rounded-sm border border-line-strong bg-raised px-3 py-2.5 text-base text-ink outline-none placeholder:text-ink-muted focus:border-accent disabled:opacity-70"
          />
        ) : (
          <ul className="flex flex-col gap-2.5" role="listbox" aria-label="Answer options">
            {question.options.map((option, i) => {
              const selected = currentAnswer === i;
              const isRight = i === question.correctIndex;
              const showRight = revealed && isRight;
              const showWrong = revealed && selected && !isRight;
              return (
                <li key={`${question.id}-${i}`}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    disabled={revealed}
                    onClick={() => select(i)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md border px-4 py-3 text-left text-base transition-colors",
                      "min-h-11 disabled:cursor-default",
                      showRight && "border-success bg-success-tint",
                      showWrong && "border-error bg-error-tint",
                      !revealed && selected && "border-accent bg-accent-tint",
                      !revealed && !selected && "border-line-strong bg-raised hover:border-ink-muted",
                      revealed && !isRight && !selected && "border-line bg-raised opacity-70",
                    )}
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-line-strong font-mono text-xs text-ink-secondary">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-ink">{option}</span>
                    {showRight ? (
                      <Check size={18} className="text-success" aria-label="Correct" />
                    ) : null}
                    {showWrong ? <X size={18} className="text-error" aria-label="Incorrect" /> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {/* Feedback */}
        <div aria-live="polite" className="min-h-0">
          {revealed ? (
            <div
              className={cn(
                "flex flex-col gap-2 rounded-md border p-4",
                answeredCorrectly ? "border-success bg-success-tint" : "border-error bg-error-tint",
              )}
            >
              <p
                className={cn(
                  "inline-flex items-center gap-2 text-sm font-semibold",
                  answeredCorrectly ? "text-success" : "text-error",
                )}
              >
                {answeredCorrectly ? (
                  <Check size={16} aria-hidden />
                ) : (
                  <X size={16} aria-hidden />
                )}
                {answeredCorrectly ? "Correct" : "Incorrect"}
              </p>
              {!answeredCorrectly ? (
                <p className="text-sm text-ink">
                  Answer: <span className="font-medium">{correctText}</span>
                </p>
              ) : null}
              {question.explanation ? (
                <p className="text-sm text-ink-secondary">{question.explanation}</p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" onClick={onExit}>
          Exit
        </Button>
        {revealed ? (
          <Button onClick={next}>
            {isLast ? "See results" : "Next question"}
            <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
          </Button>
        ) : (
          <Button variant="accent" disabled={!canReveal} onClick={reveal}>
            Check answer
          </Button>
        )}
      </div>
      <p className="text-center text-xs text-ink-muted">
        Keyboard: press 1&ndash;{Math.min(9, question.options.length || 4)} to choose, Enter to
        confirm, Esc to exit.
      </p>
    </section>
  );
}
