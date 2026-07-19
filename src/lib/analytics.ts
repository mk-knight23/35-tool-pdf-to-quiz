import { getConsent } from "./prefs";

/**
 * Typed, consent-gated analytics facade (STANDARDS §6).
 * Events push to the GTM dataLayer ONLY when: a container id is configured,
 * NODE_ENV is production, and the user granted consent. Otherwise it is a no-op.
 * NEVER pass document text, quiz content, file names, keys, or free text — counts,
 * bucketed sizes, feature names and durations only.
 */
export type AnalyticsEvent =
  | "tool_opened"
  | "tool_started"
  | "tool_completed"
  | "tool_failed"
  | "file_selected"
  | "file_processed"
  | "ai_started"
  | "ai_completed"
  | "ai_failed"
  | "result_exported"
  | "result_copied"
  | "result_shared"
  | "history_opened"
  | "settings_changed"
  | "feedback_submitted"
  | "guide_opened"
  | "quota_reached"
  | "quiz_cloud_shared"
  | "shared_quiz_started"
  | "shared_quiz_finished"
  | "shared_quiz_cta_clicked";

export type AnalyticsParams = Record<string, string | number | boolean>;

interface DataLayerWindow extends Window {
  dataLayer?: Array<Record<string, unknown>>;
}

function gtmId(): string | undefined {
  return process.env.NEXT_PUBLIC_GTM_ID || undefined;
}

export function isAnalyticsEnabled(): boolean {
  return Boolean(gtmId()) && process.env.NODE_ENV === "production" && getConsent() === "granted";
}

export function track(event: AnalyticsEvent, params: AnalyticsParams = {}): void {
  if (typeof window === "undefined" || !isAnalyticsEnabled()) return;
  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ event, ...params });
}

/** Bucket a byte size so raw file sizes never leak through analytics. */
export function sizeBucket(bytes: number): string {
  if (bytes < 100_000) return "<100kb";
  if (bytes < 1_000_000) return "<1mb";
  if (bytes < 5_000_000) return "<5mb";
  if (bytes < 20_000_000) return "<20mb";
  return ">=20mb";
}
