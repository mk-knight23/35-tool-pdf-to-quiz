"use client";

import { Check, RotateCcw, X } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { cn } from "@/lib/cn";
import { type AnswerValue, isCorrect, scoreQuiz } from "@/lib/scoring";
import { formatDuration } from "@/lib/stats";
import type { Question } from "@/lib/types";

interface QuizResultsProps {
  title: string;
  questions: Question[];
  answers: Record<string, AnswerValue>;
  durationSec: number;
  onRetakeAll: () => void;
  onRetakeIncorrect: (incorrectIds: string[]) => void;
  onDone: () => void;
}

function answerText(question: Question, answer: AnswerValue): string {
  if (answer === null || answer === undefined || answer === "") return "No answer";
  if (question.type === "mcq" || question.type === "tf") {
    return typeof answer === "number" ? question.options[answer] ?? "No answer" : "No answer";
  }
  return String(answer);
}

function correctText(question: Question): string {
  if (question.type === "mcq" || question.type === "tf") {
    return question.options[question.correctIndex] ?? "";
  }
  return question.acceptableAnswers.join(" / ");
}

export function QuizResults({
  title,
  questions,
  answers,
  durationSec,
  onRetakeAll,
  onRetakeIncorrect,
  onDone,
}: QuizResultsProps) {
  const summary = useMemo(() => scoreQuiz(questions, answers), [questions, answers]);
  const percent = Math.round(summary.accuracy * 100);

  return (
    <section aria-label={`Results for ${title}`} className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-4 rounded-lg border border-line bg-surface-2 p-6 text-center shadow-paper sm:flex-row sm:text-left">
        <ProgressRing
          value={summary.accuracy}
          size={112}
          label={`Score ${summary.correct} of ${summary.total}`}
          center={`${percent}%`}
        />
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-2xl text-ink">
            {summary.correct} of {summary.total} correct
          </h2>
          <p className="text-sm text-ink-secondary">
            {title} · {formatDuration(durationSec)}
          </p>
          <p className="text-sm text-ink-muted">
            {percent >= 80
              ? "Strong result. Revisit anything you missed to lock it in."
              : percent >= 50
                ? "Solid start. Retake the ones you missed to close the gap."
                : "Early days. Review the answers below, then try again."}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {summary.incorrectIds.length > 0 ? (
          <Button variant="accent" onClick={() => onRetakeIncorrect(summary.incorrectIds)}>
            <RotateCcw size={16} strokeWidth={1.75} aria-hidden />
            Retake {summary.incorrectIds.length} incorrect
          </Button>
        ) : null}
        <Button variant="secondary" onClick={onRetakeAll}>
          Retake all
        </Button>
        <Button variant="ghost" onClick={onDone}>
          Done
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="font-display text-lg text-ink">Review</h3>
        <ol className="flex flex-col gap-3">
          {questions.map((question, i) => {
            const answer = answers[question.id] ?? null;
            const right = isCorrect(question, answer);
            return (
              <li
                key={question.id}
                className={cn(
                  "flex flex-col gap-2 rounded-md border p-4",
                  right ? "border-line bg-surface-2" : "border-error/40 bg-error-tint/40",
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full",
                      right ? "bg-success-tint text-success" : "bg-error-tint text-error",
                    )}
                  >
                    {right ? (
                      <Check size={14} aria-label="Correct" />
                    ) : (
                      <X size={14} aria-label="Incorrect" />
                    )}
                  </span>
                  <div className="flex flex-col gap-1">
                    <p className="font-medium text-ink">
                      {i + 1}. {question.prompt}
                    </p>
                    {!right ? (
                      <p className="text-sm text-ink-secondary">
                        Your answer:{" "}
                        <span className="text-error">{answerText(question, answer)}</span>
                      </p>
                    ) : null}
                    <p className="text-sm text-ink-secondary">
                      Correct answer:{" "}
                      <span className="font-medium text-ink">{correctText(question)}</span>
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
