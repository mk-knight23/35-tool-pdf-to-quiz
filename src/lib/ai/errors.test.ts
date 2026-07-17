import { describe, expect, test } from "vitest";
import { AiError, errorResponse, statusForCode } from "./errors";
import { byokKey, clientKey } from "./request";

describe("AI error responses", () => {
  test("maps codes to the expected HTTP statuses", () => {
    expect(statusForCode("invalid_input")).toBe(400);
    expect(statusForCode("invalid_capability")).toBe(404);
    expect(statusForCode("payload_too_large")).toBe(413);
    expect(statusForCode("rate_limited")).toBe(429);
    expect(statusForCode("quota_reached")).toBe(429);
    expect(statusForCode("ai_unavailable")).toBe(503);
    expect(statusForCode("ai_error")).toBe(502);
    expect(statusForCode("method_not_allowed")).toBe(405);
  });

  test("builds a structured JSON body from an AiError", async () => {
    const response = errorResponse(
      new AiError("invalid_input", "Add some text first.")
    );
    expect(response.status).toBe(400);
    expect(response.headers.get("content-type")).toContain("application/json");
    const body = await response.json();
    expect(body).toEqual({
      error: { code: "invalid_input", message: "Add some text first." },
    });
  });

  test("includes a Retry-After header when provided", async () => {
    const response = errorResponse(
      new AiError("rate_limited", "Slow down.", 7)
    );
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("7");
    const body = await response.json();
    expect(body.error.retryAfterSeconds).toBe(7);
  });

  test("an unknown error becomes a safe ai_error without leaking details", async () => {
    const response = errorResponse(new Error("stack trace with secret path"));
    expect(response.status).toBe(502);
    const body = await response.json();
    expect(body.error.code).toBe("ai_error");
    expect(body.error.message).not.toContain("secret");
  });
});

describe("request helpers", () => {
  test("clientKey prefers the first x-forwarded-for hop", () => {
    const req = new Request("https://x/api/ai/simplify", {
      headers: { "x-forwarded-for": "203.0.113.5, 10.0.0.1" },
    });
    expect(clientKey(req)).toBe("203.0.113.5");
  });

  test("clientKey falls back to unknown when no proxy headers exist", () => {
    const req = new Request("https://x/api/ai/simplify");
    expect(clientKey(req)).toBe("unknown");
  });

  test("byokKey trims and returns null when absent or blank", () => {
    expect(byokKey(new Request("https://x"))).toBeNull();
    expect(
      byokKey(new Request("https://x", { headers: { "x-byok-key": "  " } }))
    ).toBeNull();
    expect(
      byokKey(new Request("https://x", { headers: { "x-byok-key": " key-123 " } }))
    ).toBe("key-123");
  });
});
