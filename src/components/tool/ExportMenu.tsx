"use client";

import { Check, Cloud, FileJson, FileSpreadsheet, FileText, Link2, Printer } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import {
  downloadFile,
  slugify,
  toCsv,
  toJson,
  toMarkdown,
  toPrintableHtml,
} from "@/lib/export";
import { buildShareUrl } from "@/lib/share";
import type { Quiz } from "@/lib/types";

interface ExportMenuProps {
  quiz: Quiz;
}

export function ExportMenu({ quiz }: ExportMenuProps) {
  const [copied, setCopied] = useState<"share" | "cloud" | null>(null);
  const [sharing, setSharing] = useState(false);
  const slug = slugify(quiz.title);

  const openPrintable = () => {
    const html = toPrintableHtml(quiz);
    track("result_exported", { format: "print" });
    const win = window.open("", "_blank", "noopener,noreferrer");
    if (!win) {
      // Popup blocked — fall back to a file download.
      downloadFile(`${slug}.html`, html, "text/html");
      return;
    }
    win.document.write(html);
    win.document.close();
  };

  const exportAs = (format: "json" | "csv" | "md", contents: string, mime: string) => {
    downloadFile(`${slug}.${format}`, contents, mime);
    track("result_exported", { format });
  };

  const copyShare = async () => {
    try {
      const url = buildShareUrl(window.location.href, quiz);
      await navigator.clipboard.writeText(url);
      setCopied("share");
      track("result_shared", { via: "link" });
      window.setTimeout(() => setCopied(null), 2500);
    } catch {
      /* clipboard blocked — non-fatal */
    }
  };

  // Publish the quiz to the cloud and copy a short /q/<code> link (opt-in: only on click).
  const copyCloudShare = async () => {
    setSharing(true);
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quiz),
      });
      if (!res.ok) throw new Error("share failed");
      const { path } = (await res.json()) as { path: string };
      const url = `${window.location.origin}${path}`;
      await navigator.clipboard.writeText(url);
      setCopied("cloud");
      track("quiz_cloud_shared", { count: quiz.questions.length });
      window.setTimeout(() => setCopied(null), 2500);
    } catch {
      /* network/clipboard blocked — non-fatal */
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="flex flex-col gap-3.5 rounded-2xl border border-white/20 dark:border-white/5 bg-white/35 dark:bg-slate-900/40 p-4 shadow-paper">
      <p className="text-xs font-bold uppercase tracking-[0.08em] text-ink-muted">Export</p>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => exportAs("json", toJson(quiz), "application/json")}
        >
          <FileJson size={14} strokeWidth={2} aria-hidden /> JSON
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => exportAs("csv", toCsv(quiz), "text/csv")}
        >
          <FileSpreadsheet size={14} strokeWidth={2} aria-hidden /> CSV
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => exportAs("md", toMarkdown(quiz), "text/markdown")}
        >
          <FileText size={14} strokeWidth={2} aria-hidden /> Markdown
        </Button>
        <Button variant="secondary" size="sm" onClick={openPrintable}>
          <Printer size={14} strokeWidth={2} aria-hidden /> Print / PDF
        </Button>
        <Button variant="secondary" size="sm" onClick={copyShare}>
          {copied === "share" ? (
            <>
              <Check size={14} strokeWidth={2} aria-hidden /> Link copied
            </>
          ) : (
            <>
              <Link2 size={14} strokeWidth={2} aria-hidden /> Copy share link
            </>
          )}
        </Button>
        <Button variant="secondary" size="sm" onClick={copyCloudShare} disabled={sharing}>
          {copied === "cloud" ? (
            <>
              <Check size={14} strokeWidth={2} aria-hidden /> Cloud link copied
            </>
          ) : (
            <>
              <Cloud size={14} strokeWidth={2} aria-hidden /> {sharing ? "Publishing…" : "Share via cloud"}
            </>
          )}
        </Button>
      </div>
      <p className="text-xs text-ink-muted">
        JSON re-imports into QuizFlow. “Copy share link” carries the quiz in the URL (long quizzes make
        long links). “Share via cloud” publishes it and copies a short <code>/q/…</code> link anyone can
        open — no sign-up.
      </p>
    </div>
  );
}
