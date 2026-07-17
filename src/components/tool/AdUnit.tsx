"use client";

import { useEffect } from "react";
import { Heart } from "lucide-react";

/**
 * Reserved ad slot (STANDARDS §7). Ads are DISABLED by default and never load
 * unless BOTH `NEXT_PUBLIC_ADSENSE_ENABLED === "true"` and a publisher client id
 * are set. When enabled, the slot has fixed dimensions to avoid layout shift.
 *
 * When ads are disabled (the default), this renders nothing — or, if an optional
 * honest sponsor link is configured, a small non-tracking "support" callout. It
 * never shows a fake premium tier, fake pricing, or a mock checkout.
 */
interface AdUnitProps {
  slot?: string;
  format?: "auto" | "fluid" | "rectangle";
  className?: string;
}

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
const ADSENSE_ENABLED =
  process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true" && Boolean(ADSENSE_CLIENT_ID);
const SPONSOR_URL = process.env.NEXT_PUBLIC_SPONSOR_URL;

export function AdUnit({ slot = "default-slot", format = "auto", className }: AdUnitProps) {
  useEffect(() => {
    if (!ADSENSE_ENABLED) return;
    try {
      // @ts-expect-error window.adsbygoogle is injected by the AdSense loader
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* AdSense not ready — non-fatal */
    }
  }, []);

  if (ADSENSE_ENABLED) {
    return (
      <div className={className} aria-label="Advertisement">
        <ins
          className="adsbygoogle"
          style={{ display: "block", minHeight: 90 }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Ads disabled. Show an honest sponsor link only if one is configured.
  if (!SPONSOR_URL) return null;

  return (
    <aside
      className={`flex items-center justify-between gap-3 rounded-md border border-line bg-surface-2 p-4 shadow-paper ${className ?? ""}`}
    >
      <div className="flex items-center gap-3">
        <span
          className="flex size-9 items-center justify-center rounded-md bg-accent-tint text-accent"
          aria-hidden
        >
          <Heart size={18} strokeWidth={1.75} />
        </span>
        <p className="text-sm text-ink-secondary">
          QuizFlow is free and open source. If it helps you study, you can support its upkeep.
        </p>
      </div>
      <a
        href={SPONSOR_URL}
        target="_blank"
        rel="noreferrer noopener"
        className="shrink-0 rounded-md border border-line-strong bg-surface px-3 py-2 text-sm font-semibold text-ink transition-colors hover:border-ink"
      >
        Support
      </a>
    </aside>
  );
}
