# PRODUCT_SPEC.md — MK QuizFlow v2

Product: **MK QuizFlow** · Domain: https://quizflow.mkazi.live · Repo: https://github.com/mk-knight23/35-tool-pdf-to-quiz
Author: Kazi Musharraf · License: MIT · Stack: Next.js App Router + TypeScript strict + Tailwind v4 + pnpm (STANDARDS §1).

## 1. Objective

Turn study material (PDF or pasted text/markdown) into working study artifacts — quizzes and flashcard decks — entirely in the browser, with an optional AI layer for higher-quality question generation. Local-first: documents are never stored server-side, all user data lives in IndexedDB. The core tool must work end-to-end with **zero AI keys** via the deterministic Quick mode.

## 2. Personas

1. **Exam-prep student (primary).** Uploads lecture PDFs the night before a test. Wants questions fast, retakes only what she got wrong, and cares that nothing is uploaded anywhere.
2. **Teacher/tutor.** Pastes course notes, generates a question set, edits and reorders it, exports to printable HTML/PDF or CSV for a class handout or LMS import.
3. **Professional certifier / lifelong learner.** Works through long technical PDFs chapter by chapter (page ranges), uses flashcards with spaced self-grading and the weak-topic analysis to focus revision.

## 3. Features and acceptance criteria

### 3.1 V1 core — deterministic, must work with zero AI keys

**F1. Document input**
- PDF upload (picker + drag-and-drop), type + size validation (≤ 20 MB), in-browser text extraction with `pdfjs-dist` (current API verified at implementation time; worker self-hosted/bundled — **no CDN worker**).
- Pasted text / markdown input as an equal first-class source.
- Page-range selection for PDFs (e.g. 12–34) before generation; shows per-page character counts so empty/scanned pages are visible.
- AC: a text PDF produces extracted text locally with zero network requests carrying document content; a scanned (image-only) PDF produces an honest "no extractable text" error with guidance (OCR is a non-goal).

**F2. Quick mode (no AI) — deterministic generator**
- Sentence + keyword heuristics produce cloze/fill-blank questions and flashcards from the source text.
- Clearly labeled **"Quick mode (no AI)"** badge on the generator, the resulting quiz, and exports. Never presented as AI output.
- AC: with no network and no keys, upload → generate → play → score → export all succeed; generated items are deterministic for identical input.

**F3. Quiz player**
- Question types: MCQ, true/false, short answer, fill-blank.
- Timed mode (optional, per-quiz), progress indicator, scoring, per-question feedback with explanation when available.
- Review errors after finishing; **retake incorrect only**.
- Keyboard: 1–4 select, Enter confirm/next, Escape exit (preserved from legacy).
- AC: finishing a quiz records a result (score, per-question correctness, duration) to local storage and updates dashboard stats in the same session.

**F4. Question management**
- Edit question text, options, correct answer, explanation; reorder (drag + keyboard-accessible up/down buttons); delete; duplicate detection (normalized-text match) with a "review duplicates" prompt.
- **Regenerate must regenerate**: per-question regenerate calls the active generator (AI or Quick mode) for a replacement; whole-quiz regenerate re-runs generation on the same source. It never silently discards work (confirm dialog when edits would be lost). (Must-fix from audit.)

**F5. Flashcards**
- Deck view with flip UI (motion-safe fallback: crossfade), spaced self-grading (Again / Hard / Good / Easy) driving a simple local review queue.
- AC: grades persist locally; the deck reports due counts honestly.

**F6. Export**
- Quiz → JSON (versioned schema), CSV, Markdown, printable HTML with print CSS (browser print-to-PDF path).
- AC: each export re-imports (JSON) or opens cleanly; exports carry the "Quick mode (no AI)" label when applicable.

**F7. Share & import safety**
- Share-by-URL payloads and imported JSON are **zod-validated before use**; invalid payloads show a friendly error, never a crash. (Must-fix from audit.)
- All IDs via `crypto.randomUUID()`. (Must-fix from audit.)

### 3.2 AI features — `POST /api/ai/*` (Vercel AI Gateway, STANDARDS §10)

Route pattern: zod input → rate limit → quota → `generateObject`/`streamText` with gateway model strings (`AI_MODEL` default `anthropic/claude-haiku-4.5`, `AI_MODEL_QUALITY` default `anthropic/claude-sonnet-4-5`). All responses are structured outputs validated with zod schemas. Uploaded documents are **never stored server-side**; text is streamed to the route and discarded after the response.

- **A1. Question-set generation:** MCQ / TF / short-answer / fill-blank sets with difficulty (easy/medium/hard/mixed) and audience level (school/university/professional).
- **A2. Flashcard generation** from source text.
- **A3. Document summary** and **A4. key concepts** extraction.
- **A5. Explanations & hints** per question (on demand).
- **A6. Regenerate a single question** (same source context, excludes existing duplicates).
- **A7. Weak-topic analysis** from local results history (client sends aggregated results, not the document).
- Degradation: when the gateway is unavailable, show an honest "AI unavailable" state and offer Quick mode + BYOK. BYOK: per-request header `x-byok-key`, held in memory client-side, never logged or stored (single documented mechanism for this product).
- AC: every `/api/ai/*` route rejects invalid input with 400 + structured error; over-quota returns 429 and fires `quota_reached`; no document text appears in any server log.

### 3.3 Dashboard & history — real local data only

- Stats recorded from **real events**: quizzes created, questions answered, accuracy, time studied, recent decks. No permanent zeros; honest empty states before first use. (Must-fix from audit.)
- History lists past quizzes/decks/results with search and sort; entries open back into the player/editor.
- AC: creating a quiz and answering questions visibly changes dashboard numbers within the same session; clearing data from `/settings` resets them with confirmation.

## 4. Non-goals (v1)

- No accounts, sync, or server database (DATABASE.md records the rationale).
- No OCR of scanned/image PDFs (stated as a limitation in docs).
- No LMS integrations (SCORM/LTI), no question marketplace, no collaborative editing.
- No mobile apps; responsive web only.
- No AI grading of free-text short answers in v1 (self-grade + exact/normalized match only).
- No monetization active (AdSense prepared but disabled per STANDARDS §7).

## 5. Page map (STANDARDS §4)

`/` landing · `/tool` quiz workspace (upload → configure → generate → play) · `/flashcards` deck player (product-appropriate extension) · `/dashboard` · `/history` · `/settings` (clear/export/import data, consent, BYOK) · `/docs` · `/use-cases/*` (≥5: exam prep, teaching handouts, certification study, onboarding/training, language vocab) · `/guides/*` (≥8 substantial originals) · `/faq` · `/changelog` · `/about` · `/creator` · `/open-source` · `/privacy` · `/terms` · `/cookies` · `/contact` · custom `not-found.tsx` · root `error.tsx`.

SEO per STANDARDS §5 (metadata, sitemap, robots, JSON-LD incl. `WebApplication`, `FAQPage`, `Article`/`HowTo` on guides, `Person` on `/creator`). Footer sentence on every public route: **"Built and maintained by Kazi Musharraf. Open source for everyone."**

## 6. Privacy constraints (binding)

- Documents are processed in the browser; when AI is used, text is streamed to the AI route without retention. Never stored server-side. Stated plainly in PRIVACY.md.
- All user data (quizzes, decks, results, stats, prefs) in IndexedDB via `idb` behind `src/lib/storage.ts`; localStorage only for tiny prefs.
- Analytics: GTM only after explicit consent (default declined); events limited to the shared union (STANDARDS §6); **never** document text, quiz content, file names, or keys.
- BYOK keys: memory-only, never logged, never persisted server-side, never sent to analytics.
- Security headers, zod on all API input, best-effort per-IP rate limiting (STANDARDS §8).

## 7. Definition of done (this phase)

Zero TS errors · vitest green · Playwright smoke green locally · all §5 pages with real content · Quick mode works end-to-end offline · dashboard shows real local data · docs complete · clean conventional commits on `rebuild/v2`. Deployment is orchestrator-owned.
