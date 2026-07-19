import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Quiz } from "./types";

const put = vi.fn();
const list = vi.fn();
vi.mock("@vercel/blob", () => ({
  put: (...args: unknown[]) => put(...args),
  list: (...args: unknown[]) => list(...args),
}));

import {
  fetchSharedQuiz,
  isShareCode,
  MAX_SHARED_QUIZ_BYTES,
  newShareCode,
  SHARE_CODE_LENGTH,
  uploadSharedQuiz,
} from "./cloud";

function makeQuiz(overrides: Partial<Quiz> = {}): Quiz {
  return {
    id: "quiz-1",
    title: "Sample",
    questions: [
      {
        id: "q1",
        type: "mcq",
        prompt: "2 + 2 = ?",
        options: ["3", "4"],
        correctIndex: 1,
        acceptableAnswers: [],
        explanation: "",
        source: "quick",
      },
    ],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    sourceName: "Untitled source",
    mode: "quick",
    timed: false,
    timeLimitSec: null,
    schemaVersion: 1,
    ...overrides,
  };
}

beforeEach(() => {
  put.mockReset();
  list.mockReset();
});
afterEach(() => vi.restoreAllMocks());

describe("newShareCode / isShareCode", () => {
  it("generates a code of the exact configured length", () => {
    expect(newShareCode()).toHaveLength(SHARE_CODE_LENGTH);
  });

  it("generates codes that pass isShareCode", () => {
    for (let i = 0; i < 20; i++) expect(isShareCode(newShareCode())).toBe(true);
  });

  it("generates varied codes (not constant)", () => {
    const codes = new Set(Array.from({ length: 10 }, () => newShareCode()));
    expect(codes.size).toBeGreaterThan(1);
  });

  it("rejects malformed codes", () => {
    expect(isShareCode("")).toBe(false);
    expect(isShareCode("SHORT")).toBe(false);
    expect(isShareCode("has spaces")).toBe(false);
    expect(isShareCode("../etc/passwd")).toBe(false);
    expect(isShareCode("UPPERCASE1")).toBe(false);
  });
});

describe("uploadSharedQuiz", () => {
  it("uploads a valid quiz as a public json blob at q/<code>.json", async () => {
    put.mockResolvedValue({ url: "https://blob.example/q/abc.json" });
    const ref = await uploadSharedQuiz(makeQuiz());
    expect(isShareCode(ref.code)).toBe(true);
    expect(ref.url).toBe("https://blob.example/q/abc.json");
    const [path, body, opts] = put.mock.calls[0];
    expect(path).toBe(`q/${ref.code}.json`);
    expect(typeof body).toBe("string");
    expect(opts).toMatchObject({ access: "public", addRandomSuffix: false, contentType: "application/json" });
  });

  it("throws on an invalid quiz and never calls put", async () => {
    // @ts-expect-error intentionally malformed
    await expect(uploadSharedQuiz({ title: "no questions" })).rejects.toThrow(/unexpected format/i);
    expect(put).not.toHaveBeenCalled();
  });

  it("throws on an oversize quiz and never calls put", async () => {
    const huge = makeQuiz({ title: "x".repeat(MAX_SHARED_QUIZ_BYTES + 1) });
    await expect(uploadSharedQuiz(huge)).rejects.toThrow(/too large/i);
    expect(put).not.toHaveBeenCalled();
  });
});

describe("fetchSharedQuiz", () => {
  it("returns null for a malformed code without hitting blob", async () => {
    expect(await fetchSharedQuiz("../secret")).toBeNull();
    expect(list).not.toHaveBeenCalled();
  });

  it("returns null when the blob is missing", async () => {
    list.mockResolvedValue({ blobs: [] });
    expect(await fetchSharedQuiz("abcdef1234")).toBeNull();
  });

  it("fetches, validates, and returns a stored quiz", async () => {
    const quiz = makeQuiz();
    list.mockResolvedValue({ blobs: [{ pathname: "q/abcdef1234.json", url: "https://blob.example/q/abcdef1234.json" }] });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => quiz }));
    const got = await fetchSharedQuiz("abcdef1234");
    expect(got?.id).toBe("quiz-1");
  });

  it("returns null when stored data fails schema validation", async () => {
    list.mockResolvedValue({ blobs: [{ pathname: "q/abcdef1234.json", url: "https://blob.example/q/abcdef1234.json" }] });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ junk: true }) }));
    expect(await fetchSharedQuiz("abcdef1234")).toBeNull();
  });

  it("returns null when the fetch itself fails", async () => {
    list.mockResolvedValue({ blobs: [{ pathname: "q/abcdef1234.json", url: "https://blob.example/q/abcdef1234.json" }] });
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));
    expect(await fetchSharedQuiz("abcdef1234")).toBeNull();
  });
});
