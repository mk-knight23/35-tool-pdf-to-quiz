"use client";

import { ArrowRight, Check, Clock, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { QuickModeBadge } from "@/components/ui/Badge";
import { useAudio } from "@/lib/audio";
import { cn } from "@/lib/cn";
import { type AnswerValue, isCorrect } from "@/lib/scoring";
import { runObjectCapability } from "@/lib/ai/client";
import { getByokKey } from "@/lib/prefs";
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
  const [hint, setHint] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState(false);
  const startRef = useRef(0);
  useEffect(() => {
    startRef.current = Date.now();
  }, []);
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

  const [prevIndex, setPrevIndex] = useState(0);
  if (index !== prevIndex) {
    setPrevIndex(index);
    setHint(null);
  }

  const fetchHint = async () => {
    setLoadingHint(true);
    try {
      const byok = getByokKey();
      const res = await runObjectCapability<{ hint: string; explanation: string }>({
        id: "explain",
        body: {
          prompt: question.prompt,
          options: question.options,
          correctIndex: question.correctIndex,
          acceptableAnswers: question.acceptableAnswers,
          type: question.type,
          userAnswer: null,
        },
        byok,
      });
      setHint(res.result.hint);
    } catch (err) {
      console.error("Failed to load hint:", err);
      setHint("Failed to get hint. Try checking your key.");
    } finally {
      setLoadingHint(false);
    }
  };

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
    setHint(null);
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
      <div className="sticky top-14 z-30 flex flex-col gap-2.5 rounded-2xl border border-white/20 dark:border-white/5 bg-white/25 dark:bg-slate-900/25 p-4 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {quick ? <QuickModeBadge /> : null}
            <span className="text-xs font-semibold text-ink-secondary">
              Question {index + 1} of {questions.length}
            </span>
          </div>
          {timed && timeLimitSec ? (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 font-mono text-xs font-bold tabular-nums",
                remaining <= 30 ? "text-error" : "text-ink-secondary",
              )}
              role="timer"
              aria-live="off"
            >
              <Clock size={14} strokeWidth={2.2} aria-hidden />
              {formatClock(remaining)} left
            </span>
          ) : null}
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/20 dark:bg-slate-800/40 border border-white/10">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-[240ms] ease-(--ease-enter)"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="flex flex-col gap-5 rounded-2xl border border-white/20 dark:border-white/5 bg-white/35 dark:bg-slate-900/40 backdrop-blur-md p-6 shadow-paper">
        <p className="text-2xs font-semibold uppercase tracking-[0.08em] text-ink-muted">
          {QUESTION_TYPE_LABELS[question.type]}
        </p>
        <h2 className="font-display text-xl font-bold leading-snug text-ink">{question.prompt}</h2>

        {isTextType ? (
          <input
            type="text"
            autoComplete="off"
            value={textDraft}
            disabled={revealed}
            onChange={(e) => setTextDraft(e.target.value)}
            placeholder="Type your answer..."
            aria-label="Your answer"
            className="rounded-xl border border-white/20 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-muted focus:border-accent focus:bg-white/40 dark:focus:bg-slate-900/40 transition-all shadow-sm disabled:opacity-60"
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
                      "flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-all duration-150",
                      "min-h-11 disabled:cursor-default hover:-translate-y-0.5 shadow-sm",
                      showRight && "border-success bg-success-tint/65 dark:bg-success-tint/25 text-success font-semibold",
                      showWrong && "border-error bg-error-tint/65 dark:bg-error-tint/25 text-error font-semibold",
                      !revealed && selected && "border-accent bg-accent-tint/60 dark:bg-accent-tint/20 text-ink font-semibold",
                      !revealed && !selected && "border-white/20 dark:border-white/5 bg-white/20 dark:bg-slate-900/20 text-ink hover:border-accent hover:bg-white/35 dark:hover:bg-slate-900/35",
                      revealed && !isRight && !selected && "border-white/10 bg-white/5 dark:bg-slate-900/5 opacity-55",
                    )}
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/20 font-mono text-2xs text-ink-secondary">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-ink">{option}</span>
                    {showRight ? (
                      <Check size={18} className="text-success stroke-[2.5]" aria-label="Correct" />
                    ) : null}
                    {showWrong ? <X size={18} className="text-error stroke-[2.5]" aria-label="Incorrect" /> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {/* Hint Section */}
        {!revealed && !quick && (
          <div className="flex flex-col gap-2 pt-3 border-t border-white/10">
            {hint ? (
              <p className="text-xs italic text-highlight bg-highlight-tint/65 dark:bg-highlight-tint/20 p-3.5 rounded-xl border border-warning/15">
                Hint: {hint}
              </p>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                loading={loadingHint}
                onClick={fetchHint}
                className="self-start text-xs cursor-pointer animate-fade-in"
              >
                Need a hint?
              </Button>
            )}
          </div>
        )}

        {/* Feedback */}
        <div aria-live="polite" className="min-h-0">
          {revealed ? (
            <div
              className={cn(
                "flex flex-col gap-2 rounded-xl border p-4 shadow-sm",
                answeredCorrectly ? "border-success bg-success-tint/65 dark:bg-success-tint/25" : "border-error bg-error-tint/65 dark:bg-error-tint/25",
              )}
            >
              <p
                className={cn(
                  "inline-flex items-center gap-2 text-sm font-bold",
                  answeredCorrectly ? "text-success" : "text-error",
                )}
              >
                {answeredCorrectly ? (
                  <Check size={16} className="stroke-[2.5]" aria-hidden />
                ) : (
                  <X size={16} className="stroke-[2.5]" aria-hidden />
                )}
                {answeredCorrectly ? "Correct" : "Incorrect"}
              </p>
              {!answeredCorrectly ? (
                <p className="text-xs text-ink leading-relaxed">
                  Answer: <span className="font-semibold text-accent">{correctText}</span>
                </p>
              ) : null}
              {question.explanation ? (
                <p className="text-xs text-ink-secondary leading-relaxed">{question.explanation}</p>
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
