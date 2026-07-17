import { describe, expect, test } from "vitest";
import { GENERATION_TIPS, tipAt } from "./tips";

describe("GENERATION_TIPS", () => {
  test("exposes a non-empty list of distinct, non-blank tips", () => {
    // Assert
    expect(GENERATION_TIPS.length).toBeGreaterThan(0);
    expect(GENERATION_TIPS.every((tip) => tip.trim().length > 0)).toBe(true);
    expect(new Set(GENERATION_TIPS).size).toBe(GENERATION_TIPS.length);
  });
});

describe("tipAt", () => {
  test("returns the tip at the given index", () => {
    // Act
    const tip = tipAt(0);

    // Assert
    expect(tip).toBe(GENERATION_TIPS[0]);
  });

  test("wraps around when the index exceeds the list length", () => {
    // Arrange
    const index = GENERATION_TIPS.length + 2;

    // Act
    const tip = tipAt(index);

    // Assert
    expect(tip).toBe(GENERATION_TIPS[2]);
  });

  test("treats negative indexes as their absolute value so it never returns undefined", () => {
    // Act
    const tip = tipAt(-1);

    // Assert
    expect(tip).toBe(GENERATION_TIPS[1]);
    expect(tip).toBeDefined();
  });

  test("is deterministic for a given index", () => {
    // Act + Assert
    expect(tipAt(5)).toBe(tipAt(5));
  });
});
