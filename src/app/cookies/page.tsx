"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { getConsent, setConsent } from "@/lib/prefs";
import { track } from "@/lib/analytics";

export default function CookiesPage() {
  const [consent, setConsentState] = useState<"granted" | "denied" | null>(null);

  useEffect(() => {
    const c = getConsent();
    window.setTimeout(() => {
      setConsentState(c);
    }, 0);
  }, []);

  const changeConsent = (value: "granted" | "denied") => {
    setConsentState(value);
    setConsent(value);
    track("settings_changed", { setting: "consent" });
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <p className="text-2xs font-medium uppercase tracking-[0.08em] text-accent">Legal</p>
        <h1 className="font-display text-4xl text-ink mt-2">Cookie Policy &amp; Consent</h1>
        <p className="text-ink-secondary mt-2 text-base">
          Manage your tracking preferences. We respect your choice.
        </p>
      </div>

      <hr className="border-line" />

      <div className="qf-prose flex flex-col gap-6 text-sm text-ink-secondary leading-relaxed">
        <section>
          <h2 className="font-display text-xl text-ink">Use of Cookies</h2>
          <p>
            We use Google Tag Manager (GTM) in production to collect anonymous, bucketed usage statistics to help improve the tool. We **never** transmit text files, question content, passwords, or API keys.
          </p>
          <p>
            By default, analytics tracking is fully disabled. You must explicitly opt-in to enable tracking.
          </p>
        </section>

        <section className="flex flex-col gap-3 border border-line bg-surface-2 p-5 rounded-md mt-2">
          <h3 className="font-display text-base font-semibold text-ink">Manage Preferences</h3>
          <p className="text-xs text-ink-secondary">
            Your current selection is stored in your browser&apos;s local storage.
          </p>
          <div className="flex gap-2">
            <Button
              variant={consent === "granted" ? "accent" : "secondary"}
              size="sm"
              onClick={() => changeConsent("granted")}
            >
              Allow Analytics
            </Button>
            <Button
              variant={consent === "denied" || consent === null ? "accent" : "secondary"}
              size="sm"
              onClick={() => changeConsent("denied")}
            >
              Decline Analytics
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
