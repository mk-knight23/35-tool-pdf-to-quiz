/**
 * Structured, safe errors for the AI routes (STANDARDS §8/§10).
 *
 * Error responses never leak stack traces, user text, or keys.
 */

export type AiErrorCode =
  | "method_not_allowed"
  | "invalid_capability"
  | "invalid_input"
  | "payload_too_large"
  | "rate_limited"
  | "quota_reached"
  | "ai_unavailable"
  | "ai_error";

const STATUS_BY_CODE: Record<AiErrorCode, number> = {
  method_not_allowed: 405,
  invalid_capability: 404,
  invalid_input: 400,
  payload_too_large: 413,
  rate_limited: 429,
  quota_reached: 429,
  ai_unavailable: 503,
  ai_error: 502,
};

export interface AiErrorBody {
  error: {
    code: AiErrorCode;
    message: string;
    retryAfterSeconds?: number;
  };
}

export class AiError extends Error {
  readonly code: AiErrorCode;
  readonly retryAfterSeconds?: number;

  constructor(code: AiErrorCode, message: string, retryAfterSeconds?: number) {
    super(message);
    this.name = "AiError";
    this.code = code;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export function statusForCode(code: AiErrorCode): number {
  return STATUS_BY_CODE[code];
}

/**
 * Build a log-safe label for an upstream error.
 *
 * AI SDK errors (e.g. `APICallError`) carry `requestBodyValues` (the prompt =
 * the user's study text) and `responseBody`. Logging the raw error object would
 * write that content to server logs, breaking the STANDARDS §8 "no sensitive
 * logging" rule and the AI_ARCHITECTURE.md zero-retention promise. This returns
 * ONLY the error class name plus an HTTP status code when one is present — never
 * any message body, prompt, or response text.
 */
export function safeErrorLabel(error: unknown): string {
  if (error instanceof Error) {
    const name = error.name || "Error";
    const status = (error as { statusCode?: unknown }).statusCode;
    if (typeof status === "number") {
      return `${name} (status ${status})`;
    }
    return name;
  }
  return "UnknownError";
}

/** Build a JSON Response for an AiError (or unknown error -> ai_error). */
export function errorResponse(error: unknown): Response {
  const aiError =
    error instanceof AiError
      ? error
      : new AiError("ai_error", "The AI service could not complete the request.");

  const body: AiErrorBody = {
    error: {
      code: aiError.code,
      message: aiError.message,
      ...(aiError.retryAfterSeconds !== undefined
        ? { retryAfterSeconds: aiError.retryAfterSeconds }
        : {}),
    },
  };

  const headers: Record<string, string> = {
    "content-type": "application/json; charset=utf-8",
  };
  if (aiError.retryAfterSeconds !== undefined) {
    headers["Retry-After"] = String(aiError.retryAfterSeconds);
  }

  return new Response(JSON.stringify(body), {
    status: statusForCode(aiError.code),
    headers,
  });
}
