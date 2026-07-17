/**
 * Tiny local preferences (localStorage only, per STANDARDS §1). SSR-safe: every
 * accessor no-ops / returns a default when `window` is unavailable.
 */
export type ThemeMode = "light" | "dark" | "system";
export type ConsentState = "granted" | "denied" | null;

const KEYS = {
  theme: "quizflow.theme",
  sound: "quizflow.sound",
  consent: "quizflow.consent",
  history: "quizflow.historyEnabled",
} as const;

function hasWindow(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function read(key: string): string | null {
  if (!hasWindow()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string): void {
  if (!hasWindow()) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* storage full or blocked — non-fatal for prefs */
  }
}

export function getTheme(): ThemeMode {
  const v = read(KEYS.theme);
  return v === "light" || v === "dark" || v === "system" ? v : "system";
}
export function setTheme(mode: ThemeMode): void {
  write(KEYS.theme, mode);
}

export function getSoundEnabled(): boolean {
  return read(KEYS.sound) !== "off";
}
export function setSoundEnabled(enabled: boolean): void {
  write(KEYS.sound, enabled ? "on" : "off");
}

export function getConsent(): ConsentState {
  const v = read(KEYS.consent);
  return v === "granted" || v === "denied" ? v : null;
}
export function setConsent(state: Exclude<ConsentState, null>): void {
  write(KEYS.consent, state);
}

export function getHistoryEnabled(): boolean {
  return read(KEYS.history) !== "off";
}
export function setHistoryEnabled(enabled: boolean): void {
  write(KEYS.history, enabled ? "on" : "off");
}

/** Resolve the effective dark/light preference, honouring `system`. */
export function resolveDark(mode: ThemeMode): boolean {
  if (mode === "dark") return true;
  if (mode === "light") return false;
  return hasWindow() && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/** Apply a theme to <html> immediately (class strategy). */
export function applyTheme(mode: ThemeMode): void {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", resolveDark(mode));
}

const SESSION_KEYS = {
  byok: "quizflow.byok",
} as const;

export function getByokKey(): string | null {
  if (typeof window === "undefined" || typeof window.sessionStorage === "undefined") return null;
  try {
    return window.sessionStorage.getItem(SESSION_KEYS.byok);
  } catch {
    return null;
  }
}

export function setByokKey(key: string): void {
  if (typeof window === "undefined" || typeof window.sessionStorage === "undefined") return;
  try {
    window.sessionStorage.setItem(SESSION_KEYS.byok, key);
  } catch {}
}

export function clearByokKey(): void {
  if (typeof window === "undefined" || typeof window.sessionStorage === "undefined") return;
  try {
    window.sessionStorage.removeItem(SESSION_KEYS.byok);
  } catch {}
}

