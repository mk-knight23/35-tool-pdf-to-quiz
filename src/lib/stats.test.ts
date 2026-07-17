import { describe, expect, test } from "vitest";
import { deriveStats, formatDuration, formatPercent } from "./stats";
import type { Deck, Quiz, QuizResult } from "./types";

function quiz(id: string): Quiz {
  return {
    id,
    title: "Q",
    questions: [
      {
        id: `${id}-1`,
        type: "mcq",
        prompt: "?",
        options: ["a", "b", "c", "d"],
        correctIndex: 0,
        acceptableAnswers: [],
        explanation: "",
        source: "quick",
      },
    ],
    createdAt: "2026-07-17T00:00:00.000Z",
    updatedAt: "2026-07-17T00:00:00.000Z",
    sourceName: "src",
    mode: "quick",
    timed: false,
    timeLimitSec: null,
    schemaVersion: 1,
  };
}

function deck(id: string): Deck {
  return {
    id,
    title: "D",
    cards: [
      {
        id: `${id}-c1`,
        front: "f",
        back: "b",
        source: "quick",
        due: new Date(0).toISOString(),
        intervalDays: 0,
        ease: 2.5,
        reps: 0,
        lapses: 0,
      },
    ],
    createdAt: "2026-07-17T00:00:00.000Z",
    updatedAt: "2026-07-17T00:00:00.000Z",
    sourceName: "src",
    mode: "quick",
    schemaVersion: 1,
  };
}

function result(id: string, total: number, correct: number, durationSec: number): QuizResult {
  return {
    id,
    quizId: "q1",
    quizTitle: "Q",
    createdAt: "2026-07-17T00:00:00.000Z",
    durationSec,
    total,
    correct,
    items: [],
    mode: "quick",
  };
}

describe("deriveStats", () => {
  test("reports null accuracy before any quiz has been taken (honest empty state)", () => {
    // Act
    const stats = deriveStats({ quizzes: [], decks: [], results: [] });

    // Assert
    expect(stats.accuracy).toBeNull();
    expect(stats.questionsAnswered).toBe(0);
  });

  test("counts created quizzes and decks from real records", () => {
    // Arrange
    const input = { quizzes: [quiz("a"), quiz("b")], decks: [deck("d")], results: [] };

    // Act
    const stats = deriveStats(input);

    // Assert
    expect(stats.quizzesCreated).toBe(2);
    expect(stats.decksCreated).toBe(1);
  });

  test("aggregates answered, correct, and time studied across results", () => {
    // Arrange
    const input = {
      quizzes: [],
      decks: [],
      results: [result("r1", 10, 7, 120), result("r2", 5, 4, 60)],
    };

    // Act
    const stats = deriveStats(input);

    // Assert
    expect(stats.questionsAnswered).toBe(15);
    expect(stats.correctAnswers).toBe(11);
    expect(stats.timeStudiedSec).toBe(180);
    expect(stats.quizzesTaken).toBe(2);
    expect(stats.accuracy).toBeCloseTo(11 / 15);
  });
});

describe("formatDuration", () => {
  test("returns 0m for a non-positive duration", () => {
    // Act / Assert
    expect(formatDuration(0)).toBe("0m");
    expect(formatDuration(-5)).toBe("0m");
  });

  test("formats sub-minute durations in seconds", () => {
    // Act / Assert
    expect(formatDuration(45)).toBe("45s");
  });

  test("formats minute-scale durations as minutes and seconds", () => {
    // Act / Assert
    expect(formatDuration(150)).toBe("2m 30s");
  });

  test("formats hour-scale durations as hours and minutes", () => {
    // Act / Assert
    expect(formatDuration(3720)).toBe("1h 2m");
  });
});

describe("formatPercent", () => {
  test("renders an em-dash placeholder for null accuracy", () => {
    // Act / Assert
    expect(formatPercent(null)).toBe("—");
  });

  test("rounds a fraction to a whole percentage", () => {
    // Act / Assert
    expect(formatPercent(0.732)).toBe("73%");
  });
});
