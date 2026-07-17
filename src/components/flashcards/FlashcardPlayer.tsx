"use client";

import { RotateCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { GRADE_LABELS, type ReviewGrade } from "@/lib/srs";
import type { Flashcard } from "@/lib/types";

const GRADES: ReviewGrade[] = ["again", "hard", "good", "easy"];
const GRADE_TONE: Record<ReviewGrade, string> = {
  again: "border-error text-error hover:bg-error-tint",
  hard: "border-warning text-warning hover:bg-warning-tint",
  good: "border-accent text-accent hover:bg-accent-tint",
  easy: "border-success text-success hover:bg-success-tint",
};

interface FlashcardPlayerProps {
  title: string;
  cards: Flashcard[];
  onGrade: (card: Flashcard, grade: ReviewGrade) => void;
  onExit: () => void;
}

export function FlashcardPlayer({ title, cards, onGrade, onExit }: FlashcardPlayerProps) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [graded, setGraded] = useState(0);

  const card = cards[index];
  const done = index >= cards.length;

  const flip = useCallback(() => setFlipped((v) => !v), []);

  const grade = useCallback(
    (value: ReviewGrade) => {
      if (!card) return;
      onGrade(card, value);
      setGraded((g) => g + 1);
      setFlipped(false);
      setIndex((i) => i + 1);
    },
    [card, onGrade],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onExit();
        return;
      }
      if (done) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        flip();
        return;
      }
      if (flipped && /^[1-4]$/.test(e.key)) {
        grade(GRADES[Number(e.key) - 1]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [done, flip, flipped, grade, onExit]);

  if (done) {
    return (
      <section className="flex flex-col items-center gap-4 rounded-lg border border-line bg-surface-2 p-8 text-center shadow-paper">
        <h2 className="font-display text-2xl text-ink">Review complete</h2>
        <p className="text-sm text-ink-secondary">
          You graded {graded} {graded === 1 ? "card" : "cards"} in {title}. Come back when they are
          due again.
        </p>
        <div className="flex gap-3">
          <Button onClick={onExit}>Back to decks</Button>
        </div>
      </section>
    );
  }

  return (
    <section aria-label={`Studying ${title}`} className="flex flex-col gap-5">
      <div className="flex items-center justify-between text-sm text-ink-secondary">
        <span>
          Card {index + 1} of {cards.length}
        </span>
        <Button variant="ghost" size="sm" onClick={onExit}>
          Exit
        </Button>
      </div>

      <div className="qf-flip">
        <div
          className={cn(
            "qf-flip-inner min-h-56 w-full",
            flipped && "is-flipped",
          )}
        >
          <button
            type="button"
            onClick={flip}
            aria-label="Flip card to see the answer"
            className="qf-flip-face qf-flip-front flex min-h-56 w-full flex-col items-center justify-center gap-2 rounded-lg border border-line bg-surface-2 p-8 text-center shadow-paper"
          >
            <span className="text-2xs font-medium uppercase tracking-[0.08em] text-ink-muted">
              Front
            </span>
            <span className="font-display text-2xl text-ink">{card.front}</span>
            <span className="mt-2 inline-flex items-center gap-1.5 text-xs text-ink-muted">
              <RotateCw size={13} strokeWidth={1.75} aria-hidden /> Tap or press Space to flip
            </span>
          </button>
          <button
            type="button"
            onClick={flip}
            aria-label="Flip card to see the question"
            className="qf-flip-face qf-flip-back flex min-h-56 w-full flex-col items-center justify-center gap-2 rounded-lg border border-accent bg-accent-tint p-8 text-center shadow-paper"
          >
            <span className="text-2xs font-medium uppercase tracking-[0.08em] text-accent">
              Back
            </span>
            <span className="text-lg text-ink">{card.back}</span>
          </button>
        </div>
      </div>

      {flipped ? (
        <div className="flex flex-col gap-2">
          <p className="text-center text-sm text-ink-secondary">How well did you know it?</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {GRADES.map((g, i) => (
              <button
                key={g}
                type="button"
                onClick={() => grade(g)}
                className={cn(
                  "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md border bg-surface-2 px-3 py-2 text-sm font-medium transition-colors",
                  GRADE_TONE[g],
                )}
              >
                <span className="font-mono text-xs opacity-70">{i + 1}</span>
                {GRADE_LABELS[g]}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <Button variant="accent" className="self-center" onClick={flip}>
          <RotateCw size={16} strokeWidth={1.75} aria-hidden /> Flip card
        </Button>
      )}
    </section>
  );
}
