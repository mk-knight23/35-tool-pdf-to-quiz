import { afterEach, describe, expect, test, vi } from "vitest";
import { AiClientError, runObjectCapability } from "./client";

function jsonResponse(
  body: unknown,
  init?: { status?: number; headers?: Record<string, string> }
): Response {
  return new Response(JSON.stringify(body), {
    status: init?.status ?? 200,
    headers: { "content-type": "application/json", ...(init?.headers ?? {}) },
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("runObjectCapability", () => {
  test("returns the parsed result and quota snapshot on success", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse(
        { result: { questions: [] } },
        { headers: { "X-Quota-Limit": "40", "X-Quota-Remaining": "39" } }
      )
    );

    const out = await runObjectCapability<{ questions: unknown[] }>({
      id: "quiz",
      body: { text: "hello" },
    });

    expect(out.result).toEqual({ questions: [] });
    expect(out.quota).toEqual({ limit: 40, remaining: 39 });
  });

  test("maps a structured error response to an AiClientError with its code", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse(
        { error: { code: "quota_reached", message: "Daily limit reached." } },
        { status: 429 }
      )
    );

    await expect(
      runObjectCapability({ id: "quiz", body: { text: "hi" } })
    ).rejects.toMatchObject({ code: "quota_reached" });
  });

  test("wraps a generic fetch failure as a network AiClientError", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("Failed to fetch"));

    await expect(
      runObjectCapability({ id: "quiz", body: { text: "hi" } })
    ).rejects.toBeInstanceOf(AiClientError);
    await expect(
      runObjectCapability({ id: "quiz", body: { text: "hi" } })
    ).rejects.toMatchObject({ code: "network" });
  });

  test("re-throws a user-initiated AbortError instead of masking it as network", async () => {
    const abortError = new DOMException("The operation was aborted.", "AbortError");
    vi.spyOn(globalThis, "fetch").mockRejectedValue(abortError);
    const controller = new AbortController();
    controller.abort();

    await expect(
      runObjectCapability({
        id: "quiz",
        body: { text: "hi" },
        signal: controller.signal,
      })
    ).rejects.toBe(abortError);
  });
});
