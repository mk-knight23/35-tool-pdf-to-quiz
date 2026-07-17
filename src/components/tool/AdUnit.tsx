"use client";

import { useEffect, useState } from "react";
import { Sparkles, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AdUnitProps {
  slot?: string;
  format?: "auto" | "fluid" | "rectangle";
  className?: string;
}

export function AdUnit({ slot = "default-slot", format = "auto", className }: AdUnitProps) {
  const [adClientId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || null;
    }
    return null;
  });

  useEffect(() => {
    if (adClientId) {
      try {
        // Trigger AdSense loader if window.adsbygoogle is ready
        // @ts-expect-error window.adsbygoogle is declared globally
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense unit initialization error:", e);
      }
    }
  }, [adClientId]);

  if (adClientId) {
    return (
      <div className={className} aria-label="Advertisement">
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={adClientId}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Fallback Premium/Sponsorship Unit to wow the user and show active monetization
  return (
    <div
      className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl border border-white/20 dark:border-white/5 bg-gradient-to-r from-accent/10 to-indigo-500/10 p-5 shadow-sm backdrop-blur-md"
    >
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-accent-tint text-accent border border-accent/15 shrink-0 animate-pulse">
          <Sparkles size={18} strokeWidth={2} aria-hidden />
        </span>
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-bold text-ink flex items-center gap-1.5">
            Upgrade to QuizFlow Premium
          </p>
          <p className="text-xs text-ink-secondary leading-relaxed">
            Get unlimited AI question generations, priority servers, and remove all ads.
          </p>
        </div>
      </div>
      <Button
        variant="accent"
        size="sm"
        onClick={() => {
          // Open mock checkout or premium checkout
          window.location.href = "/settings#premium";
        }}
        className="shrink-0 font-semibold"
      >
        <DollarSign size={14} className="stroke-[2.5]" /> Learn More
      </Button>
    </div>
  );
}
