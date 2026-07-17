import { quizSchema, type Quiz } from "./types";

/** Base64url encode a UTF-8 string (browser + node safe). */
function toBase64Url(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  const b64 = typeof btoa === "function" ? btoa(binary) : Buffer.from(bytes).toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(input: string): string {
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const binary = typeof atob === "function" ? atob(b64) : Buffer.from(b64, "base64").toString("binary");
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export const SHARE_PREFIX = "#quiz=";

/** Encode a quiz to a share-URL fragment payload. */
export function encodeQuizPayload(quiz: Quiz): string {
  return toBase64Url(JSON.stringify(quiz));
}

/**
 * Decode + zod-validate a shared payload (audit must-fix: legacy JSON.parse'd with no
 * validation and crashed on malformed input). Accepts a raw payload or a full `#quiz=...` hash.
 * Throws a friendly Error on any malformed / invalid input.
 */
export function decodeQuizPayload(input: string): Quiz {
  const payload = input.startsWith(SHARE_PREFIX) ? input.slice(SHARE_PREFIX.length) : input;
  let json: string;
  try {
    json = fromBase64Url(payload);
  } catch {
    throw new Error("This shared link is corrupted and couldn't be decoded.");
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error("This shared link doesn't contain valid quiz data.");
  }
  const result = quizSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error("This shared quiz is missing required fields or has an unexpected format.");
  }
  return result.data;
}

/** Build a full shareable URL for a quiz given the current origin+path. */
export function buildShareUrl(base: string, quiz: Quiz): string {
  const url = base.split("#")[0];
  return `${url}${SHARE_PREFIX}${encodeQuizPayload(quiz)}`;
}
