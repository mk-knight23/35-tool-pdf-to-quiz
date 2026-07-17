"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getConsent, setConsent, type ConsentState } from "@/lib/prefs";

/** Broadcast a consent change so AnalyticsScripts can load/unload without a reload. */
export const CONSENT_EVENT = "qf-consent-change";

function broadcast(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CONSENT_EVENT));
  }
}

/**
 * Cookie consent banner (STANDARDS §6). Analytics stay off by default: the banner
 * only appears when no choice has been recorded yet, and Accept/Decline carry equal
 * visual weight (no dark patterns). The choice is stored locally via prefs; declining
 * is a first-class action, not a smaller "reject" link.
 */
export function ConsentBanner() {
  const [decision, setDecision] = useState<ConsentState>("denied");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setMounted(true);
      setDecision(getConsent());
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  if (!mounted || decision !== null) return null;

  const choose = (value: Exclude<ConsentState, null>) => {
    setConsent(value);
    setDecision(value);
    broadcast();
  };

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-lg border border-line bg-raised p-4 shadow-overlay sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-secondary">
          QuizFlow can load anonymous, bucketed analytics to help improve the tool. Nothing loads
          unless you allow it. We never send your documents, quiz content, file names, or keys. See
          the{" "}
          <Link href="/cookies" className="text-accent underline underline-offset-2">
            cookie policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => choose("denied")}
            className="rounded-md border border-line-strong bg-surface-2 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-ink"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            className="rounded-md bg-accent-strong px-4 py-2 text-sm font-semibold text-on-accent transition-colors hover:opacity-90"
          >
            Allow
          </button>
        </div>
      </div>
    </div>
  );
}
