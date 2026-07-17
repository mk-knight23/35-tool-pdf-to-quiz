// @vitest-environment jsdom
import "fake-indexeddb/auto";
import { beforeEach, describe, expect, test } from "vitest";
import {
  clearAll,
  deleteQuiz,
  exportAll,
  getQuiz,
  importAll,
  listQuizzes,
  listResults,
  listResultsForQuiz,
  saveDeck,
  saveQuiz,
  saveResult,
} from "./storage";
import type { Deck, Quiz, QuizResult } from "./types";

function quiz(id: string, createdAt: string): Quiz {
  return {
    id,
    title: `Quiz ${id}`,
    questions: [
      {
        id: `${id}-q1`,
        type: "mcq",
        prompt: "?",
        options: ["a", "b", "c", "d"],
        correctIndex: 0,
        acceptableAnswers: [],
        explanation: "",
        source: "quick",
      },
    ],
    createdAt,
    updatedAt: createdAt,
    sourceName: "src",
    mode: "quick",
    timed: false,
    timeLimitSec: null,
    schemaVersion: 1,
  };
}

function deck(id: string, createdAt: string): Deck {
  return {
    id,
    title: `Deck ${id}`,
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
    createdAt,
    updatedAt: createdAt,
    sourceName: "src",
    mode: "quick",
    schemaVersion: 1,
  };
}

function result(id: string, quizId: string, createdAt: string): QuizResult {
  return {
    id,
    quizId,
    quizTitle: "Quiz",
    createdAt,
    durationSec: 60,
    total: 5,
    correct: 4,
    items: [],
    mode: "quick",
  };
}

describe("storage (IndexedDB via idb)", () => {
  // The module memoises one db connection; clearing before each test isolates them.
  beforeEach(async () => {
    await clearAll();
  });

  test("saves a quiz and reads it back by id", async () => {
    // Arrange
    const q = quiz("a", "2026-07-17T00:00:00.000Z");

    // Act
    await saveQuiz(q);
    const fetched = await getQuiz("a");

    // Assert
    expect(fetched).toEqual(q);
  });

  test("lists quizzes newest-first by createdAt", async () => {
    // Arrange
    await saveQuiz(quiz("old", "2026-07-10T00:00:00.000Z"));
    await saveQuiz(quiz("new", "2026-07-17T00:00:00.000Z"));

    // Act
    const list = await listQuizzes();

    // Assert
    expect(list.map((q) => q.id)).toEqual(["new", "old"]);
  });

  test("deletes a quiz by id", async () => {
    // Arrange
    await saveQuiz(quiz("a", "2026-07-17T00:00:00.000Z"));

    // Act
    await deleteQuiz("a");

    // Assert
    expect(await getQuiz("a")).toBeUndefined();
  });

  test("filters results for a specific quiz", async () => {
    // Arrange
    await saveResult(result("r1", "quiz-a", "2026-07-17T00:00:00.000Z"));
    await saveResult(result("r2", "quiz-b", "2026-07-17T00:00:01.000Z"));

    // Act
    const forA = await listResultsForQuiz("quiz-a");

    // Assert
    expect(forA.map((r) => r.id)).toEqual(["r1"]);
  });

  test("clearAll removes quizzes, decks, and results", async () => {
    // Arrange
    await saveQuiz(quiz("a", "2026-07-17T00:00:00.000Z"));
    await saveDeck(deck("d", "2026-07-17T00:00:00.000Z"));
    await saveResult(result("r", "a", "2026-07-17T00:00:00.000Z"));

    // Act
    await clearAll();

    // Assert
    expect(await listQuizzes()).toEqual([]);
    expect(await listResults()).toEqual([]);
  });
});

describe("export / import round trip", () => {
  beforeEach(async () => {
    await clearAll();
  });

  test("exportAll captures saved records in a valid envelope", async () => {
    // Arrange
    await saveQuiz(quiz("a", "2026-07-17T00:00:00.000Z"));

    // Act
    const envelope = await exportAll();

    // Assert
    expect(envelope.app).toBe("mk-quizflow");
    expect(envelope.quizzes).toHaveLength(1);
  });

  test("importAll validates input and rejects a non-export object", async () => {
    // Act / Assert
    await expect(importAll({ not: "an export" })).rejects.toThrow(
      /valid MK QuizFlow export/i,
    );
  });

  test("importAll merges records by id without duplicating existing ones", async () => {
    // Arrange
    await saveQuiz(quiz("a", "2026-07-17T00:00:00.000Z"));
    const envelope = await exportAll();

    // Act: re-importing the same envelope should add nothing new
    const summary = await importAll(envelope);

    // Assert
    expect(summary.quizzes).toBe(0);
    expect(await listQuizzes()).toHaveLength(1);
  });
});
