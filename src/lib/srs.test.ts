import { describe, expect, test } from "vitest";
import { dueCount, isDue, reviewCard } from "./srs";
import type { Flashcard } from "./types";

function card(overrides: Partial<Flashcard> = {}): Flashcard {
  return {
    id: "c1",
    front: "Term",
    back: "Definition",
    source: "quick",
    due: new Date(0).toISOString(),
    intervalDays: 0,
    ease: 2.5,
    reps: 0,
    lapses: 0,
    ...overrides,
  };
}

const NOW = new Date("2026-07-17T12:00:00.000Z");

describe("reviewCard", () => {
  test("returns a new card without mutating the original", () => {
    // Arrange
    const original = card();

    // Act
    const updated = reviewCard(original, "good", NOW);

    // Assert
    expect(updated).not.toBe(original);
    expect(original.reps).toBe(0);
  });

  test("schedules the first 'good' review one day out", () => {
    // Act
    const updated = reviewCard(card(), "good", NOW);

    // Assert
    expect(updated.reps).toBe(1);
    expect(updated.intervalDays).toBe(1);
  });

  test("schedules the first 'easy' review three days out", () => {
    // Act
    const updated = reviewCard(card(), "easy", NOW);

    // Assert
    expect(updated.intervalDays).toBe(3);
  });

  test("'again' resets reps, records a lapse, and lowers ease", () => {
    // Arrange
    const learned = card({ reps: 4, intervalDays: 20, ease: 2.5, lapses: 0 });

    // Act
    const updated = reviewCard(learned, "again", NOW);

    // Assert
    expect(updated.reps).toBe(0);
    expect(updated.lapses).toBe(1);
    expect(updated.intervalDays).toBe(0);
    expect(updated.ease).toBe(2.3);
  });

  test("never lowers ease below the 1.3 floor", () => {
    // Arrange
    const fragile = card({ ease: 1.3 });

    // Act
    const updated = reviewCard(fragile, "again", NOW);

    // Assert
    expect(updated.ease).toBeGreaterThanOrEqual(1.3);
  });

  test("grows the interval on a mature 'good' review", () => {
    // Arrange
    const mature = card({ reps: 2, intervalDays: 6, ease: 2.5 });

    // Act
    const updated = reviewCard(mature, "good", NOW);

    // Assert
    expect(updated.intervalDays).toBeGreaterThan(6);
  });
});

describe("isDue", () => {
  test("returns true for a card whose due date has passed", () => {
    // Arrange
    const overdue = card({ due: "2026-07-16T12:00:00.000Z" });

    // Act / Assert
    expect(isDue(overdue, NOW)).toBe(true);
  });

  test("returns false for a card scheduled in the future", () => {
    // Arrange
    const future = card({ due: "2026-07-20T12:00:00.000Z" });

    // Act / Assert
    expect(isDue(future, NOW)).toBe(false);
  });
});

describe("dueCount", () => {
  test("counts only the cards that are currently due", () => {
    // Arrange
    const cards = [
      card({ id: "a", due: "2026-07-10T00:00:00.000Z" }),
      card({ id: "b", due: "2026-07-25T00:00:00.000Z" }),
      card({ id: "c", due: "2026-07-17T00:00:00.000Z" }),
    ];

    // Act / Assert
    expect(dueCount(cards, NOW)).toBe(2);
  });

  test("returns zero when no cards are due", () => {
    // Arrange
    const cards = [card({ due: "2026-08-01T00:00:00.000Z" })];

    // Act / Assert
    expect(dueCount(cards, NOW)).toBe(0);
  });
});
