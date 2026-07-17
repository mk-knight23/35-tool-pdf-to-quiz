/**
 * Model resolution for the AI routes (STANDARDS §10).
 * Supports both ambient gateway credentials (OIDC / env API key)
 * and custom BYOK user keys passed per-request.
 */

import { createGateway, gateway, type LanguageModel } from "ai";

export type ModelTier = "fast" | "quality";

const DEFAULT_FAST = "anthropic/claude-haiku-4.5";
const DEFAULT_QUALITY = "anthropic/claude-sonnet-4-5";

export function modelIdForTier(tier: ModelTier): string {
  if (tier === "quality") {
    return process.env.AI_MODEL_QUALITY?.trim() || DEFAULT_QUALITY;
  }
  return process.env.AI_MODEL?.trim() || DEFAULT_FAST;
}

export function hasServerCredentials(): boolean {
  return Boolean(
    process.env.AI_GATEWAY_API_KEY?.trim() ||
      process.env.VERCEL_OIDC_TOKEN?.trim()
  );
}

export function resolveModel(
  tier: ModelTier,
  byok: string | null
): LanguageModel {
  const id = modelIdForTier(tier);
  if (byok) {
    const byokGateway = createGateway({ apiKey: byok });
    return byokGateway(id);
  }
  return gateway(id);
}
