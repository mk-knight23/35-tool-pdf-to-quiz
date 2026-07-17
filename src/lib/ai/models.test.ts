import { afterEach, describe, expect, test, vi } from "vitest";
import { hasServerCredentials, modelIdForTier, resolveModel } from "./models";

describe("modelIdForTier", () => {
  afterEach(() => vi.unstubAllEnvs());

  test("defaults the fast tier to a Haiku gateway string", () => {
    // Arrange
    vi.stubEnv("AI_MODEL", "");

    // Act / Assert
    expect(modelIdForTier("fast")).toBe("anthropic/claude-haiku-4.5");
  });

  test("defaults the quality tier to a Sonnet gateway string", () => {
    // Arrange
    vi.stubEnv("AI_MODEL_QUALITY", "");

    // Act / Assert
    expect(modelIdForTier("quality")).toBe("anthropic/claude-sonnet-4-5");
  });

  test("honours an env override for the model id", () => {
    // Arrange
    vi.stubEnv("AI_MODEL", "anthropic/claude-opus-4-6");

    // Act / Assert
    expect(modelIdForTier("fast")).toBe("anthropic/claude-opus-4-6");
  });
});

describe("hasServerCredentials", () => {
  afterEach(() => vi.unstubAllEnvs());

  test("is false when neither gateway key nor OIDC token is present", () => {
    // Arrange
    vi.stubEnv("AI_GATEWAY_API_KEY", "");
    vi.stubEnv("VERCEL_OIDC_TOKEN", "");

    // Act / Assert
    expect(hasServerCredentials()).toBe(false);
  });

  test("is true when a gateway api key is configured", () => {
    // Arrange
    vi.stubEnv("AI_GATEWAY_API_KEY", "test-key");

    // Act / Assert
    expect(hasServerCredentials()).toBe(true);
  });
});

describe("resolveModel", () => {
  test("builds a BYOK-scoped model when a user key is supplied", () => {
    // Act
    const model = resolveModel("fast", "sk-user-byok");

    // Assert
    expect(model).toBeDefined();
  });

  test("falls back to the ambient gateway when no key is supplied", () => {
    // Act
    const model = resolveModel("quality", null);

    // Assert
    expect(model).toBeDefined();
  });
});
