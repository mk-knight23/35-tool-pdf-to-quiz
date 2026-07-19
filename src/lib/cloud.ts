/**
 * Cloud share (STANDARDS: local-first stays the default; cloud share is explicit + opt-in).
 *
 * Uploads a single quiz as a public JSON blob under a short, unguessable share code so it can
 * be opened by anyone at `/q/<code>` with NO login. This is the only place quiz content leaves
 * the browser, and only when the user clicks "Share". Documents/PDFs are never uploaded — only
 * the generated quiz object, already validated by `quizSchema`.
 */
import { list, put } from "@vercel/blob";
import { newId } from "./id";
import { type Quiz, quizSchema } from "./types";

/** Max serialized quiz size accepted for cloud share (abuse guard — no login on this path). */
export const MAX_SHARED_QUIZ_BYTES = 256 * 1024; // 256 KB

/** Length of the generated share code. */
export const SHARE_CODE_LENGTH = 10;

const CODE_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";
const CODE_RE = new RegExp(`^[a-z0-9]{${SHARE_CODE_LENGTH}}$`);

/** Generate a short, URL-safe, unguessable share code (base36 from crypto UUID entropy). */
export function newShareCode(): string {
  const hex = newId().replace(/-/g, "");
  let out = "";
  for (let i = 0; i < hex.length && out.length < SHARE_CODE_LENGTH; i += 2) {
    out += CODE_ALPHABET[parseInt(hex.slice(i, i + 2), 16) % CODE_ALPHABET.length];
  }
  while (out.length < SHARE_CODE_LENGTH) out += CODE_ALPHABET[0];
  return out;
}

/** True when `code` has the exact share-code shape (cheap guard before any blob call). */
export function isShareCode(code: string): boolean {
  return CODE_RE.test(code);
}

function blobPath(code: string): string {
  return `q/${code}.json`;
}

export interface SharedQuizRef {
  code: string;
  url: string;
}

/**
 * Validate + upload a quiz as a public blob. Throws on invalid input or oversize payload.
 * Returns the share code and the public blob URL.
 */
export async function uploadSharedQuiz(quiz: Quiz): Promise<SharedQuizRef> {
  const parsed = quizSchema.safeParse(quiz);
  if (!parsed.success) {
    throw new Error("Cannot share: the quiz has an unexpected format.");
  }
  const body = JSON.stringify(parsed.data);
  if (new TextEncoder().encode(body).length > MAX_SHARED_QUIZ_BYTES) {
    throw new Error("Cannot share: this quiz is too large to publish.");
  }
  const code = newShareCode();
  const result = await put(blobPath(code), body, {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
  return { code, url: result.url };
}

/**
 * Fetch + validate a shared quiz by code. Returns null when the code is malformed, the blob
 * is missing, or the stored data no longer matches the schema (never throws for those cases).
 */
export async function fetchSharedQuiz(code: string): Promise<Quiz | null> {
  if (!isShareCode(code)) return null;
  const { blobs } = await list({ prefix: blobPath(code), limit: 1 });
  const match = blobs.find((b) => b.pathname === blobPath(code));
  if (!match) return null;
  let json: unknown;
  try {
    const res = await fetch(match.url, { cache: "no-store" });
    if (!res.ok) return null;
    json = await res.json();
  } catch {
    return null;
  }
  const parsed = quizSchema.safeParse(json);
  return parsed.success ? parsed.data : null;
}
