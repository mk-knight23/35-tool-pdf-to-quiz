import { beforeEach, describe, expect, test } from "vitest";
import {
  consumeQuota,
  dayKey,
  peekQuota,
  __resetQuota,
} from "./quota";

describe("daily anonymous quota", () => {
  beforeEach(() => __resetQuota());

  const day1 = Date.UTC(2026, 6, 17, 10, 0, 0);
  const day1Late = Date.UTC(2026, 6, 17, 23, 59, 0);
  const day2 = Date.UTC(2026, 6, 18, 0, 1, 0);

  test("consume decrements remaining and blocks at the limit", () => {
    const limit = 3;
    expect(consumeQuota("ip-a", day1, limit)).toMatchObject({
      ok: true,
      remaining: 2,
    });
    expect(consumeQuota("ip-a", day1, limit)).toMatchObject({
      ok: true,
      remaining: 1,
    });
    expect(consumeQuota("ip-a", day1, limit)).toMatchObject({
      ok: true,
      remaining: 0,
    });
    expect(consumeQuota("ip-a", day1, limit)).toMatchObject({
      ok: false,
      remaining: 0,
    });
  });

  test("peek does not consume", () => {
    const limit = 2;
    consumeQuota("ip-b", day1, limit);
    expect(peekQuota("ip-b", day1, limit)).toMatchObject({
      remaining: 1,
      ok: true,
    });
    // Peeking again returns the same value.
    expect(peekQuota("ip-b", day1, limit).remaining).toBe(1);
  });

  test("resets at the UTC day boundary", () => {
    const limit = 1;
    expect(consumeQuota("ip-c", day1Late, limit).ok).toBe(true);
    expect(consumeQuota("ip-c", day1Late, limit).ok).toBe(false);
    // New UTC day -> fresh allowance.
    expect(consumeQuota("ip-c", day2, limit).ok).toBe(true);
  });

  test("counters are isolated per key", () => {
    const limit = 1;
    expect(consumeQuota("ip-d", day1, limit).ok).toBe(true);
    expect(consumeQuota("ip-d", day1, limit).ok).toBe(false);
    expect(consumeQuota("ip-e", day1, limit).ok).toBe(true);
  });

  test("dayKey is a UTC YYYY-MM-DD string", () => {
    expect(dayKey(day1)).toBe("2026-07-17");
    expect(dayKey(day2)).toBe("2026-07-18");
  });
});
