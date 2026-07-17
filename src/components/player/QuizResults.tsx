"use client";

import { Check, RotateCcw, X, Sparkles, AlertCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { cn } from "@/lib/cn";
import { type AnswerValue, isCorrect, scoreQuiz } from "@/lib/scoring";
import { formatDuration } from "@/lib/stats";
import type { Question } from "@/lib/types";
import { runObjectCapability } from "@/lib/ai/client";
import { getByokKey } from "@/lib/prefs";

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

interface TopicStrength {
  topic: string;
  strength: "weak" | "medium" | "strong";
  guidance: string;
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

  const [analysis, setAnalysis] = useState<{ topics: TopicStrength[]; tasks: string[] } | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setAnalysisError(null);
    try {
      const byok = getByokKey();
      const res = await runObjectCapability<{ topics: TopicStrength[]; tasks: string[] }>({
        id: "weak-topics",
        body: {
          results: questions.map((q) => ({
            prompt: q.prompt,
            type: q.type,
            correct: isCorrect(q, answers[q.id] ?? null),
          })),
        },
        byok,
      });
      setAnalysis(res.result);
    } catch (err) {
      console.error("Analysis failed:", err);
      const msg = err instanceof Error ? err.message : "Failed to analyze results. Check your API key.";
      setAnalysisError(msg);
    } finally {
      setAnalyzing(false);
    }
  };

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

      {/* AI Analysis Block */}
      <div className="rounded-lg border border-line bg-surface-2 p-5 shadow-paper">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <h3 className="font-display text-lg text-ink flex items-center gap-1.5">
              <Sparkles size={16} className="text-accent" /> Weak-Topic Analysis
            </h3>
            <p className="text-xs text-ink-secondary">
              Let AI review your correctness patterns to identify weak areas and suggest concrete revision tasks.
            </p>
          </div>
          {!analysis && (
            <Button
              size="sm"
              loading={analyzing}
              onClick={handleAnalyze}
              className="cursor-pointer"
            >
              Analyze with AI
            </Button>
          )}
        </div>

        {analysisError ? (
          <p role="alert" className="mt-3 text-sm text-error flex items-start gap-2 bg-error-tint p-3 rounded-md">
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            {analysisError}
          </p>
        ) : null}

        {analysis ? (
          <div className="mt-4 flex flex-col gap-4 border-t border-line pt-4 animate-fade-in">
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-semibold text-ink">Topic Strengths</h4>
              <div className="grid gap-3 sm:grid-cols-2">
                {analysis.topics.map((t) => (
                  <div
                    key={t.topic}
                    className="rounded-md border border-line bg-raised p-3.5 flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-sm text-ink">{t.topic}</span>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-3xs font-semibold uppercase tracking-[0.06em]",
                          t.strength === "weak" && "bg-error-tint text-error",
                          t.strength === "medium" && "bg-warning-tint text-warning",
                          t.strength === "strong" && "bg-success-tint text-success"
                        )}
                      >
                        {t.strength}
                      </span>
                    </div>
                    <p className="text-xs text-ink-secondary leading-relaxed">{t.guidance}</p>
                  </div>
                ))}
              </div>
            </div>

            {analysis.tasks.length > 0 ? (
              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-semibold text-ink">Recommended Revision Tasks</h4>
                <ul className="list-disc pl-5 text-xs text-ink-secondary flex flex-col gap-1.5">
                  {analysis.tasks.map((task, idx) => (
                    <li key={idx} className="leading-relaxed">{task}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
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
