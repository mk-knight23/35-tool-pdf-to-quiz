/**
 * POST /api/ai/<capability> — single dynamic handler for QuizFlow AI capabilities.
 */

import { generateObject } from "ai";
import { getSpec } from "@/lib/ai/capabilities";
import { getCapabilityMeta, isCapabilityId } from "@/lib/ai/catalog";
import { resolveModel, hasServerCredentials } from "@/lib/ai/models";
import { consumeToken } from "@/lib/ai/rate-limit";
import { consumeQuota, type QuotaResult } from "@/lib/ai/quota";
import { AiError, errorResponse, safeErrorLabel } from "@/lib/ai/errors";
import { byokKey, clientKey } from "@/lib/ai/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_BODY_BYTES = 1024 * 1024; // 1MB body limit (text capabilities)
const MAX_IMAGE_BODY_BYTES = 9 * 1024 * 1024; // vision capabilities carry a base64 image

interface RouteContext {
  params: Promise<{ capability: string }>;
}

function quotaHeaders(quota: QuotaResult | null): Record<string, string> {
  if (!quota) return {};
  return {
    "X-Quota-Limit": String(quota.limit),
    "X-Quota-Remaining": String(quota.remaining),
  };
}

export async function POST(req: Request, context: RouteContext) {
  try {
    const { capability } = await context.params;

    if (!isCapabilityId(capability)) {
      throw new AiError("invalid_capability", "Unknown AI capability.");
    }

    // 1. Rate limit (per client)
    const key = clientKey(req);
    const rate = consumeToken(key);
    if (!rate.ok) {
      throw new AiError(
        "rate_limited",
        "Too many requests in a short time. Please wait a moment.",
        rate.retryAfterSeconds
      );
    }

    // 2. Read and size guard the body (vision capabilities carry a base64 image → larger cap)
    const raw = await req.text();
    const bodyCap = capability === "quiz-image" ? MAX_IMAGE_BODY_BYTES : MAX_BODY_BYTES;
    if (raw.length > bodyCap) {
      throw new AiError("payload_too_large", "The request is too large.");
    }
    let parsedBody: unknown;
    try {
      parsedBody = JSON.parse(raw);
    } catch {
      throw new AiError("invalid_input", "The request body was not valid JSON.");
    }

    // 3. Validate input against the schema
    const spec = getSpec(capability);
    const result = spec.inputSchema.safeParse(parsedBody);
    if (!result.success) {
      const message =
        result.error.issues[0]?.message ??
        `Invalid inputs provided for this capability.`;
      throw new AiError("invalid_input", message);
    }
    const input = result.data;

    // 4. Credentials checks
    const byok = byokKey(req);
    if (!byok && !hasServerCredentials()) {
      throw new AiError(
        "ai_unavailable",
        "AI features are not configured on this server. Please add your own API key in Settings, or use Quick mode."
      );
    }

    // 5. Anonymous quota (skipped for BYOK)
    let quota: QuotaResult | null = null;
    if (!byok) {
      quota = consumeQuota(key);
      if (!quota.ok) {
        throw new AiError(
          "quota_reached",
          "You've reached today's free AI limit. Please add your own API key in Settings to keep studying."
        );
      }
    }

    // 6. Execute capability
    const meta = getCapabilityMeta(capability);
    const model = resolveModel(meta.tier, byok);
    const built = spec.build(input);

    try {
      const hasImages = Array.isArray(built.images) && built.images.length > 0;
      const { object } = await generateObject({
        model,
        schema: spec.outputSchema,
        system: built.system,
        // Vision capabilities send the image(s) as user message content; text
        // capabilities keep the simple prompt form.
        ...(hasImages
          ? {
              messages: [
                {
                  role: "user" as const,
                  content: [
                    { type: "text" as const, text: built.prompt },
                    ...built.images!.map((image) => ({ type: "image" as const, image })),
                  ],
                },
              ],
            }
          : { prompt: built.prompt }),
        abortSignal: req.signal,
      });

      return Response.json(
        { result: object },
        { headers: quotaHeaders(quota) }
      );
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return new Response(null, { status: 499 });
      }
      // Log only a sanitized label — the raw error carries the prompt
      // (user study text) via requestBodyValues/responseBody. See safeErrorLabel.
      console.error(
        `AI Gateway capability [${capability}] error: ${safeErrorLabel(err)}`
      );
      throw new AiError(
        "ai_error",
        "The AI provider was unable to fulfill your request. If using a custom key, check its validity."
      );
    }
  } catch (error) {
    return errorResponse(error);
  }
}
