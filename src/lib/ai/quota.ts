/**
 * Anonymous daily quota — server best-effort (STANDARDS §10).
 */

import { DAILY_AI_LIMIT } from "./catalog";

export const DEFAULT_DAILY_QUOTA = DAILY_AI_LIMIT;

export interface QuotaResult {
  ok: boolean;
  limit: number;
  remaining: number;
}

interface Counter {
  day: string;
  count: number;
}

const counters = new Map<string, Counter>();

export function dayKey(now: number = Date.now()): string {
  return new Date(now).toISOString().slice(0, 10);
}

export function peekQuota(
  key: string,
  now: number = Date.now(),
  limit: number = DEFAULT_DAILY_QUOTA
): QuotaResult {
  const today = dayKey(now);
  const counter = counters.get(key);
  const count = counter && counter.day === today ? counter.count : 0;
  return { ok: count < limit, limit, remaining: Math.max(0, limit - count) };
}

export function consumeQuota(
  key: string,
  now: number = Date.now(),
  limit: number = DEFAULT_DAILY_QUOTA
): QuotaResult {
  const today = dayKey(now);
  const counter = counters.get(key);
  const count = counter && counter.day === today ? counter.count : 0;

  if (count >= limit) {
    return { ok: false, limit, remaining: 0 };
  }

  const nextCount = count + 1;
  counters.set(key, { day: today, count: nextCount });
  return { ok: true, limit, remaining: Math.max(0, limit - nextCount) };
}

export function __resetQuota(): void {
  counters.clear();
}
