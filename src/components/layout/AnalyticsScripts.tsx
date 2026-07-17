"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { getConsent } from "@/lib/prefs";
import { CONSENT_EVENT } from "./ConsentBanner";

/**
 * Consent- and environment-gated analytics loader (STANDARDS §6).
 *
 * The GTM / GA scripts are injected ONLY when all three hold:
 *   1. NODE_ENV === "production" (never in dev),
 *   2. the relevant container id env var is set, and
 *   3. the user has granted consent.
 *
 * When any condition is false this renders nothing, so no third-party script
 * touches the page. It reacts to consent changes via the CONSENT_EVENT so the
 * user does not need to reload after accepting.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const IS_PROD = process.env.NODE_ENV === "production";

export function AnalyticsScripts() {
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

  if (!IS_PROD || !granted) return null;

  return (
    <>
      {GA_ID ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-loader" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
          </Script>
        </>
      ) : null}
    </>
  );
}
