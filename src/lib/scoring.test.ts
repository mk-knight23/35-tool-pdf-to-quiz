import { describe, expect, test } from "vitest";
import { isCorrect, scoreQuiz, type AnswerValue } from "./scoring";
import type { Question } from "./types";

function mcq(id: string, correctIndex: number): Question {
  return {
    id,
    type: "mcq",
    prompt: "Pick one",
    options: ["A", "B", "C", "D"],
    correctIndex,
    acceptableAnswers: [],
    explanation: "",
    source: "quick",
  };
}

function fill(id: string, answers: string[]): Question {
  return {
    id,
    type: "fill",
    prompt: "The capital is _____",
    options: [],
    correctIndex: -1,
    acceptableAnswers: answers,
    explanation: "",
    source: "quick",
  };
}

describe("isCorrect", () => {
  test("returns true when an MCQ answer matches the correct index", () => {
    // Act / Assert
    expect(isCorrect(mcq("q1", 2), 2)).toBe(true);
  });

  test("returns false when an MCQ answer is the wrong index", () => {
    // Act / Assert
    expect(isCorrect(mcq("q1", 2), 1)).toBe(false);
  });

  test("returns false for an unanswered question", () => {
    // Act / Assert
    expect(isCorrect(mcq("q1", 0), null)).toBe(false);
  });

  test("matches free-text answers using tolerant normalisation", () => {
    // Arrange
    const question = fill("q2", ["Paris"]);

    // Act / Assert
    expect(isCorrect(question, "  PARIS!! ")).toBe(true);
  });

  test("returns false when free-text does not match any acceptable answer", () => {
    // Act / Assert
    expect(isCorrect(fill("q2", ["Paris"]), "London")).toBe(false);
  });

  test("rejects a numeric answer supplied to a free-text question", () => {
    // Act / Assert
    expect(isCorrect(fill("q2", ["Paris"]), 0 as AnswerValue)).toBe(false);
  });
});

describe("scoreQuiz", () => {
  const questions = [mcq("a", 0), mcq("b", 1), fill("c", ["water"])];

  test("counts correct answers and collects the incorrect ids", () => {
    // Arrange
    const answers: Record<string, AnswerValue> = { a: 0, b: 0, c: "water" };

    // Act
    const summary = scoreQuiz(questions, answers);

    // Assert
    expect(summary.correct).toBe(2);
    expect(summary.total).toBe(3);
    expect(summary.incorrectIds).toEqual(["b"]);
  });

  test("computes accuracy as the fraction of correct answers", () => {
    // Arrange
    const answers: Record<string, AnswerValue> = { a: 0, b: 1, c: "wrong" };

    // Act
    const summary = scoreQuiz(questions, answers);

    // Assert
    expect(summary.accuracy).toBeCloseTo(2 / 3);
  });

  test("treats missing answers as incorrect", () => {
    // Act
    const summary = scoreQuiz(questions, {});

    // Assert
    expect(summary.correct).toBe(0);
    expect(summary.incorrectIds).toEqual(["a", "b", "c"]);
  });

  test("reports zero accuracy for an empty quiz without dividing by zero", () => {
    // Act
    const summary = scoreQuiz([], {});

    // Assert
    expect(summary.accuracy).toBe(0);
    expect(summary.total).toBe(0);
  });
});
