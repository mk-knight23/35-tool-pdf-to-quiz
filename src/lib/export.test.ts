import { describe, expect, test } from "vitest";
import {
  QUICK_MODE_LABEL,
  slugify,
  toCsv,
  toJson,
  toMarkdown,
  toPrintableHtml,
} from "./export";
import { quizSchema, type Quiz } from "./types";

function sampleQuiz(overrides: Partial<Quiz> = {}): Quiz {
  return {
    id: "quiz-1",
    title: "Cell Biology",
    questions: [
      {
        id: "q1",
        type: "mcq",
        prompt: 'Which organelle "powers" the cell?',
        options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi"],
        correctIndex: 1,
        acceptableAnswers: [],
        explanation: "Mitochondria produce ATP.",
        source: "quick",
      },
      {
        id: "q2",
        type: "fill",
        prompt: "Chlorophyll absorbs _____",
        options: [],
        correctIndex: -1,
        acceptableAnswers: ["sunlight", "light"],
        explanation: "It captures light energy.",
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
    ...overrides,
  };
}

describe("toJson", () => {
  test("emits JSON that re-imports through the quiz schema", () => {
    // Arrange
    const quiz = sampleQuiz();

    // Act
    const json = toJson(quiz);
    const reparsed = quizSchema.safeParse(JSON.parse(json));

    // Assert
    expect(reparsed.success).toBe(true);
  });
});

describe("toCsv", () => {
  test("includes a header row and one row per question", () => {
    // Act
    const csv = toCsv(sampleQuiz());
    const lines = csv.split("\n");

    // Assert
    expect(lines[0]).toContain("Question");
    expect(lines).toHaveLength(3); // header + 2 questions
  });

  test("quotes and escapes cells containing quotes or commas", () => {
    // Act
    const csv = toCsv(sampleQuiz());

    // Assert: the prompt with embedded quotes is wrapped and doubled
    expect(csv).toContain('"Which organelle ""powers"" the cell?"');
  });

  test("labels quick-mode quizzes so exports are never mistaken for AI output", () => {
    // Act
    const csv = toCsv(sampleQuiz());

    // Assert
    expect(csv).toContain(QUICK_MODE_LABEL);
  });
});

describe("toMarkdown", () => {
  test("renders a title heading and marks the correct MCQ option", () => {
    // Act
    const md = toMarkdown(sampleQuiz());

    // Assert
    expect(md).toContain("# Cell Biology");
    expect(md).toContain("**✓**");
  });

  test("includes the creator attribution footer", () => {
    // Act
    const md = toMarkdown(sampleQuiz());

    // Assert
    expect(md).toContain("Built and maintained by Kazi Musharraf");
  });
});

describe("toPrintableHtml", () => {
  test("produces a self-contained HTML document with print styles", () => {
    // Act
    const html = toPrintableHtml(sampleQuiz());

    // Assert
    expect(html.startsWith("<!doctype html>")).toBe(true);
    expect(html).toContain("@media print");
  });

  test("escapes HTML-sensitive characters from question text", () => {
    // Arrange
    const quiz = sampleQuiz({
      questions: [
        {
          id: "q1",
          type: "short",
          prompt: "Is 2 < 3 & 4 > 1?",
          options: [],
          correctIndex: -1,
          acceptableAnswers: ["yes"],
          explanation: "",
          source: "quick",
        },
      ],
    });

    // Act
    const html = toPrintableHtml(quiz);

    // Assert
    expect(html).toContain("2 &lt; 3 &amp; 4 &gt; 1");
  });

  test("shows the quick-mode badge for non-AI quizzes", () => {
    // Act
    const html = toPrintableHtml(sampleQuiz());

    // Assert
    expect(html).toContain(QUICK_MODE_LABEL);
  });
});

describe("slugify", () => {
  test("lowercases and replaces non-alphanumerics with hyphens", () => {
    // Act / Assert
    expect(slugify("Cell Biology 101!")).toBe("cell-biology-101");
  });

  test("falls back to 'quiz' when the input has no usable characters", () => {
    // Act / Assert
    expect(slugify("!!!")).toBe("quiz");
  });

  test("caps the slug length at 60 characters", () => {
    // Act
    const slug = slugify("a".repeat(200));

    // Assert
    expect(slug.length).toBeLessThanOrEqual(60);
  });
});
