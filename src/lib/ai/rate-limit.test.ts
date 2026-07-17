import { beforeEach, describe, expect, test } from "vitest";
import {
  consumeToken,
  DEFAULT_RATE_LIMIT,
  __resetRateLimiter,
} from "./rate-limit";

describe("token-bucket rate limiter", () => {
  beforeEach(() => __resetRateLimiter());

  test("allows up to capacity requests in a burst, then blocks", () => {
    const now = 1_000_000;
    const config = { capacity: 3, refillPerSecond: 0.1 };
    for (let i = 0; i < 3; i++) {
      expect(consumeToken("ip-a", now, config).ok).toBe(true);
    }
    const blocked = consumeToken("ip-a", now, config);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  test("refills over elapsed time", () => {
    const config = { capacity: 2, refillPerSecond: 1 }; // 1 token/sec
    const start = 2_000_000;
    expect(consumeToken("ip-b", start, config).ok).toBe(true);
    expect(consumeToken("ip-b", start, config).ok).toBe(true);
    expect(consumeToken("ip-b", start, config).ok).toBe(false);
    // One second later: exactly one token has refilled.
    expect(consumeToken("ip-b", start + 1000, config).ok).toBe(true);
    expect(consumeToken("ip-b", start + 1000, config).ok).toBe(false);
  });

  test("buckets are isolated per key", () => {
    const now = 3_000_000;
    const config = { capacity: 1, refillPerSecond: 0.01 };
    expect(consumeToken("ip-c", now, config).ok).toBe(true);
    expect(consumeToken("ip-c", now, config).ok).toBe(false);
    // A different key still has a full bucket.
    expect(consumeToken("ip-d", now, config).ok).toBe(true);
  });

  test("retryAfterSeconds is a whole number of at least one second", () => {
    const config = { capacity: 1, refillPerSecond: 0.25 }; // one token / 4s
    const now = 4_000_000;
    consumeToken("ip-e", now, config);
    const blocked = consumeToken("ip-e", now, config);
    expect(blocked.retryAfterSeconds).toBe(4);
    expect(Number.isInteger(blocked.retryAfterSeconds)).toBe(true);
  });

  test("default config permits a reasonable burst", () => {
    const now = 5_000_000;
    let allowed = 0;
    for (let i = 0; i < 20; i++) {
      if (consumeToken("ip-f", now).ok) allowed++;
    }
    expect(allowed).toBe(DEFAULT_RATE_LIMIT.capacity);
  });
});
