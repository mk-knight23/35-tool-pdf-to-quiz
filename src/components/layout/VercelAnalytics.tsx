"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useEffect, useState } from "react";
import { getConsent } from "@/lib/prefs";
import { CONSENT_EVENT } from "./ConsentBanner";

/**
 * Consent-gated Vercel Web Analytics + Speed Insights (STANDARDS §6).
 *
 * These collect page-view / vitals data, so — like GTM/GA — they must not mount
 * until the user accepts on the cookie banner (default declined). When consent
 * is absent this renders nothing, so no Vercel analytics script loads and no
 * page-view is sent. It reacts to consent changes via CONSENT_EVENT so no reload
 * is needed after accepting.
 */
export function VercelAnalytics() {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    const sync = () => setGranted(getConsent() === "granted");
    const t = window.setTimeout(sync, 0);
    window.addEventListener(CONSENT_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener(CONSENT_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (!granted) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
