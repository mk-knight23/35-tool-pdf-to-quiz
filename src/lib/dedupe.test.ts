import { describe, expect, test } from "vitest";
import { findDuplicateIds, hasDuplicates } from "./dedupe";
import type { Question } from "./types";

function q(id: string, prompt: string): Question {
  return {
    id,
    type: "short",
    prompt,
    options: [],
    correctIndex: -1,
    acceptableAnswers: [],
    explanation: "",
    source: "quick",
  };
}

describe("findDuplicateIds", () => {
  test("flags the later id when two prompts normalise to the same text", () => {
    // Arrange
    const questions = [q("first", "What is DNA?"), q("second", "what is dna?")];

    // Act
    const dupes = findDuplicateIds(questions);

    // Assert
    expect([...dupes]).toEqual(["second"]);
  });

  test("keeps the first occurrence and does not flag it", () => {
    // Arrange
    const questions = [q("a", "Define osmosis"), q("b", "Define  osmosis.")];

    // Act
    const dupes = findDuplicateIds(questions);

    // Assert
    expect(dupes.has("a")).toBe(false);
    expect(dupes.has("b")).toBe(true);
  });

  test("returns an empty set when all prompts are distinct", () => {
    // Arrange
    const questions = [q("a", "One"), q("b", "Two"), q("c", "Three")];

    // Act / Assert
    expect(findDuplicateIds(questions).size).toBe(0);
  });

  test("treats blank-marker differences as duplicates after normalisation", () => {
    // Arrange
    const questions = [q("a", "The sky is _____"), q("b", "The sky is _____.")];

    // Act / Assert
    expect(findDuplicateIds(questions).has("b")).toBe(true);
  });
});

describe("hasDuplicates", () => {
  test("returns true when at least one duplicate prompt exists", () => {
    // Arrange
    const questions = [q("a", "Same"), q("b", "same")];

    // Act / Assert
    expect(hasDuplicates(questions)).toBe(true);
  });

  test("returns false for a fully unique question set", () => {
    // Arrange
    const questions = [q("a", "Alpha"), q("b", "Beta")];

    // Act / Assert
    expect(hasDuplicates(questions)).toBe(false);
  });
});
