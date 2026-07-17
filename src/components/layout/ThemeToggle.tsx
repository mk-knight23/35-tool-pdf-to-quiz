"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { applyTheme, getTheme, setTheme, type ThemeMode } from "@/lib/prefs";

const ORDER: ThemeMode[] = ["light", "dark", "system"];
const ICON = { light: Sun, dark: Moon, system: Monitor } as const;
const NEXT_LABEL = {
  light: "Switch to dark theme",
  dark: "Switch to system theme",
  system: "Switch to light theme",
} as const;

/** Tri-state light/dark/system theme toggle, persisted locally (DESIGN_SYSTEM §8). */
export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMode(getTheme());
    setMounted(true);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (getTheme() === "system") applyTheme("system");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const cycle = () => {
    const next = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];
    setMode(next);
    setTheme(next);
    applyTheme(next);
  };

  const Icon = ICON[mode];
  return (
    <button
      type="button"
      onClick={cycle}
      className="inline-flex size-11 items-center justify-center rounded-md border border-line text-ink-secondary transition-colors hover:bg-surface-2 hover:text-ink"
      aria-label={mounted ? NEXT_LABEL[mode] : "Toggle theme"}
      title={mounted ? `Theme: ${mode}` : "Toggle theme"}
    >
      <Icon size={18} strokeWidth={1.75} aria-hidden />
    </button>
  );
}
