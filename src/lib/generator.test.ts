import { describe, expect, test } from "vitest";
import {
  generateFlashcards,
  generateQuiz,
  MIN_WORDS_FOR_GENERATION,
} from "./generator";
import type { QuestionType } from "./types";

const SOURCE = `Photosynthesis is the process by which green plants convert light energy into chemical energy.
Chlorophyll is the pigment that absorbs sunlight inside the chloroplast.
The light-dependent reactions occur in the thylakoid membrane and produce ATP and NADPH.
The Calvin cycle uses ATP and NADPH to fix carbon dioxide into glucose.
Cellular respiration is the reverse process that releases energy from glucose.
Mitochondria are the organelles where cellular respiration takes place.
Glucose is a simple sugar that stores chemical energy for the cell.
Oxygen is released as a byproduct of the light-dependent reactions.`;

describe("generateQuiz", () => {
  test("produces the requested number of questions from rich source text", () => {
    // Arrange
    const opts = { count: 5, types: ["mcq", "fill"] as QuestionType[], difficulty: "medium" as const };

    // Act
    const result = generateQuiz(SOURCE, opts);

    // Assert
    expect(result.questions.length).toBe(5);
  });

  test("returns identical questions for identical input (deterministic)", () => {
    // Arrange
    const opts = { count: 6, types: ["mcq", "fill", "tf"] as QuestionType[], difficulty: "hard" as const };

    // Act
    const first = generateQuiz(SOURCE, opts);
    const second = generateQuiz(SOURCE, opts);

    // Assert
    expect(first.questions).toEqual(second.questions);
  });

  test("warns and returns no questions when the source is too short", () => {
    // Arrange
    const shortText = "Too short to work with.";

    // Act
    const result = generateQuiz(shortText, {
      count: 5,
      types: ["mcq"],
      difficulty: "easy",
    });

    // Assert
    expect(result.questions).toEqual([]);
    expect(result.warnings[0]).toContain(String(MIN_WORDS_FOR_GENERATION));
  });

  test("labels every generated question as quick-mode (non-AI) output", () => {
    // Act
    const result = generateQuiz(SOURCE, {
      count: 4,
      types: ["mcq", "fill"],
      difficulty: "medium",
    });

    // Assert
    for (const question of result.questions) {
      expect(question.source).toBe("quick");
    }
  });

  test("builds MCQ questions with four options and a valid correct index", () => {
    // Act
    const result = generateQuiz(SOURCE, {
      count: 8,
      types: ["mcq"],
      difficulty: "medium",
    });
    const mcqs = result.questions.filter((q) => q.type === "mcq");

    // Assert
    expect(mcqs.length).toBeGreaterThan(0);
    for (const q of mcqs) {
      expect(q.options).toHaveLength(4);
      expect(q.options[q.correctIndex]).toBeTruthy();
    }
  });

  test("builds fill questions that contain a blank marker and an acceptable answer", () => {
    // Act
    const result = generateQuiz(SOURCE, {
      count: 6,
      types: ["fill"],
      difficulty: "medium",
    });
    const fills = result.questions.filter((q) => q.type === "fill");

    // Assert
    expect(fills.length).toBeGreaterThan(0);
    for (const q of fills) {
      expect(q.prompt).toContain("_____");
      expect(q.acceptableAnswers.length).toBeGreaterThan(0);
    }
  });

  test("warns when it cannot reach the requested count", () => {
    // Act
    const result = generateQuiz(SOURCE, {
      count: 100,
      types: ["fill"],
      difficulty: "medium",
    });

    // Assert
    expect(result.questions.length).toBeLessThan(100);
    expect(result.warnings.some((w) => w.includes("of 100"))).toBe(true);
  });
});

describe("generateFlashcards", () => {
  test("produces flashcards with non-empty front and back", () => {
    // Act
    const result = generateFlashcards(SOURCE, 5);

    // Assert
    expect(result.cards.length).toBeGreaterThan(0);
    for (const card of result.cards) {
      expect(card.front.length).toBeGreaterThan(0);
      expect(card.back.length).toBeGreaterThan(0);
    }
  });

  test("returns identical decks for identical input (deterministic)", () => {
    // Act
    const first = generateFlashcards(SOURCE, 6);
    const second = generateFlashcards(SOURCE, 6);

    // Assert
    expect(first.cards).toEqual(second.cards);
  });

  test("initialises every card as due immediately with default ease", () => {
    // Act
    const result = generateFlashcards(SOURCE, 4);

    // Assert
    for (const card of result.cards) {
      expect(card.ease).toBe(2.5);
      expect(card.reps).toBe(0);
      expect(new Date(card.due).getTime()).toBe(0);
    }
  });

  test("warns and returns no cards when the source is too short", () => {
    // Act
    const result = generateFlashcards("Not enough words here.", 5);

    // Assert
    expect(result.cards).toEqual([]);
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});
