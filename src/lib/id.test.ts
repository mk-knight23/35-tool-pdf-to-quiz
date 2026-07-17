import { afterEach, describe, expect, test, vi } from "vitest";
import { newId } from "./id";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Capture the real Web Crypto before any stubbing so the fallback path can
// still draw real random bytes.
const realCrypto = globalThis.crypto;

describe("newId", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("returns a value in UUID format", () => {
    // Act
    const id = newId();

    // Assert
    expect(id).toMatch(UUID_RE);
  });

  test("returns a distinct id on each call (no Math.random collisions)", () => {
    // Act
    const ids = new Set(Array.from({ length: 1000 }, () => newId()));

    // Assert
    expect(ids.size).toBe(1000);
  });

  test("falls back to getRandomValues when randomUUID is unavailable (older Safari)", () => {
    // Arrange: a crypto without randomUUID but with getRandomValues.
    vi.stubGlobal("crypto", {
      getRandomValues: (array: Uint8Array) => realCrypto.getRandomValues(array),
    });

    // Act
    const id = newId();

    // Assert: valid v4 shape with correct version + variant bits.
    expect(id).toMatch(UUID_RE);
    expect(id[14]).toBe("4");
    expect(["8", "9", "a", "b"]).toContain(id[19].toLowerCase());
  });

  test("fallback path still produces distinct ids", () => {
    // Arrange
    vi.stubGlobal("crypto", {
      getRandomValues: (array: Uint8Array) => realCrypto.getRandomValues(array),
    });

    // Act
    const ids = new Set(Array.from({ length: 500 }, () => newId()));

    // Assert
    expect(ids.size).toBe(500);
  });

  test("throws a clear error when no secure crypto is available", () => {
    // Arrange: neither randomUUID nor getRandomValues exists.
    vi.stubGlobal("crypto", {});

    // Act + Assert
    expect(() => newId()).toThrow(/secure crypto/i);
  });
});
