// @vitest-environment jsdom
import { beforeEach, describe, expect, test } from "vitest";
import {
  clearByokKey,
  getByokKey,
  getConsent,
  getHistoryEnabled,
  getSoundEnabled,
  getTheme,
  resolveDark,
  setByokKey,
  setConsent,
  setHistoryEnabled,
  setSoundEnabled,
  setTheme,
} from "./prefs";

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

beforeEach(() => {
  Object.defineProperty(window, "localStorage", {
    value: memoryStorage(),
    configurable: true,
  });
  Object.defineProperty(window, "sessionStorage", {
    value: memoryStorage(),
    configurable: true,
  });
});

describe("theme preference", () => {
  test("defaults to 'system' when nothing is stored", () => {
    // Act / Assert
    expect(getTheme()).toBe("system");
  });

  test("round-trips a stored theme choice", () => {
    // Act
    setTheme("dark");

    // Assert
    expect(getTheme()).toBe("dark");
  });

  test("ignores an unrecognised stored value", () => {
    // Arrange
    window.localStorage.setItem("quizflow.theme", "neon");

    // Act / Assert
    expect(getTheme()).toBe("system");
  });
});

describe("resolveDark", () => {
  test("resolves an explicit dark mode to true", () => {
    // Act / Assert
    expect(resolveDark("dark")).toBe(true);
  });

  test("resolves an explicit light mode to false", () => {
    // Act / Assert
    expect(resolveDark("light")).toBe(false);
  });
});

describe("sound preference", () => {
  test("defaults to enabled", () => {
    // Act / Assert
    expect(getSoundEnabled()).toBe(true);
  });

  test("round-trips a disabled choice", () => {
    // Act
    setSoundEnabled(false);

    // Assert
    expect(getSoundEnabled()).toBe(false);
  });
});

describe("consent preference", () => {
  test("defaults to null (declined by default)", () => {
    // Act / Assert
    expect(getConsent()).toBeNull();
  });

  test("round-trips a granted choice", () => {
    // Act
    setConsent("granted");

    // Assert
    expect(getConsent()).toBe("granted");
  });
});

describe("history preference", () => {
  test("defaults to enabled", () => {
    // Act / Assert
    expect(getHistoryEnabled()).toBe(true);
  });

  test("round-trips a disabled choice", () => {
    // Act
    setHistoryEnabled(false);

    // Assert
    expect(getHistoryEnabled()).toBe(false);
  });
});

describe("BYOK key (session-scoped)", () => {
  test("returns null before any key is set", () => {
    // Act / Assert
    expect(getByokKey()).toBeNull();
  });

  test("stores and retrieves a key within the session", () => {
    // Act
    setByokKey("sk-local-test");

    // Assert
    expect(getByokKey()).toBe("sk-local-test");
  });

  test("clears a stored key on request", () => {
    // Arrange
    setByokKey("sk-local-test");

    // Act
    clearByokKey();

    // Assert
    expect(getByokKey()).toBeNull();
  });
});
