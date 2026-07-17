"use client";

import { Download, HardDrive, Trash2, Upload } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { track } from "@/lib/analytics";
import { downloadFile } from "@/lib/export";
import {
  getConsent,
  getHistoryEnabled,
  getSoundEnabled,
  setConsent,
  setHistoryEnabled,
  setSoundEnabled,
} from "@/lib/prefs";
import {
  clearAll,
  estimateUsage,
  exportAll,
  importAll,
  type ImportSummary,
  type StorageUsage,
} from "@/lib/storage";

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

  const refreshUsage = useCallback(async () => {
    setUsage(await estimateUsage());
  }, []);

  useEffect(() => {
    setHistoryEnabledState(getHistoryEnabled());
    setSoundEnabledState(getSoundEnabled());
    setConsentState(getConsent());
    void refreshUsage();
  }, [refreshUsage]);

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
        <p className="text-sm text-ink-secondary">
          This build ships the deterministic Quick mode. When the optional AI layer is enabled, you
          can bring your own key — it is held only in memory for the request, never written to disk
          and never sent to analytics.
        </p>
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
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-line bg-surface-2 p-6 shadow-paper">
      <div>
        <h2 className="font-display text-xl text-ink">{title}</h2>
        <p className="mt-1 text-sm text-ink-secondary">{description}</p>
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
    <label className="flex items-start justify-between gap-4">
      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-ink">{label}</span>
        <span className="text-sm text-ink-secondary">{hint}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 size-5 shrink-0 accent-[var(--color-accent-strong)]"
      />
    </label>
  );
}
