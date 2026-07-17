/**
 * Browser-side client for the AI routes.
 *
 * - Sends request to `POST /api/ai/<capability>`.
 * - Returns parsed structured results.
 * - Attaches the BYOK key as `x-byok-key` when available.
 * - Surfaces structured errors as `AiClientError`.
 */

import type { AiErrorCode } from "./errors";
import { BYOK_HEADER } from "./request";
import type { CapabilityId } from "./catalog";

export type AiClientErrorCode = AiErrorCode | "network";

export class AiClientError extends Error {
  readonly code: AiClientErrorCode;
  readonly retryAfterSeconds?: number;

  constructor(
    code: AiClientErrorCode,
    message: string,
    retryAfterSeconds?: number
  ) {
    super(message);
    this.name = "AiClientError";
    this.code = code;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

interface BaseRequest {
  id: CapabilityId;
  body: Record<string, unknown>;
  byok?: string | null;
  signal?: AbortSignal;
}

function buildInit(request: BaseRequest): RequestInit {
  const headers: Record<string, string> = {
    "content-type": "application/json",
  };
  if (request.byok) {
    headers[BYOK_HEADER] = request.byok;
  }
  return {
    method: "POST",
    headers,
    body: JSON.stringify(request.body),
    signal: request.signal,
  };
}

async function throwForErrorResponse(response: Response): Promise<never> {
  let code: AiClientErrorCode = "ai_error";
  let message = "Something went wrong. Please try again.";
  let retryAfterSeconds: number | undefined;
  try {
    const body = (await response.json()) as {
      error?: { code?: AiErrorCode; message?: string; retryAfterSeconds?: number };
    };
    if (body.error) {
      if (body.error.code) code = body.error.code;
      if (body.error.message) message = body.error.message;
      retryAfterSeconds = body.error.retryAfterSeconds;
    }
  } catch {
    // Keep defaults
  }
  throw new AiClientError(code, message, retryAfterSeconds);
}

export interface QuotaSnapshot {
  limit: number | null;
  remaining: number | null;
}

function readQuotaHeaders(response: Response): QuotaSnapshot {
  const limit = response.headers.get("X-Quota-Limit");
  const remaining = response.headers.get("X-Quota-Remaining");
  return {
    limit: limit ? Number(limit) : null,
    remaining: remaining ? Number(remaining) : null,
  };
}

export interface ObjectRunResult<T> {
  result: T;
  quota: QuotaSnapshot;
}

export async function runObjectCapability<T>(
  request: BaseRequest
): Promise<ObjectRunResult<T>> {
  let response: Response;
  try {
    response = await fetch(`/api/ai/${request.id}`, buildInit(request));
  } catch {
    throw new AiClientError("network", "Failed to reach the AI server. Check your connection.");
  }

  if (!response.ok) {
    await throwForErrorResponse(response);
  }
  const quota = readQuotaHeaders(response);
  const body = (await response.json()) as { result: T };
  return { result: body.result, quota };
}
