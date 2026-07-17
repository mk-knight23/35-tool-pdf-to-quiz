"use client";

import { Download, HardDrive, Trash2, Upload } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";
import { downloadFile } from "@/lib/export";
import {
  getConsent,
  getHistoryEnabled,
  getSoundEnabled,
  setConsent,
  setHistoryEnabled,
  setSoundEnabled,
  getByokKey,
  setByokKey,
  clearByokKey,
} from "@/lib/prefs";
import {
  clearAll,
  estimateUsage,
  exportAll,
  importAll,
  type ImportSummary,
  type StorageUsage,
} from "@/lib/storage";

/** Ads are on only when explicitly enabled AND a publisher id exists (STANDARDS §7). */
const adsEnabled =
  process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true" &&
  Boolean(process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID);

function formatBytes(bytes: number | null): string {
  if (bytes === null) return "unavailable";
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(1)} ${units[unit]}`;
}

export function SettingsView() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [historyEnabled, setHistoryEnabledState] = useState(true);
  const [soundEnabled, setSoundEnabledState] = useState(true);
  const [consent, setConsentState] = useState<"granted" | "denied" | null>(null);
  const [usage, setUsage] = useState<StorageUsage>({ usageBytes: null, quotaBytes: null });
  const [replaceOnImport, setReplaceOnImport] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [byok, setByokState] = useState("");
  const [byokStatus, setByokStatus] = useState<string | null>(null);

  const refreshUsage = useCallback(async () => {
    setUsage(await estimateUsage());
  }, []);

  useEffect(() => {
    let active = true;
    void (async () => {
      // Read client-only values after the estimate resolves so every state
      // update lands in a microtask (avoids synchronous setState-in-effect).
      const estimate = await estimateUsage();
      if (!active) return;
      setHistoryEnabledState(getHistoryEnabled());
      setSoundEnabledState(getSoundEnabled());
      setConsentState(getConsent());
      setByokState(getByokKey() || "");
      setUsage(estimate);
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleExport = useCallback(async () => {
    const envelope = await exportAll();
    const stamp = new Date().toISOString().slice(0, 10);
    downloadFile(`mk-quizflow-backup-${stamp}.json`, JSON.stringify(envelope, null, 2), "application/json");
    track("result_exported", { kind: "backup" });
  }, []);

  const handleImportFile = useCallback(
    async (file: File) => {
      setImportError(null);
      setImportMessage(null);
      try {
        const text = await file.text();
        const raw = JSON.parse(text);
        const summary: ImportSummary = await importAll(raw, replaceOnImport);
        setImportMessage(
          `Imported ${summary.quizzes} quizzes, ${summary.decks} decks and ${summary.results} results.`,
        );
        await refreshUsage();
      } catch (err) {
        setImportError(
          err instanceof Error ? err.message : "That file couldn't be imported.",
        );
      } finally {
        if (fileRef.current) fileRef.current.value = "";
      }
    },
    [refreshUsage, replaceOnImport],
  );

  const handleClear = useCallback(async () => {
    await clearAll();
    setConfirmClear(false);
    setCleared(true);
    await refreshUsage();
    window.setTimeout(() => setCleared(false), 3000);
  }, [refreshUsage]);

  const toggleHistory = (value: boolean) => {
    setHistoryEnabledState(value);
    setHistoryEnabled(value);
    track("settings_changed", { setting: "history" });
  };

  const toggleSound = (value: boolean) => {
    setSoundEnabledState(value);
    setSoundEnabled(value);
    track("settings_changed", { setting: "sound" });
  };

  const changeConsent = (value: "granted" | "denied") => {
    setConsentState(value);
    setConsent(value);
    track("settings_changed", { setting: "consent" });
  };

  const handleSaveByok = () => {
    setByokKey(byok.trim());
    setByokStatus("Key saved to session memory.");
    track("settings_changed", { setting: "byok_key_saved" });
    window.setTimeout(() => setByokStatus(null), 3000);
  };

  const handleClearByok = () => {
    clearByokKey();
    setByokState("");
    setByokStatus("Key cleared from session memory.");
    track("settings_changed", { setting: "byok_key_cleared" });
    window.setTimeout(() => setByokStatus(null), 3000);
  };

  const usagePercent =
    usage.usageBytes !== null && usage.quotaBytes
      ? Math.min(100, Math.round((usage.usageBytes / usage.quotaBytes) * 100))
      : null;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl text-ink">Settings</h1>
        <p className="mt-1 text-sm text-ink-secondary">
          All settings and data are stored on this device.
        </p>
      </div>

      {/* Data */}
      <Section title="Your data" description="Back up, restore, or remove everything QuizFlow has saved locally.">
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={handleExport}>
            <Download size={16} strokeWidth={1.75} aria-hidden /> Export all data
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            aria-hidden
            tabIndex={-1}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleImportFile(file);
            }}
          />
          <Button variant="secondary" onClick={() => fileRef.current?.click()}>
            <Upload size={16} strokeWidth={1.75} aria-hidden /> Import from file
          </Button>
          <Button variant="destructive" onClick={() => setConfirmClear(true)}>
            <Trash2 size={16} strokeWidth={1.75} aria-hidden /> Clear all data
          </Button>
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-ink-secondary">
          <input
            type="checkbox"
            checked={replaceOnImport}
            onChange={(e) => setReplaceOnImport(e.target.checked)}
            className="size-4 accent-[var(--color-accent-strong)]"
          />
          Replace existing data when importing (otherwise new records are merged)
        </label>
        {importMessage ? (
          <p role="status" className="text-sm text-success">
            {importMessage}
          </p>
        ) : null}
        {importError ? (
          <p role="alert" className="text-sm text-error">
            {importError}
          </p>
        ) : null}
        {cleared ? (
          <p role="status" className="text-sm text-success">
            All local data cleared.
          </p>
        ) : null}
      </Section>

      {/* Storage usage */}
      <Section title="Storage usage" description="An estimate reported by your browser for this site.">
        <div className="flex flex-col gap-2">
          <p className="inline-flex items-center gap-2 text-sm text-ink">
            <HardDrive size={16} strokeWidth={1.75} className="text-accent" aria-hidden />
            <span className="font-mono">
              {formatBytes(usage.usageBytes)}
              {usage.quotaBytes ? ` of ${formatBytes(usage.quotaBytes)}` : ""}
            </span>
          </p>
          {usagePercent !== null ? (
            <div className="h-1.5 max-w-xs overflow-hidden rounded-full bg-line">
              <div className="h-full rounded-full bg-accent" style={{ width: `${usagePercent}%` }} />
            </div>
          ) : null}
        </div>
      </Section>

      {/* Privacy */}
      <Section title="Privacy" description="Control what QuizFlow records and whether analytics are allowed.">
        <ToggleRow
          label="Record quiz history"
          hint="When off, playing a quiz won't save results or update dashboard stats."
          checked={historyEnabled}
          onChange={toggleHistory}
        />
        <ToggleRow
          label="Sound effects"
          hint="Short tones for correct and incorrect answers in the quiz player."
          checked={soundEnabled}
          onChange={toggleSound}
        />
        <div className="flex flex-col gap-2 border-t border-line pt-4">
          <p className="text-sm font-medium text-ink">Analytics consent</p>
          <p className="text-sm text-ink-secondary">
            Analytics stay off unless you allow them, and even then they only load in production. No
            document text, quiz content, file names or keys are ever sent.
          </p>
          <div className="flex gap-2">
            <Button
              variant={consent === "granted" ? "accent" : "secondary"}
              size="sm"
              onClick={() => changeConsent("granted")}
            >
              Allow
            </Button>
            <Button
              variant={consent === "denied" || consent === null ? "accent" : "secondary"}
              size="sm"
              onClick={() => changeConsent("denied")}
            >
              Decline
            </Button>
          </div>
        </div>
      </Section>

      {/* Appearance */}
      <Section title="Appearance" description="Choose light, dark, or match your system.">
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <span className="text-sm text-ink-secondary">Cycles light → dark → system.</span>
        </div>
      </Section>

      {/* AI */}
      <Section
        title="AI features"
        description="Quick mode is the default and needs no key. An optional AI layer can produce reworded questions."
      >
        <p className="text-xs text-ink-secondary leading-relaxed">
          AI mode uses this site&apos;s shared free daily allowance first. If it&apos;s unavailable or
          you reach the daily limit, bring your own Vercel AI Gateway key — it is held only in this
          browser tab&apos;s session memory for the request, never written to disk, and never sent to
          analytics.
        </p>
        <div className="flex flex-col gap-3 max-w-md pt-1">
          <label htmlFor="byok-input" className="text-xs font-semibold text-ink">
            Bring Your Own API Key (Vercel AI Gateway):
          </label>
          <div className="flex gap-2">
            <input
              id="byok-input"
              type="password"
              value={byok}
              onChange={(e) => setByokState(e.target.value)}
              placeholder="vck_…"
              className="flex-1 rounded-xl border border-white/20 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 px-3.5 py-2 text-xs text-ink outline-none focus:border-accent focus:bg-white/40 dark:focus:bg-slate-900/40 transition-all shadow-sm"
            />
            <Button size="sm" onClick={handleSaveByok} disabled={byok.trim().length === 0}>
              Save
            </Button>
            <Button size="sm" variant="secondary" onClick={handleClearByok}>
              Clear
            </Button>
          </div>
          {byokStatus ? (
            <p role="status" className="text-xs font-semibold text-success mt-0.5">
              {byokStatus}
            </p>
          ) : null}
        </div>
      </Section>

      {/* Analytics Configuration */}
      <Section
        title="Analytics & Tracking"
        description="Monitor web traffic, user behaviors, and speed insights. Configured via environment variables."
      >
        <div className="flex flex-col gap-4">
          <p className="text-xs text-ink-secondary leading-relaxed">
            Google Analytics (GA4) and Google Tag Manager (GTM) are wired up but stay off until you
            allow analytics above. Even with a container id set, the scripts load only in production
            builds and only after consent. They never receive document text, quiz content, file
            names, or keys — just counts, durations, and feature names.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-line bg-surface-2 p-4 flex flex-col gap-1.5">
              <span className="font-semibold text-xs text-ink">Google Analytics (GA4)</span>
              <p className="text-2xs text-ink-muted leading-relaxed">
                Loads conditionally via <code className="font-mono">NEXT_PUBLIC_GA_ID</code>, in
                production, after consent.
              </p>
              <span className={cn(
                "inline-flex self-start rounded-full px-2 py-0.5 text-4xs font-semibold uppercase tracking-[0.06em] mt-1 border",
                process.env.NEXT_PUBLIC_GA_ID
                  ? "bg-accent-tint text-accent border-accent/20"
                  : "bg-surface text-ink-secondary border-line"
              )}>
                {process.env.NEXT_PUBLIC_GA_ID ? "Id set" : "Not configured"}
              </span>
            </div>
            <div className="rounded-xl border border-line bg-surface-2 p-4 flex flex-col gap-1.5">
              <span className="font-semibold text-xs text-ink">Google Tag Manager (GTM)</span>
              <p className="text-2xs text-ink-muted leading-relaxed">
                Loads conditionally via <code className="font-mono">NEXT_PUBLIC_GTM_ID</code>, in
                production, after consent.
              </p>
              <span className={cn(
                "inline-flex self-start rounded-full px-2 py-0.5 text-4xs font-semibold uppercase tracking-[0.06em] mt-1 border",
                process.env.NEXT_PUBLIC_GTM_ID
                  ? "bg-accent-tint text-accent border-accent/20"
                  : "bg-surface text-ink-secondary border-line"
              )}>
                {process.env.NEXT_PUBLIC_GTM_ID ? "Id set" : "Not configured"}
              </span>
            </div>
            <div className="rounded-xl border border-line bg-surface-2 p-4 flex flex-col gap-1.5">
              <span className="font-semibold text-xs text-ink">Vercel Web Analytics</span>
              <p className="text-2xs text-ink-muted leading-relaxed">
                Privacy-friendly page-view counts, toggled from the Vercel project dashboard.
              </p>
            </div>
            <div className="rounded-xl border border-line bg-surface-2 p-4 flex flex-col gap-1.5">
              <span className="font-semibold text-xs text-ink">Speed Insights</span>
              <p className="text-2xs text-ink-muted leading-relaxed">
                Core Web Vitals (CLS, LCP, INP), reported in the Vercel dashboard.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Monetization & Ads */}
      <Section
        title="Ads and monetization"
        description="QuizFlow is free with no ads by default. This is where any future ad slots are controlled."
      >
        <div className="flex flex-col gap-4">
          <p className="text-xs text-ink-secondary leading-relaxed">
            No ad scripts load unless ads are explicitly turned on. Turning them on needs two
            environment variables: <code className="font-mono">NEXT_PUBLIC_ADSENSE_ENABLED</code> set
            to <code className="font-mono">true</code> and a publisher id in{" "}
            <code className="font-mono">NEXT_PUBLIC_ADSENSE_CLIENT_ID</code>. Until both are set,
            nothing is requested from any ad network and no ad space is reserved. See
            MONETIZATION_PLAN.md for the intended placements.
          </p>
          <div className="rounded-xl border border-line bg-surface-2 p-4 flex items-center justify-between gap-2">
            <span className="font-semibold text-xs text-ink">Google AdSense</span>
            <span className={cn(
              "rounded-full px-2 py-0.5 text-4xs font-semibold uppercase tracking-[0.06em] border",
              adsEnabled
                ? "bg-accent-tint text-accent border-accent/20"
                : "bg-surface text-ink-secondary border-line"
            )}>
              {adsEnabled ? "Enabled" : "Disabled (default)"}
            </span>
          </div>
        </div>
      </Section>

      <ConfirmDialog
        open={confirmClear}
        title="Clear all local data?"
        description="Every quiz, deck and result stored on this device will be permanently removed. Export a backup first if you want to keep them."
        confirmLabel="Clear everything"
        confirmVariant="destructive"
        onConfirm={handleClear}
        onCancel={() => setConfirmClear(false)}
      />
    </div>
  );
}

function Section({
  id,
  title,
  description,
  children,
}: {
  id?: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="flex flex-col gap-4 rounded-2xl border border-white/20 dark:border-white/5 bg-white/35 dark:bg-slate-900/40 backdrop-blur-md p-6 shadow-paper">
      <div>
        <h2 className="font-display text-xl font-bold text-ink">{title}</h2>
        <p className="mt-1 text-xs text-ink-secondary">{description}</p>
      </div>
      {children}
    </section>
  );
}

function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-start justify-between gap-4 cursor-pointer">
      <span className="flex flex-col gap-0.5">
        <span className="text-xs font-bold text-ink">{label}</span>
        <span className="text-2xs text-ink-secondary leading-relaxed">{hint}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 size-5 shrink-0 rounded accent-[var(--color-accent-strong)]"
      />
    </label>
  );
}
