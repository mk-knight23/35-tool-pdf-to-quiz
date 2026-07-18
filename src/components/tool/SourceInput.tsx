"use client";

import {
  FileText,
  FileUp,
  Loader2,
  RotateCcw,
  Type,
  Settings,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Layers,
  Sparkles
} from "lucide-react";
import { useCallback, useId, useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { QuickModeBadge } from "@/components/ui/Badge";
import { sizeBucket, track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { getByokKey, setByokKey } from "@/lib/prefs";
import {
  extractPdf,
  isLikelyScanned,
  joinPages,
  parsePageRange,
  type PdfExtraction,
  validatePdfFile,
} from "@/lib/pdf";
import { wordCount } from "@/lib/text";
import {
  type Difficulty,
  type QuestionType,
  type GenMode,
  type Audience,
} from "@/lib/types";

export type OutputType = "quiz" | "flashcards";

export interface QuizConfigValues {
  count: number;
  types: QuestionType[];
  difficulty: Difficulty;
  audience: Audience;
  timed: boolean;
  timeLimitSec: number;
}

export interface GenerateRequest {
  output: OutputType;
  mode: GenMode;
  quiz: QuizConfigValues;
  cardCount: number;
  byok: string | null;
  previewBeforePlay: boolean;
}

export interface WorkspaceSource {
  text: string;
  name: string;
  origin: "paste" | "pdf";
}

interface SourceInputProps {
  generating: boolean;
  onGenerate: (source: WorkspaceSource, req: GenerateRequest) => void;
  onCancelGenerate?: () => void;
}

type Tab = "paste" | "pdf";

const ALL_TYPES: QuestionType[] = ["mcq", "tf", "short", "fill"];
const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard", "mixed"];

export function SourceInput({ generating, onGenerate, onCancelGenerate }: SourceInputProps) {
  const [tab, setTab] = useState<Tab>("paste");

  // Input states
  const [pasteText, setPasteText] = useState("");
  const [pasteTitle, setPasteTitle] = useState("");

  const [pdfExtraction, setPdfExtraction] = useState<PdfExtraction | null>(null);
  const [pdfFileName, setPdfFileName] = useState("");
  const [pdfRange, setPdfRange] = useState("");
  const [pdfStatus, setPdfStatus] = useState<"idle" | "parsing" | "parsed" | "error">("idle");
  const [pdfProgress, setPdfProgress] = useState<{ page: number; total: number } | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // Config states
  const [count, setCount] = useState(10);
  const [cardCount, setCardCount] = useState(15);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [output, setOutput] = useState<OutputType>("quiz");
  const [mode, setMode] = useState<GenMode>("quick");
  const [types, setTypes] = useState<QuestionType[]>(["mcq", "tf", "short", "fill"]);
  const [difficulty, setDifficulty] = useState<Difficulty>("mixed");
  const [audience] = useState<Audience>("university");
  const [timed, setTimed] = useState(false);
  const [timeLimitMin, setTimeLimitMin] = useState(10);
  const [previewBeforePlay, setPreviewBeforePlay] = useState(false);
  const [byok, setByok] = useState("");

  const titleId = useId();
  const textId = useId();
  const pdfRangeId = useId();
  const byokId = useId();
  const timeId = useId();

  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    const k = getByokKey() || "";
    window.setTimeout(() => {
      setByok(k);
    }, 0);
  }, []);

  const handlePdfFile = useCallback(async (file: File) => {
    track("file_selected", { origin: "pdf", size: sizeBucket(file.size) });
    const validationError = validatePdfFile(file);
    if (validationError) {
      setPdfStatus("error");
      setPdfError(validationError);
      track("tool_failed", { stage: "pdf_validation" });
      return;
    }
    setPdfStatus("parsing");
    setPdfError(null);
    setPdfExtraction(null);
    setPdfFileName(file.name);
    setPdfProgress({ page: 0, total: 0 });
    try {
      const result = await extractPdf(file, (page, total) => setPdfProgress({ page, total }));
      if (isLikelyScanned(result)) {
        setPdfStatus("error");
        setPdfError(
          "This PDF has no extractable text — it looks scanned or image-only. Quick mode can't read images (OCR isn't supported). Try a text-based PDF or paste the text."
        );
        track("tool_failed", { stage: "pdf_scanned" });
        return;
      }
      setPdfExtraction(result);
      setPdfStatus("parsed");
      track("file_processed", { origin: "pdf", pages: result.numPages });
    } catch {
      setPdfStatus("error");
      setPdfError("Couldn't read this PDF. It may be encrypted or corrupted.");
      track("tool_failed", { stage: "pdf_parse" });
    }
  }, []);

  const resetPdf = () => {
    setPdfStatus("idle");
    setPdfError(null);
    setPdfExtraction(null);
    setPdfFileName("");
    setPdfRange("");
    setPdfProgress(null);
    if (pdfInputRef.current) pdfInputRef.current.value = "";
  };

  const selectedPages = pdfExtraction ? parsePageRange(pdfRange, pdfExtraction.numPages) : [];
  const selectedChars = pdfExtraction
    ? pdfExtraction.pages
        .filter((p) => selectedPages.includes(p.pageNumber))
        .reduce((sum, p) => sum + p.charCount, 0)
    : 0;

  const pasteWords = wordCount(pasteText);

  const canSubmit =
    tab === "paste"
      ? pasteWords >= 1
      : pdfStatus === "parsed" && selectedChars >= 1;

  const handleSubmit = () => {
    if (!canSubmit) return;

    const source =
      tab === "paste"
        ? {
            text: pasteText,
            name: pasteTitle.trim() || "Pasted notes",
            origin: "paste" as const,
          }
        : {
            text: joinPages(pdfExtraction!, selectedPages),
            name: pdfFileName.replace(/\.pdf$/i, ""),
            origin: "pdf" as const,
          };

    const request: GenerateRequest = {
      output,
      mode,
      quiz: {
        count,
        types,
        difficulty,
        audience,
        timed,
        timeLimitSec: timeLimitMin * 60,
      },
      cardCount,
      byok: mode === "ai" ? (byok.trim() || null) : null,
      previewBeforePlay,
    };

    onGenerate(source, request);
  };

  const toggleQuestionType = (type: QuestionType) => {
    setTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <section aria-labelledby="source-heading" className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <h2 id="source-heading" className="font-display text-3xl text-ink tracking-tight">
          Turn your material into an active study session
        </h2>
        <p className="mt-2 text-sm text-ink-secondary">
          Paste your study notes or upload a text-based PDF. Everything is processed 100% locally.
        </p>
      </div>

      {/* Tabs */}
      <div role="tablist" aria-label="Source type" className="flex gap-1 rounded-xl border border-white/20 dark:border-white/5 bg-white/15 dark:bg-slate-900/20 p-1">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "paste"}
          onClick={() => setTab("paste")}
          className={cn(
            "inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 border border-transparent cursor-pointer",
            tab === "paste"
              ? "bg-white/20 dark:bg-white/10 text-ink shadow-sm border-white/25 dark:border-white/10 font-bold"
              : "text-ink-secondary hover:text-ink hover:bg-white/5"
          )}
        >
          <Type size={16} strokeWidth={2} aria-hidden />
          Paste text
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "pdf"}
          onClick={() => setTab("pdf")}
          className={cn(
            "inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 border border-transparent cursor-pointer",
            tab === "pdf"
              ? "bg-white/20 dark:bg-white/10 text-ink shadow-sm border-white/25 dark:border-white/10 font-bold"
              : "text-ink-secondary hover:text-ink hover:bg-white/5"
          )}
        >
          <FileUp size={16} strokeWidth={2} aria-hidden />
          Upload PDF
        </button>
      </div>

      {/* Inputs panel */}
      <div className="rounded-2xl border border-line bg-surface-2 p-5 shadow-paper">
        {tab === "paste" ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor={titleId} className="text-xs font-semibold text-ink">
                Source name <span className="font-normal text-ink-muted">(optional)</span>
              </label>
              <input
                id={titleId}
                value={pasteTitle}
                onChange={(e) => setPasteTitle(e.target.value)}
                placeholder="e.g. Biology chapter 4..."
                className="rounded-xl border border-white/20 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-muted focus:border-accent focus:bg-white/40 dark:focus:bg-slate-900/40 transition-all duration-200 shadow-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor={textId} className="text-xs font-semibold text-ink">
                Notes, text or markdown
              </label>
              <textarea
                id={textId}
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                rows={8}
                placeholder="Paste lecture notes, an article, or any prose you want to be quizzed on..."
                className="min-h-40 resize-y rounded-xl border border-white/20 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 px-4 py-3 text-sm leading-relaxed text-ink outline-none placeholder:text-ink-muted focus:border-accent focus:bg-white/40 dark:focus:bg-slate-900/40 transition-all duration-200 shadow-sm"
              />
              <p className="font-mono text-2xs text-ink-muted mt-0.5">
                {pasteWords} {pasteWords === 1 ? "word" : "words"}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <input
              ref={pdfInputRef}
              type="file"
              accept="application/pdf,.pdf"
              className="sr-only"
              aria-hidden
              tabIndex={-1}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handlePdfFile(file);
              }}
            />

            {pdfStatus !== "parsed" ? (
              <div
                role="button"
                tabIndex={0}
                aria-label="Upload a PDF file"
                onClick={() => pdfInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    pdfInputRef.current?.click();
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
                  if (file) void handlePdfFile(file);
                }}
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-all duration-200 shadow-sm",
                  dragOver
                    ? "border-accent bg-accent-tint/50"
                    : "border-white/20 dark:border-white/10 bg-white/25 dark:bg-slate-900/25 hover:border-accent dark:hover:border-accent hover:bg-white/35 dark:hover:bg-slate-900/35"
                )}
              >
                {pdfStatus === "parsing" ? (
                  <>
                    <Loader2 className="animate-spin text-accent" size={28} aria-hidden />
                    <p className="text-sm font-medium text-ink-secondary">
                      Reading {pdfFileName}
                      {pdfProgress && pdfProgress.total > 0 ? ` — page ${pdfProgress.page} of ${pdfProgress.total}` : "…"}
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

            {pdfStatus === "error" && pdfError ? (
              <div className="flex flex-col gap-4 rounded-xl border border-error/20 bg-error-tint p-4">
                <p role="alert" className="text-sm font-medium text-error leading-relaxed">
                  {pdfError}
                </p>
                <Button variant="secondary" size="sm" className="self-start" onClick={resetPdf}>
                  <RotateCcw size={14} strokeWidth={2} aria-hidden /> Try another file
                </Button>
              </div>
            ) : null}

            {pdfStatus === "parsed" && pdfExtraction ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
                    <FileText size={16} strokeWidth={2} className="text-accent" aria-hidden />
                    {pdfFileName}
                  </span>
                  <button
                    type="button"
                    onClick={resetPdf}
                    className="inline-flex items-center gap-1.5 text-xs text-ink-secondary hover:text-ink font-semibold"
                  >
                    <RotateCcw size={14} strokeWidth={2} aria-hidden /> Change file
                  </button>
                </div>

                <p className="text-xs text-ink-secondary">
                  {pdfExtraction.numPages} {pdfExtraction.numPages === 1 ? "page" : "pages"} with extractable text.
                </p>

                <details className="rounded-xl border border-white/20 dark:border-white/5 bg-white/10 dark:bg-slate-900/10">
                  <summary className="cursor-pointer px-3 py-2 text-xs font-semibold text-ink-secondary">
                    Per-page character counts
                  </summary>
                  <ul className="max-h-32 overflow-auto border-t border-white/10 px-3 py-2 font-mono text-2xs text-ink-muted">
                    {pdfExtraction.pages.map((p) => (
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
                  <label htmlFor={pdfRangeId} className="text-xs font-semibold text-ink">
                    Page range <span className="font-normal text-ink-muted">(blank = all pages)</span>
                  </label>
                  <input
                    id={pdfRangeId}
                    value={pdfRange}
                    onChange={(e) => setPdfRange(e.target.value)}
                    placeholder="e.g. 1-3, 5, 8-10..."
                    inputMode="numeric"
                    className="rounded-xl border border-white/20 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 px-3 py-2 text-xs text-ink outline-none placeholder:text-ink-muted focus:border-accent focus:bg-white/40 dark:focus:bg-slate-900/40 transition-all duration-200 shadow-sm"
                  />
                  <p className="font-mono text-2xs text-ink-muted mt-0.5">
                    {selectedPages.length} {selectedPages.length === 1 ? "page" : "pages"} selected · {selectedChars} chars
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Sensible defaults & counts (Basic Mode core control) */}
      <div className="rounded-2xl border border-line bg-surface-2 p-5 shadow-paper flex flex-col gap-4">
        {output === "quiz" ? (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-ink">Number of questions</span>
            <div className="flex gap-2">
              {[5, 10, 15, 20].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setCount(size)}
                  className={cn(
                    "flex-1 py-2 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer",
                    count === size
                      ? "bg-accent border-accent text-on-accent shadow-sm font-bold"
                      : "border-white/20 bg-white/5 text-ink-secondary hover:text-ink hover:bg-white/10"
                  )}
                >
                  {size} Questions
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-ink">Number of cards</span>
            <div className="flex gap-2">
              {[10, 15, 20, 30].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setCardCount(size)}
                  className={cn(
                    "flex-1 py-2 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer",
                    cardCount === size
                      ? "bg-accent border-accent text-on-accent shadow-sm font-bold"
                      : "border-white/20 bg-white/5 text-ink-secondary hover:text-ink hover:bg-white/10"
                  )}
                >
                  {size} Cards
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Collapsible Advanced Options Toggle */}
        <div className="border-t border-white/10 pt-4 mt-2">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-xs font-bold text-ink-secondary hover:text-ink transition-colors cursor-pointer"
          >
            <Settings size={14} className="text-ink-muted" />
            <span>Advanced customization options</span>
            {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {/* Advanced options body */}
          {showAdvanced && (
            <div className="mt-4 flex flex-col gap-5 border border-white/10 rounded-2xl p-4 bg-white/5 dark:bg-slate-950/25">
              {/* Output format */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-ink">Output Format</span>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setOutput("quiz")}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border p-3 text-left transition-all cursor-pointer shadow-sm",
                      output === "quiz" ? "border-accent bg-accent-tint/40" : "border-white/10 hover:border-accent hover:bg-white/5"
                    )}
                  >
                    <GraduationCap size={16} className="text-accent mt-0.5" />
                    <div>
                      <span className="block text-xs font-bold text-ink">Interactive Quiz</span>
                      <span className="block text-2xs text-ink-secondary mt-0.5">MCQ, true/false, fill-in and short answers.</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOutput("flashcards")}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border p-3 text-left transition-all cursor-pointer shadow-sm",
                      output === "flashcards" ? "border-accent bg-accent-tint/40" : "border-white/10 hover:border-accent hover:bg-white/5"
                    )}
                  >
                    <Layers size={16} className="text-accent mt-0.5" />
                    <div>
                      <span className="block text-xs font-bold text-ink">Flashcard Deck</span>
                      <span className="block text-2xs text-ink-secondary mt-0.5">Term and definition cards with Spaced Repetition (SRS).</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Mode Selector */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-ink">Generation Method</span>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setMode("quick")}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border p-3 text-left transition-all cursor-pointer shadow-sm",
                      mode === "quick" ? "border-accent bg-accent-tint/40" : "border-white/10 hover:border-accent hover:bg-white/5"
                    )}
                  >
                    <QuickModeBadge className="mt-0.5" />
                    <div>
                      <span className="block text-xs font-bold text-ink">Quick mode (no AI)</span>
                      <span className="block text-2xs text-ink-secondary mt-0.5">Deterministic sentence heuristics. 100% offline, zero keys.</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("ai")}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border p-3 text-left transition-all cursor-pointer shadow-sm",
                      mode === "ai" ? "border-accent bg-accent-tint/40" : "border-white/10 hover:border-accent hover:bg-white/5"
                    )}
                  >
                    <Sparkles size={14} className="text-accent mt-0.5 shrink-0" />
                    <div>
                      <span className="block text-xs font-bold text-ink">AI mode</span>
                      <span className="block text-2xs text-ink-secondary mt-0.5">Uses advanced language models to synthesize custom questions.</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* BYOK key (visible only in AI mode) */}
              {mode === "ai" && (
                <div className="flex flex-col gap-2 border border-white/5 bg-white/5 p-3 rounded-xl">
                  <label htmlFor={byokId} className="text-xs font-semibold text-ink">
                    Personal API key <span className="font-normal text-ink-muted">(optional)</span>
                  </label>
                  <p className="text-2xs text-ink-secondary leading-relaxed">
                    Uses shared free daily quota first. Add a Vercel AI Gateway key (`vck_…`) to keep going if the server quota is exceeded.
                  </p>
                  <input
                    id={byokId}
                    type="password"
                    placeholder="Vercel AI Gateway key"
                    value={byok}
                    onChange={(e) => {
                      setByok(e.target.value);
                      setByokKey(e.target.value);
                    }}
                    className="max-w-xs mt-1 rounded-lg border border-white/20 bg-white/15 px-3 py-1.5 text-xs text-ink outline-none focus:border-accent"
                  />
                </div>
              )}

              {/* Detailed configuration for Quiz */}
              {output === "quiz" && (
                <>
                  {/* Question types */}
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-ink">Question types</span>
                    <div className="flex flex-wrap gap-2">
                      {ALL_TYPES.map((type) => {
                        const checked = types.includes(type);
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => toggleQuestionType(type)}
                            className={cn(
                              "px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all",
                              checked
                                ? "bg-white/25 border-white/40 text-ink shadow-sm"
                                : "border-white/10 text-ink-secondary hover:text-ink hover:bg-white/5"
                            )}
                          >
                            {type === "mcq" && "Multiple Choice"}
                            {type === "tf" && "True / False"}
                            {type === "short" && "Short Answer"}
                            {type === "fill" && "Fill in the blank"}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div className="flex flex-col gap-1.5 max-w-xs">
                    <label htmlFor="diff-select" className="text-xs font-semibold text-ink">Difficulty</label>
                    <select
                      id="diff-select"
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                      className="rounded-xl border border-white/20 bg-white/15 px-3 py-2 text-xs text-ink outline-none focus:border-accent"
                    >
                      {DIFFICULTIES.map((d) => (
                        <option key={d} value={d} className="bg-slate-900 text-ink">
                          {d.charAt(0).toUpperCase() + d.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Timed Mode toggle */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <input
                        id="timed-checkbox"
                        type="checkbox"
                        checked={timed}
                        onChange={(e) => setTimed(e.target.checked)}
                        className="rounded border-white/20 bg-white/15 text-accent focus:ring-accent"
                      />
                      <label htmlFor="timed-checkbox" className="text-xs font-semibold text-ink cursor-pointer">
                        Enable Timer
                      </label>
                    </div>

                    {timed && (
                      <div className="flex items-center gap-2 mt-1 pl-6">
                        <label htmlFor={timeId} className="text-xs text-ink-secondary">Time Limit:</label>
                        <input
                          id={timeId}
                          type="number"
                          min={1}
                          max={180}
                          value={timeLimitMin}
                          onChange={(e) => setTimeLimitMin(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-16 rounded-lg border border-white/20 bg-white/15 px-2 py-1 text-xs text-ink outline-none focus:border-accent"
                        />
                        <span className="text-xs text-ink-secondary">minutes</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Preview Before Play check */}
              {output === "quiz" && (
                <div className="flex items-center gap-3 border-t border-white/5 pt-3">
                  <input
                    id="preview-checkbox"
                    type="checkbox"
                    checked={previewBeforePlay}
                    onChange={(e) => setPreviewBeforePlay(e.target.checked)}
                    className="rounded border-white/20 bg-white/15 text-accent focus:ring-accent"
                  />
                  <label htmlFor="preview-checkbox" className="text-xs font-semibold text-ink cursor-pointer">
                    Preview and edit questions before playing
                  </label>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Primary generate CTA & trust statement */}
      <div className="flex flex-col items-center gap-3 mt-4">
        {generating ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-accent" size={32} aria-hidden />
            <p className="text-sm font-semibold text-ink-secondary">Generating quiz questions locally…</p>
            {onCancelGenerate && (
              <Button variant="ghost" size="sm" onClick={onCancelGenerate}>
                Cancel Generation
              </Button>
            )}
          </div>
        ) : (
          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleSubmit}
            className={cn(
              "w-full max-w-sm py-3.5 px-6 rounded-2xl text-base font-bold text-center transition-all duration-200 cursor-pointer shadow-md",
              canSubmit
                ? "bg-accent-strong hover:bg-accent text-on-accent active:scale-[0.98]"
                : "bg-white/10 text-ink-muted border border-white/5 cursor-not-allowed"
            )}
          >
            {output === "quiz" ? "Create a quiz" : "Create flashcards"}
          </button>
        )}
        <p className="text-xs text-ink-muted mt-1 text-center max-w-md leading-relaxed">
          🔒 Private: Documents are processed locally on your device and are never saved or sent to any server.
        </p>
      </div>
    </section>
  );
}
