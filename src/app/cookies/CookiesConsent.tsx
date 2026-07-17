"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CONSENT_EVENT } from "@/components/layout/ConsentBanner";
import { getConsent, setConsent, type ConsentState } from "@/lib/prefs";
import { track } from "@/lib/analytics";

export function CookiesConsent() {
  const [consent, setConsentState] = useState<ConsentState>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setConsentState(getConsent()), 0);
    return () => window.clearTimeout(t);
  }, []);

  const changeConsent = (value: Exclude<ConsentState, null>) => {
    setConsentState(value);
    setConsent(value);
    track("settings_changed", { setting: "consent" });
    // Let the consent-gated loader and banner react without a reload.
    window.dispatchEvent(new Event(CONSENT_EVENT));
  };

  return (
    <section className="flex flex-col gap-3 border border-line bg-surface-2 p-5 rounded-md mt-2">
      <h3 className="font-display text-base font-semibold text-ink">Manage preferences</h3>
      <p className="text-xs text-ink-secondary">
        Your current choice is{" "}
        <span className="font-semibold text-ink">
          {consent === "granted" ? "analytics allowed" : "analytics declined"}
        </span>
        . It is stored only in this browser.
      </p>
      <div className="flex gap-2">
        <Button
          variant={consent === "granted" ? "accent" : "secondary"}
          size="sm"
          onClick={() => changeConsent("granted")}
        >
          Allow analytics
        </Button>
        <Button
          variant={consent === "granted" ? "secondary" : "accent"}
          size="sm"
          onClick={() => changeConsent("denied")}
        >
          Decline analytics
        </Button>
      </div>
    </section>
  );
}
