import { describe, expect, it } from "vitest";
import { getSpec, SPECS } from "./capabilities";
import { CAPABILITY_IDS, MAX_INPUT_CHARS } from "./catalog";

describe("capability specs registry", () => {
  it("has a spec for every catalog id", () => {
    for (const id of CAPABILITY_IDS) {
      expect(SPECS[id]).toBeDefined();
      expect(getSpec(id).mode).toBe("object");
    }
  });
});

describe("quiz input schema", () => {
  const schema = SPECS.quiz.inputSchema;
  const valid = {
    text: "The mitochondria is the powerhouse of the cell.",
    count: 5,
    types: ["mcq", "tf"],
    difficulty: "medium",
    audience: "university",
  };

  it("accepts a valid request", () => {
    expect(schema.safeParse(valid).success).toBe(true);
  });

  it("rejects empty source text", () => {
    expect(schema.safeParse({ ...valid, text: "   " }).success).toBe(false);
  });

  it("rejects source text over the max length", () => {
    const tooLong = "a".repeat(MAX_INPUT_CHARS + 1);
    expect(schema.safeParse({ ...valid, text: tooLong }).success).toBe(false);
  });

  it("rejects count outside 1..30", () => {
    expect(schema.safeParse({ ...valid, count: 0 }).success).toBe(false);
    expect(schema.safeParse({ ...valid, count: 31 }).success).toBe(false);
  });

  it("rejects an empty types array", () => {
    expect(schema.safeParse({ ...valid, types: [] }).success).toBe(false);
  });

  it("rejects an unknown question type", () => {
    expect(schema.safeParse({ ...valid, types: ["essay"] }).success).toBe(false);
  });

  it("builds a system prompt reflecting count, difficulty and audience", () => {
    const built = SPECS.quiz.build(valid);
    expect(built.system).toContain("5");
    expect(built.system).toContain("medium");
    expect(built.system).toContain("university");
    expect(built.prompt).toBe(valid.text);
  });
});

describe("flashcards input schema", () => {
  const schema = SPECS.flashcards.inputSchema;

  it("accepts a valid request", () => {
    expect(schema.safeParse({ text: "Some notes.", count: 10 }).success).toBe(true);
  });

  it("rejects count over 40", () => {
    expect(schema.safeParse({ text: "Some notes.", count: 41 }).success).toBe(false);
  });
});

describe("explain input schema", () => {
  const schema = SPECS.explain.inputSchema;
  const valid = {
    prompt: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctIndex: 1,
    acceptableAnswers: [],
    type: "mcq",
    userAnswer: 2,
  };

  it("accepts a valid request", () => {
    expect(schema.safeParse(valid).success).toBe(true);
  });

  it("accepts a null user answer", () => {
    expect(schema.safeParse({ ...valid, userAnswer: null }).success).toBe(true);
  });

  it("rejects an empty prompt", () => {
    expect(schema.safeParse({ ...valid, prompt: "" }).success).toBe(false);
  });

  it("caps the number of options", () => {
    const tooMany = Array.from({ length: 11 }, (_, i) => `opt ${i}`);
    expect(schema.safeParse({ ...valid, options: tooMany }).success).toBe(false);
  });

  it("does not leak option indexes into the built prompt instructions", () => {
    const built = SPECS.explain.build(valid);
    expect(built.system).toContain("actual option text");
  });
});

describe("weak-topics input schema", () => {
  const schema = SPECS["weak-topics"].inputSchema;

  it("accepts a valid results array", () => {
    const input = {
      results: [{ prompt: "Q1", type: "mcq", correct: true }],
    };
    expect(schema.safeParse(input).success).toBe(true);
  });

  it("rejects an empty results array", () => {
    expect(schema.safeParse({ results: [] }).success).toBe(false);
  });

  it("rejects more than the max number of results", () => {
    const results = Array.from({ length: 201 }, () => ({
      prompt: "Q",
      type: "mcq" as const,
      correct: false,
    }));
    expect(schema.safeParse({ results }).success).toBe(false);
  });

  it("summarizes correctness in the built prompt", () => {
    const built = SPECS["weak-topics"].build({
      results: [
        { prompt: "Photosynthesis basics", type: "mcq", correct: false },
        { prompt: "Cell division", type: "tf", correct: true },
      ],
    });
    expect(built.prompt).toContain("INCORRECT");
    expect(built.prompt).toContain("CORRECT");
    expect(built.prompt).toContain("Photosynthesis basics");
  });
});

describe("regenerate-one input schema", () => {
  const schema = SPECS["regenerate-one"].inputSchema;
  const valid = {
    text: "Source material about biology.",
    type: "mcq",
    difficulty: "hard",
    existingPrompts: ["What is a cell?"],
  };

  it("accepts a valid request", () => {
    expect(schema.safeParse(valid).success).toBe(true);
  });

  it("lists existing prompts in the build output so duplicates are avoided", () => {
    const built = SPECS["regenerate-one"].build(valid);
    expect(built.system).toContain("What is a cell?");
    expect(built.system).toContain("hard");
  });
});
