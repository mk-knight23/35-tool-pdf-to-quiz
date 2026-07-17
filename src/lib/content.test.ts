import { describe, expect, test } from "vitest";
import { GUIDES } from "./guides";
import { USE_CASES } from "./use-cases";

/** AI-cliche words banned by STANDARDS §9 copy-voice audit. */
const BANNED_WORDS = [
  "unleash",
  "seamless",
  "supercharge",
  "elevate",
  "delve",
  "game-changer",
  "game changer",
  "effortless",
  "in today's fast-paced world",
];

const guides = Object.entries(GUIDES);
const useCases = Object.entries(USE_CASES);

describe("guides content (STANDARDS §4/§9)", () => {
  test("ships at least eight guides", () => {
    // Act / Assert
    expect(guides.length).toBeGreaterThanOrEqual(8);
  });

  test.each(guides)("guide '%s' has complete, substantial fields", (key, guide) => {
    // Assert
    expect(guide.slug).toBe(key);
    expect(guide.title.length).toBeGreaterThan(0);
    expect(guide.description.length).toBeGreaterThan(0);
    expect(guide.readTime).toMatch(/min read/);
    // Substantial original content (~700+ words per STANDARDS §4).
    expect(guide.content.split(/\s+/).length).toBeGreaterThan(400);
  });

  test.each(guides)("guide '%s' avoids banned AI-cliche words", (_key, guide) => {
    // Arrange
    const haystack = `${guide.title} ${guide.description} ${guide.content}`.toLowerCase();

    // Assert
    for (const word of BANNED_WORDS) {
      expect(haystack).not.toContain(word);
    }
  });

  test("guide slugs are unique", () => {
    // Act
    const slugs = guides.map(([, g]) => g.slug);

    // Assert
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("use-cases content (STANDARDS §4/§9)", () => {
  test("ships at least five use cases", () => {
    // Act / Assert
    expect(useCases.length).toBeGreaterThanOrEqual(5);
  });

  test.each(useCases)("use case '%s' has complete fields", (key, useCase) => {
    // Assert
    expect(useCase.slug).toBe(key);
    expect(useCase.title.length).toBeGreaterThan(0);
    expect(useCase.description.length).toBeGreaterThan(0);
    expect(useCase.audience.length).toBeGreaterThan(0);
    expect(useCase.content.length).toBeGreaterThan(200);
  });

  test.each(useCases)("use case '%s' avoids banned AI-cliche words", (_key, useCase) => {
    // Arrange
    const haystack =
      `${useCase.title} ${useCase.description} ${useCase.content}`.toLowerCase();

    // Assert
    for (const word of BANNED_WORDS) {
      expect(haystack).not.toContain(word);
    }
  });
});
