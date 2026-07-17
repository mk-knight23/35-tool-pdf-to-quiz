// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { isAnalyticsEnabled, sizeBucket, track } from "./analytics";
import { setConsent } from "./prefs";

interface DataLayerWindow extends Window {
  dataLayer?: Array<Record<string, unknown>>;
}

function dataLayer(): Array<Record<string, unknown>> | undefined {
  return (window as DataLayerWindow).dataLayer;
}

/** Map-backed Storage stand-in (jsdom localStorage is unavailable under Node 26 here). */
function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (key: string) => (map.has(key) ? (map.get(key) as string) : null),
    key: (index: number) => Array.from(map.keys())[index] ?? null,
    removeItem: (key: string) => {
      map.delete(key);
    },
    setItem: (key: string, value: string) => {
      map.set(key, String(value));
    },
  };
}

function installStorage(): void {
  Object.defineProperty(window, "localStorage", {
    value: memoryStorage(),
    configurable: true,
  });
}

describe("sizeBucket", () => {
  test("buckets byte sizes into coarse ranges (no raw size leaks)", () => {
    // Act / Assert
    expect(sizeBucket(50_000)).toBe("<100kb");
    expect(sizeBucket(500_000)).toBe("<1mb");
    expect(sizeBucket(3_000_000)).toBe("<5mb");
    expect(sizeBucket(10_000_000)).toBe("<20mb");
    expect(sizeBucket(25_000_000)).toBe(">=20mb");
  });
});

describe("isAnalyticsEnabled", () => {
  beforeEach(() => installStorage());
  afterEach(() => vi.unstubAllEnvs());

  test("is disabled when no GTM container id is configured", () => {
    // Arrange
    vi.stubEnv("NEXT_PUBLIC_GTM_ID", "");
    vi.stubEnv("NODE_ENV", "production");

    // Act / Assert
    expect(isAnalyticsEnabled()).toBe(false);
  });

  test("is disabled outside production even with an id and consent", () => {
    // Arrange
    vi.stubEnv("NEXT_PUBLIC_GTM_ID", "GTM-TEST");
    vi.stubEnv("NODE_ENV", "development");
    setConsent("granted");

    // Act / Assert
    expect(isAnalyticsEnabled()).toBe(false);
  });

  test("is disabled in production until consent is granted", () => {
    // Arrange
    vi.stubEnv("NEXT_PUBLIC_GTM_ID", "GTM-TEST");
    vi.stubEnv("NODE_ENV", "production");
    setConsent("denied");

    // Act / Assert
    expect(isAnalyticsEnabled()).toBe(false);
  });

  test("is enabled only with an id, production, and granted consent", () => {
    // Arrange
    vi.stubEnv("NEXT_PUBLIC_GTM_ID", "GTM-TEST");
    vi.stubEnv("NODE_ENV", "production");
    setConsent("granted");

    // Act / Assert
    expect(isAnalyticsEnabled()).toBe(true);
  });
});

describe("track (consent-gated no-op)", () => {
  beforeEach(() => {
    delete (window as DataLayerWindow).dataLayer;
    installStorage();
  });
  afterEach(() => vi.unstubAllEnvs());

  test("does not touch the data layer when analytics is disabled", () => {
    // Arrange: no GTM id, no consent
    vi.stubEnv("NEXT_PUBLIC_GTM_ID", "");

    // Act
    track("tool_opened", { count: 1 });

    // Assert
    expect(dataLayer()).toBeUndefined();
  });

  test("pushes the event to the data layer once fully enabled", () => {
    // Arrange
    vi.stubEnv("NEXT_PUBLIC_GTM_ID", "GTM-TEST");
    vi.stubEnv("NODE_ENV", "production");
    setConsent("granted");

    // Act
    track("guide_opened", { guide: "getting-started" });

    // Assert
    expect(dataLayer()).toEqual([
      { event: "guide_opened", guide: "getting-started" },
    ]);
  });
});
