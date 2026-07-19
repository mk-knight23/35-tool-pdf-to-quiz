/**
 * POST /api/share — publish a quiz to the cloud and return a short share code.
 *
 * This is the only endpoint that persists quiz content server-side, and only on an explicit
 * user "Share" action. No login. Guarded by per-client rate limiting, a strict body-size cap,
 * and zod validation. Documents/PDFs are never accepted here — only a generated quiz object.
 */
import { NextResponse } from "next/server";
import { uploadSharedQuiz } from "@/lib/cloud";
import { clientKey } from "@/lib/ai/request";
import { consumeToken } from "@/lib/ai/rate-limit";
import { quizSchema } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const MAX_BODY_BYTES = 512 * 1024; // 512 KB hard request cap

export async function POST(req: Request) {
  // 1. Rate limit per client (reuses the AI limiter buckets — cheap, in-memory).
  const rate = consumeToken(`share:${clientKey(req)}`);
  if (!rate.ok) {
    return NextResponse.json(
      { error: "Too many share requests. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } }
    );
  }

  // 2. Size guard before parsing.
  const raw = await req.text();
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Quiz is too large to share." }, { status: 413 });
  }

  // 3. Parse + validate.
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const parsed = quizSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Quiz data has an unexpected format." }, { status: 422 });
  }

  // 4. Publish.
  try {
    const { code } = await uploadSharedQuiz(parsed.data);
    return NextResponse.json({ code, path: `/q/${code}` }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Could not publish the quiz right now. Please try again later." },
      { status: 502 }
    );
  }
}
