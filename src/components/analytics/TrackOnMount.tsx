"use client";

import { useEffect } from "react";
import { track, type AnalyticsEvent, type AnalyticsParams } from "@/lib/analytics";

/**
 * Fires a single analytics event when mounted. Lets server components (e.g. the
 * guide pages) record a consent-gated event without becoming client components.
 * `track` is a no-op unless analytics are enabled (production + consent + id).
 */
interface TrackOnMountProps {
  event: AnalyticsEvent;
  params?: AnalyticsParams;
}

export function TrackOnMount({ event, params }: TrackOnMountProps) {
  useEffect(() => {
    track(event, params);
  }, [event, params]);
  return null;
}
