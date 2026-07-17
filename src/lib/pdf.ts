/**
 * Client-side PDF text extraction (pdfjs-dist v6, API verified against installed
 * type defs). The worker is self-hosted from /public — NO CDN worker (privacy + CSP).
 * Runs only in the browser; documents never leave the device here.
 */
export const MAX_PDF_BYTES = 20 * 1024 * 1024; // 20 MB (STANDARDS/spec F1)

export interface PdfPage {
  pageNumber: number;
  text: string;
  charCount: number;
}

export interface PdfExtraction {
  numPages: number;
  pages: PdfPage[];
}

/** Returns an error message string, or null if the file looks like an acceptable PDF. */
export function validatePdfFile(file: File): string | null {
  const isPdf =
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) return "That doesn't look like a PDF. Choose a .pdf file.";
  if (file.size > MAX_PDF_BYTES) {
    return "This PDF is larger than 20 MB. Try a smaller file or split it first.";
  }
  if (file.size === 0) return "This file is empty.";
  return null;
}

export async function extractPdf(
  file: File,
  onProgress?: (page: number, total: number) => void,
): Promise<PdfExtraction> {
  const pdfjs = await import("pdfjs-dist");
  // Self-hosted worker copied into /public by the copy-pdf-worker script.
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const data = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data }).promise;
  const pages: PdfPage[] = [];
  try {
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      const text = content.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      pages.push({ pageNumber: i, text, charCount: text.length });
      page.cleanup();
      onProgress?.(i, doc.numPages);
    }
  } finally {
    await doc.destroy();
  }
  return { numPages: pages.length, pages };
}

/** True when a document produced essentially no extractable text (likely scanned). */
export function isLikelyScanned(extraction: PdfExtraction): boolean {
  const total = extraction.pages.reduce((sum, p) => sum + p.charCount, 0);
  return total < 20;
}

/**
 * Parse a human page-range string like "1-3, 5, 8-10" into a sorted unique list of
 * 1-based page numbers within [1, max]. Empty / "all" → every page.
 */
export function parsePageRange(input: string, max: number): number[] {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed || trimmed === "all") {
    return Array.from({ length: max }, (_, i) => i + 1);
  }
  const pages = new Set<number>();
  for (const part of trimmed.split(",")) {
    const seg = part.trim();
    if (!seg) continue;
    const range = seg.match(/^(\d+)\s*-\s*(\d+)$/);
    if (range) {
      let from = parseInt(range[1], 10);
      let to = parseInt(range[2], 10);
      if (from > to) [from, to] = [to, from];
      for (let p = from; p <= to; p++) if (p >= 1 && p <= max) pages.add(p);
    } else if (/^\d+$/.test(seg)) {
      const p = parseInt(seg, 10);
      if (p >= 1 && p <= max) pages.add(p);
    }
  }
  return Array.from(pages).sort((a, b) => a - b);
}

/** Join the text of the selected pages into one source string. */
export function joinPages(extraction: PdfExtraction, pageNumbers: number[]): string {
  const wanted = new Set(pageNumbers);
  return extraction.pages
    .filter((p) => wanted.has(p.pageNumber))
    .map((p) => p.text)
    .join("\n\n")
    .trim();
}
