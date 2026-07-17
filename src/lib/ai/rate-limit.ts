/**
 * In-memory per-IP token-bucket rate limiter (STANDARDS §8).
 * Best-effort only.
 */

export interface RateLimitConfig {
  capacity: number;
  refillPerSecond: number;
}

export const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  capacity: 12,
  refillPerSecond: 12 / 60, // full bucket in 60s
};

export interface RateLimitResult {
  ok: boolean;
  retryAfterSeconds: number;
  remaining: number;
}

interface Bucket {
  tokens: number;
  updatedAt: number;
}

const buckets = new Map<string, Bucket>();

export function consumeToken(
  key: string,
  now: number = Date.now(),
  config: RateLimitConfig = DEFAULT_RATE_LIMIT
): RateLimitResult {
  const existing = buckets.get(key);
  const bucket: Bucket = existing ?? { tokens: config.capacity, updatedAt: now };

  const elapsedSeconds = Math.max(0, (now - bucket.updatedAt) / 1000);
  const refilled = Math.min(
    config.capacity,
    bucket.tokens + elapsedSeconds * config.refillPerSecond
  );

  if (refilled >= 1) {
    const nextTokens = refilled - 1;
    buckets.set(key, { tokens: nextTokens, updatedAt: now });
    return { ok: true, retryAfterSeconds: 0, remaining: Math.floor(nextTokens) };
  }

  const deficit = 1 - refilled;
  const retryAfterSeconds = Math.max(
    1,
    Math.ceil(deficit / config.refillPerSecond)
  );
  buckets.set(key, { tokens: refilled, updatedAt: now });
  return { ok: false, retryAfterSeconds, remaining: 0 };
}

export function __resetRateLimiter(): void {
  buckets.clear();
}
