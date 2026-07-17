import type { Flashcard } from "./types";

export type ReviewGrade = "again" | "hard" | "good" | "easy";

export const GRADE_LABELS: Record<ReviewGrade, string> = {
  again: "Again",
  hard: "Hard",
  good: "Good",
  easy: "Easy",
};

const DAY_MS = 86_400_000;

/**
 * Lightweight SM-2-style scheduler. Returns a NEW card (immutable) with updated
 * interval, ease and due date. Self-graded — no AI involved.
 */
export function reviewCard(card: Flashcard, grade: ReviewGrade, now = new Date()): Flashcard {
  let { intervalDays, ease, reps, lapses } = card;

  if (grade === "again") {
    reps = 0;
    lapses += 1;
    intervalDays = 0;
    ease = Math.max(1.3, ease - 0.2);
  } else {
    const quality = grade === "hard" ? 3 : grade === "good" ? 4 : 5;
    ease = Math.max(1.3, ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
    reps += 1;
    if (reps === 1) intervalDays = grade === "easy" ? 3 : 1;
    else if (reps === 2) intervalDays = grade === "easy" ? 6 : 3;
    else intervalDays = Math.max(1, Math.round(intervalDays * ease * (grade === "hard" ? 0.8 : 1)));
  }

  const dueMs = grade === "again" ? now.getTime() + 60_000 : now.getTime() + intervalDays * DAY_MS;
  return {
    ...card,
    intervalDays,
    ease: Math.round(ease * 100) / 100,
    reps,
    lapses,
    due: new Date(dueMs).toISOString(),
  };
}

export function isDue(card: Flashcard, now = new Date()): boolean {
  return new Date(card.due).getTime() <= now.getTime();
}

export function dueCount(cards: Flashcard[], now = new Date()): number {
  return cards.filter((c) => isDue(c, now)).length;
}
