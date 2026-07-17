"use client";

import { Check, FileJson, FileSpreadsheet, FileText, Link2, Printer } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
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
  const [copied, setCopied] = useState<"share" | null>(null);
  const slug = slugify(quiz.title);

  const openPrintable = () => {
    const html = toPrintableHtml(quiz);
    const win = window.open("", "_blank", "noopener,noreferrer");
    if (!win) {
      // Popup blocked — fall back to a file download.
      downloadFile(`${slug}.html`, html, "text/html");
      return;
    }
    win.document.write(html);
    win.document.close();
  };

  const copyShare = async () => {
    try {
      const url = buildShareUrl(window.location.href, quiz);
      await navigator.clipboard.writeText(url);
      setCopied("share");
      window.setTimeout(() => setCopied(null), 2500);
    } catch {
      /* clipboard blocked — non-fatal */
    }
  };

  return (
    <div className="flex flex-col gap-3.5 rounded-2xl border border-white/20 dark:border-white/5 bg-white/35 dark:bg-slate-900/40 p-4 shadow-paper">
      <p className="text-xs font-bold uppercase tracking-[0.08em] text-ink-muted">Export</p>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => downloadFile(`${slug}.json`, toJson(quiz), "application/json")}
        >
          <FileJson size={14} strokeWidth={2} aria-hidden /> JSON
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => downloadFile(`${slug}.csv`, toCsv(quiz), "text/csv")}
        >
          <FileSpreadsheet size={14} strokeWidth={2} aria-hidden /> CSV
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => downloadFile(`${slug}.md`, toMarkdown(quiz), "text/markdown")}
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
      </div>
      <p className="text-xs text-ink-muted">
        JSON re-imports into QuizFlow. The share link carries the quiz in the URL — long quizzes make
        long links.
      </p>
    </div>
  );
}
