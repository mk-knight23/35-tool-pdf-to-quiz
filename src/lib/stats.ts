import type { Deck, Quiz, QuizResult } from "./types";

export interface DerivedStats {
  quizzesCreated: number;
  decksCreated: number;
  questionsAnswered: number;
  correctAnswers: number;
  /** 0..1, or null before any quiz has been taken (honest empty state). */
  accuracy: number | null;
  timeStudiedSec: number;
  quizzesTaken: number;
}

export interface StatsInput {
  quizzes: Quiz[];
  decks: Deck[];
  results: QuizResult[];
}

/**
 * Derive dashboard stats from real recorded records (audit must-fix: legacy stat
 * counters were never wired and showed permanent zeros). Because these are computed
 * from actual quizzes/results, creating and taking quizzes always moves the numbers.
 */
export function deriveStats({ quizzes, decks, results }: StatsInput): DerivedStats {
  const questionsAnswered = results.reduce((sum, r) => sum + r.total, 0);
  const correctAnswers = results.reduce((sum, r) => sum + r.correct, 0);
  const timeStudiedSec = results.reduce((sum, r) => sum + r.durationSec, 0);
  return {
    quizzesCreated: quizzes.length,
    decksCreated: decks.length,
    questionsAnswered,
    correctAnswers,
    accuracy: questionsAnswered === 0 ? null : correctAnswers / questionsAnswered,
    timeStudiedSec,
    quizzesTaken: results.length,
  };
}

export function formatDuration(totalSeconds: number): string {
  if (totalSeconds <= 0) return "0m";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function formatPercent(value: number | null): string {
  if (value === null) return "—";
  return `${Math.round(value * 100)}%`;
}
