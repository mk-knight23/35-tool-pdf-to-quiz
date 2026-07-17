import { describe, expect, test } from "vitest";
import { newId } from "./id";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

describe("newId", () => {
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
});
