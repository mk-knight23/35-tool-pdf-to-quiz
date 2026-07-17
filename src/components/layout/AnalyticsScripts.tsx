"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { getConsent } from "@/lib/prefs";
import { CONSENT_EVENT } from "./ConsentBanner";

/**
 * Consent- and environment-gated analytics loader (STANDARDS §6).
 *
 * GTM (the primary container) and an optional standalone GA tag are injected
 * ONLY when all three hold:
 *   1. NODE_ENV === "production" (never in dev),
 *   2. the relevant container id env var is set, and
 *   3. the user has granted consent on the cookie banner (default declined).
 *
 * When any condition is false this renders nothing, so no third-party script
 * touches the page. It reacts to consent changes via the CONSENT_EVENT so the
 * user does not need to reload after accepting. No GTM/GA <noscript> fallback is
 * emitted: without JavaScript there is no way to honour consent, so loading a
 * pixel unconditionally would break the consent gate.
 */
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
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
      {GTM_ID ? (
        <Script id="gtm-loader" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      ) : null}
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
