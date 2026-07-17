import { describe, expect, test } from "vitest";
import {
  CAPABILITIES,
  CAPABILITY_IDS,
  DAILY_AI_LIMIT,
  getCapabilityMeta,
  isCapabilityId,
  MAX_INPUT_CHARS,
} from "./catalog";

describe("isCapabilityId", () => {
  test("accepts a known capability id", () => {
    // Act / Assert
    expect(isCapabilityId("quiz")).toBe(true);
  });

  test("rejects an unknown id", () => {
    // Act / Assert
    expect(isCapabilityId("delete-everything")).toBe(false);
  });
});

describe("getCapabilityMeta", () => {
  test("returns metadata for every declared capability id", () => {
    // Act / Assert
    for (const id of CAPABILITY_IDS) {
      expect(getCapabilityMeta(id).id).toBe(id);
    }
  });

  test("throws for an unknown capability id", () => {
    // Act / Assert
    expect(() => getCapabilityMeta("nope" as never)).toThrow(/Unknown capability/);
  });
});

describe("catalog invariants", () => {
  test("every capability id has exactly one metadata entry", () => {
    // Assert
    expect(CAPABILITIES).toHaveLength(CAPABILITY_IDS.length);
  });

  test("declares sane input and daily quota limits", () => {
    // Assert
    expect(MAX_INPUT_CHARS).toBeGreaterThan(0);
    expect(DAILY_AI_LIMIT).toBeGreaterThan(0);
  });
});
