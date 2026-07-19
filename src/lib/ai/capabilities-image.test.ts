import { describe, expect, it } from "vitest";
import { getCapabilityMeta, isCapabilityId } from "./catalog";
import { getSpec, MAX_IMAGE_DATA_URL_CHARS } from "./capabilities";

const VALID_IMAGE = "data:image/png;base64,AAAABBBBCCCC";

describe("quiz-image capability", () => {
  it("is a registered capability with quality tier", () => {
    expect(isCapabilityId("quiz-image")).toBe(true);
    expect(getCapabilityMeta("quiz-image").tier).toBe("quality");
  });

  it("accepts a valid base64 image data URL", () => {
    const spec = getSpec("quiz-image");
    const parsed = spec.inputSchema.safeParse({
      image: VALID_IMAGE,
      count: 5,
      types: ["mcq"],
      difficulty: "medium",
      audience: "university",
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects a non-image string", () => {
    const spec = getSpec("quiz-image");
    const parsed = spec.inputSchema.safeParse({
      image: "not-an-image",
      count: 5,
      types: ["mcq"],
      difficulty: "medium",
      audience: "university",
    });
    expect(parsed.success).toBe(false);
  });

  it("rejects an oversize image", () => {
    const spec = getSpec("quiz-image");
    const huge = `data:image/png;base64,${"A".repeat(MAX_IMAGE_DATA_URL_CHARS)}`;
    const parsed = spec.inputSchema.safeParse({
      image: huge,
      count: 5,
      types: ["mcq"],
      difficulty: "medium",
      audience: "university",
    });
    expect(parsed.success).toBe(false);
  });

  it("build() returns the image for vision message content", () => {
    const spec = getSpec("quiz-image");
    const built = spec.build({
      image: VALID_IMAGE,
      count: 3,
      types: ["mcq", "tf"],
      difficulty: "hard",
      audience: "professional",
    });
    expect(built.images).toEqual([VALID_IMAGE]);
    expect(built.system).toMatch(/image/i);
    expect(built.prompt.length).toBeGreaterThan(0);
  });
});
