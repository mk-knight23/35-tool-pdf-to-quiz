import { describe, expect, test } from "vitest";
import { buildShareUrl, decodeQuizPayload, encodeQuizPayload, SHARE_PREFIX } from "./share";
import type { Quiz } from "./types";

function sampleQuiz(): Quiz {
  return {
    id: "quiz-1",
    title: "Biology Basics",
    questions: [
      {
        id: "q1",
        type: "mcq",
        prompt: "Which organelle powers the cell?",
        options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi"],
        correctIndex: 1,
        acceptableAnswers: [],
        explanation: "Mitochondria produce ATP.",
        source: "quick",
      },
    ],
    createdAt: "2026-07-17T00:00:00.000Z",
    updatedAt: "2026-07-17T00:00:00.000Z",
    sourceName: "notes.pdf",
    mode: "quick",
    timed: false,
    timeLimitSec: null,
    schemaVersion: 1,
  };
}

describe("encode/decode round trip", () => {
  test("decodes a payload back into the original quiz", () => {
    // Arrange
    const quiz = sampleQuiz();

    // Act
    const payload = encodeQuizPayload(quiz);
    const decoded = decodeQuizPayload(payload);

    // Assert
    expect(decoded).toEqual(quiz);
  });

  test("accepts a full '#quiz=' hash and strips the prefix", () => {
    // Arrange
    const quiz = sampleQuiz();
    const hash = `${SHARE_PREFIX}${encodeQuizPayload(quiz)}`;

    // Act
    const decoded = decodeQuizPayload(hash);

    // Assert
    expect(decoded.id).toBe(quiz.id);
  });
});

describe("decodeQuizPayload validation (audit must-fix)", () => {
  test("throws a friendly error on a corrupted (undecodable) payload", () => {
    // Act / Assert
    expect(() => decodeQuizPayload("!!!not-base64!!!")).toThrow(/corrupted|valid|format/i);
  });

  test("throws when the payload decodes but is not valid JSON", () => {
    // Arrange: base64url of the literal string "not json {" is not valid JSON
    const badJson = encodeURIComponent("");
    const payload = Buffer.from("not json {").toString("base64").replace(/=+$/, "");

    // Act / Assert
    expect(() => decodeQuizPayload(payload + badJson)).toThrow(Error);
  });

  test("throws when JSON is valid but fails the quiz schema", () => {
    // Arrange
    const payload = encodeQuizPayload({ id: "x" } as unknown as Quiz);

    // Act / Assert
    expect(() => decodeQuizPayload(payload)).toThrow(/missing required fields|unexpected format/i);
  });
});

describe("buildShareUrl", () => {
  test("appends the encoded payload to a clean base url", () => {
    // Arrange
    const quiz = sampleQuiz();

    // Act
    const url = buildShareUrl("https://quizflow.mkazi.live/tool", quiz);

    // Assert
    expect(url.startsWith(`https://quizflow.mkazi.live/tool${SHARE_PREFIX}`)).toBe(true);
  });

  test("drops any existing hash fragment from the base before appending", () => {
    // Arrange
    const quiz = sampleQuiz();

    // Act
    const url = buildShareUrl("https://quizflow.mkazi.live/tool#stale", quiz);

    // Assert
    expect(url).not.toContain("#stale");
    expect(url).toContain(SHARE_PREFIX);
  });
});
