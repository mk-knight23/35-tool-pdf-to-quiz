"use client";

import { FileText, FileUp, Loader2, RotateCcw, Type } from "lucide-react";
import { useCallback, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { sizeBucket, track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import {
  extractPdf,
  isLikelyScanned,
  joinPages,
  parsePageRange,
  type PdfExtraction,
  validatePdfFile,
} from "@/lib/pdf";
import { wordCount } from "@/lib/text";

export interface WorkspaceSource {
  text: string;
  name: string;
  origin: "paste" | "pdf";
}

interface SourceInputProps {
  onReady: (source: WorkspaceSource) => void;
}

type Tab = "paste" | "pdf";

export function SourceInput({ onReady }: SourceInputProps) {
  const [tab, setTab] = useState<Tab>("paste");

  return (
    <section aria-labelledby="source-heading" className="flex flex-col gap-5">
      <div>
        <h2 id="source-heading" className="font-display text-2xl text-ink">
          Add your study material
        </h2>
        <p className="mt-1 text-sm text-ink-secondary">
          Paste text or upload a PDF. Everything is read in your browser.
        </p>
      </div>

      <div role="tablist" aria-label="Source type" className="flex gap-1 rounded-xl border border-white/20 dark:border-white/5 bg-white/15 dark:bg-slate-900/20 p-1">
        <TabButton active={tab === "paste"} onClick={() => setTab("paste")} icon={Type}>
          Paste text
        </TabButton>
        <TabButton active={tab === "pdf"} onClick={() => setTab("pdf")} icon={FileUp}>
          Upload PDF
        </TabButton>
      </div>

      {tab === "paste" ? <PastePanel onReady={onReady} /> : <PdfPanel onReady={onReady} />}
    </section>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Type;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 border border-transparent",
        active 
          ? "bg-white/20 dark:bg-white/10 text-ink shadow-sm border-white/25 dark:border-white/10" 
          : "text-ink-secondary hover:text-ink hover:bg-white/5",
      )}
    >
      <Icon size={16} strokeWidth={2} aria-hidden />
      {children}
    </button>
  );
}

function PastePanel({ onReady }: { onReady: (source: WorkspaceSource) => void }) {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const titleId = useId();
  const textId = useId();
  const words = wordCount(text);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor={titleId} className="text-sm font-medium text-ink">
          Source name <span className="font-normal text-ink-muted">(optional)</span>
        </label>
        <input
          id={titleId}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Biology chapter 4..."
          className="rounded-xl border border-white/20 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-muted focus:border-accent focus:bg-white/40 dark:focus:bg-slate-900/40 transition-all duration-200 shadow-sm"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={textId} className="text-sm font-medium text-ink">
          Text or markdown
        </label>
        <textarea
          id={textId}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          placeholder="Paste lecture notes, an article, or any prose you want to be quizzed on..."
          className="min-h-48 resize-y rounded-xl border border-white/20 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 px-4 py-3 text-sm leading-relaxed text-ink outline-none placeholder:text-ink-muted focus:border-accent focus:bg-white/40 dark:focus:bg-slate-900/40 transition-all duration-200 shadow-sm"
        />
        <p className="font-mono text-2xs text-ink-muted mt-0.5">
          {words} {words === 1 ? "word" : "words"}
        </p>
      </div>
      <div>
        <Button
          disabled={words < 1}
          onClick={() =>
            onReady({
              text,
              name: title.trim() || "Pasted notes",
              origin: "paste",
            })
          }
        >
          Use this text
        </Button>
      </div>
    </div>
  );
}

function PdfPanel({ onReady }: { onReady: (source: WorkspaceSource) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState<"idle" | "parsing" | "parsed" | "error">("idle");
  const [progress, setProgress] = useState<{ page: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [extraction, setExtraction] = useState<PdfExtraction | null>(null);
  const [fileName, setFileName] = useState("");
  const [range, setRange] = useState("");
  const rangeId = useId();

  const handleFile = useCallback(async (file: File) => {
    track("file_selected", { origin: "pdf", size: sizeBucket(file.size) });
    const validationError = validatePdfFile(file);
    if (validationError) {
      setStatus("error");
      setError(validationError);
      track("tool_failed", { stage: "pdf_validation" });
      return;
    }
    setStatus("parsing");
    setError(null);
    setExtraction(null);
    setFileName(file.name);
    setProgress({ page: 0, total: 0 });
    try {
      const result = await extractPdf(file, (page, total) => setProgress({ page, total }));
      if (isLikelyScanned(result)) {
        setStatus("error");
        setError(
          "This PDF has no extractable text — it looks scanned or image-only. Quick mode can't read images (OCR isn't supported). Try a text-based PDF or paste the text.",
        );
        track("tool_failed", { stage: "pdf_scanned" });
        return;
      }
      setExtraction(result);
      setStatus("parsed");
      track("file_processed", { origin: "pdf", pages: result.numPages });
    } catch {
      setStatus("error");
      setError("Couldn't read this PDF. It may be encrypted or corrupted.");
      track("tool_failed", { stage: "pdf_parse" });
    }
  }, []);

  const reset = () => {
    setStatus("idle");
    setError(null);
    setExtraction(null);
    setFileName("");
    setRange("");
    setProgress(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const selectedPages = extraction ? parsePageRange(range, extraction.numPages) : [];
  const selectedChars = extraction
    ? extraction.pages
        .filter((p) => selectedPages.includes(p.pageNumber))
        .reduce((sum, p) => sum + p.charCount, 0)
    : 0;

  return (
    <div className="flex flex-col gap-4">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        aria-hidden
        tabIndex={-1}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />

      {status !== "parsed" ? (
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload a PDF file"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files?.[0];
            if (file) void handleFile(file);
          }}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-all duration-200 shadow-sm",
            dragOver
              ? "border-accent bg-accent-tint/50"
              : "border-white/20 dark:border-white/10 bg-white/25 dark:bg-slate-900/25 hover:border-accent dark:hover:border-accent hover:bg-white/35 dark:hover:bg-slate-900/35",
          )}
        >
          {status === "parsing" ? (
            <>
              <Loader2 className="animate-spin text-accent" size={28} aria-hidden />
              <p className="text-sm font-medium text-ink-secondary">
                Reading {fileName}
                {progress && progress.total > 0 ? ` — page ${progress.page} of ${progress.total}` : "…"}
              </p>
            </>
          ) : (
            <>
              <span className="flex size-12 items-center justify-center rounded-xl bg-accent-tint text-accent border border-accent/15">
                <FileUp size={24} strokeWidth={2} aria-hidden />
              </span>
              <p className="text-base font-bold text-ink">Drop a PDF here, or click to choose</p>
              <p className="text-xs text-ink-muted">Up to 20 MB. Text-based PDFs only.</p>
            </>
          )}
        </div>
      ) : null}

      {status === "error" && error ? (
        <div className="flex flex-col gap-4 rounded-2xl border border-error/20 bg-error-tint p-5">
          <p role="alert" className="text-sm font-medium text-error">
            {error}
          </p>
          <Button variant="secondary" size="sm" className="self-start" onClick={reset}>
            <RotateCcw size={14} strokeWidth={2} aria-hidden /> Try another file
          </Button>
        </div>
      ) : null}

      {status === "parsed" && extraction ? (
        <div className="flex flex-col gap-5 rounded-2xl border border-white/20 dark:border-white/5 bg-white/35 dark:bg-slate-900/40 backdrop-blur-md p-5 shadow-paper">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
              <FileText size={16} strokeWidth={2} className="text-accent" aria-hidden />
              {fileName}
            </span>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-xs text-ink-secondary hover:text-ink font-semibold"
            >
              <RotateCcw size={14} strokeWidth={2} aria-hidden /> Change
            </button>
          </div>

          <p className="text-xs text-ink-secondary">
            {extraction.numPages} {extraction.numPages === 1 ? "page" : "pages"} with extractable
            text.
          </p>

          <details className="rounded-xl border border-white/20 dark:border-white/5 bg-white/10 dark:bg-slate-900/10">
            <summary className="cursor-pointer px-3 py-2 text-xs font-semibold text-ink-secondary">
              Per-page character counts
            </summary>
            <ul className="max-h-40 overflow-auto border-t border-white/10 px-3 py-2 font-mono text-2xs text-ink-muted">
              {extraction.pages.map((p) => (
                <li key={p.pageNumber} className="flex justify-between gap-4 py-0.5">
                  <span>Page {p.pageNumber}</span>
                  <span className={p.charCount < 20 ? "text-warning font-semibold" : ""}>
                    {p.charCount} chars{p.charCount < 20 ? " (empty/scanned)" : ""}
                  </span>
                </li>
              ))}
            </ul>
          </details>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={rangeId} className="text-xs font-semibold text-ink">
              Page range <span className="font-normal text-ink-muted">(blank = all pages)</span>
            </label>
            <input
              id={rangeId}
              value={range}
              onChange={(e) => setRange(e.target.value)}
              placeholder="e.g. 1-3, 5, 8-10..."
              inputMode="numeric"
              className="rounded-xl border border-white/20 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 px-3 py-2.5 font-mono text-xs text-ink outline-none placeholder:text-ink-muted focus:border-accent focus:bg-white/40 dark:focus:bg-slate-900/40 transition-all duration-200 shadow-sm"
            />
            <p className="font-mono text-2xs text-ink-muted mt-0.5">
              {selectedPages.length} {selectedPages.length === 1 ? "page" : "pages"} selected ·{" "}
              {selectedChars} chars
            </p>
          </div>

          <Button
            disabled={selectedChars < 1}
            onClick={() =>
              onReady({
                text: joinPages(extraction, selectedPages),
                name: fileName.replace(/\.pdf$/i, ""),
                origin: "pdf",
              })
            }
          >
            Use selected pages
          </Button>
        </div>
      ) : null}
    </div>
  );
}
