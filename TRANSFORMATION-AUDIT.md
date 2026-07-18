# Transformation Audit: MK QuizFlow

## Current Architecture
* **Framework**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide Icons.
* **Storage & Library**: Local-only, using IndexedDB via `idb` for quizzes, flashcard decks, and quiz play histories. No server database.
* **AI Subsystem**: Vercel AI SDK with a serverless proxy route `/api/ai/[capability]`, quota guards, and rate-limiting. Labeled offline/deterministic fallbacks.
* **Offline Quiz Generation**: Deterministic sentence-extraction algorithms located in `src/lib/generator.ts`.
* **Testing Suit**: Vitest for unit tests (23 files, 222 tests passing) and Playwright for E2E testing.

## Existing Working Features
* Paste text/markdown or drop/upload text-based PDFs.
* Client-side PDF text extraction using `pdf.js` with range selection and character checking.
* Quick mode (offline sentence heuristics) and AI mode (Vercel AI SDK backend).
* Interactive quiz player with timer, keyboard shortcuts (1-4, Enter, Esc), and instant feedback.
* Detailed results page showing scores, duration, and question-by-question breakdown.
* Library database storing generated quizzes, flashcard decks, and score history.
* SRS flashcard study interface.
* Sharing via Base64 URL hash; JSON export and import.

## Current User Journey
1. User lands on `/` and reads product copy.
2. User clicks "Create a quiz" button and navigates to `/tool`.
3. User pastes notes or uploads a PDF, clicks "Use this text".
4. User is presented with configuration options: Output (Quiz vs Flashcards), Generation Mode (Quick vs AI), Question Types, Difficulty, Timed Mode, BYOK key. User clicks "Generate".
5. User lands on the question editor preview screen, checks questions, deletes/moves/regenerates items, and clicks "Start quiz".
6. User plays through the quiz.
7. User finishes the quiz and views their score, with options to retake incorrect questions.

## Friction Points
1. **Unnecessary Navigation**: A visitor has to click from the homepage to `/tool` before interacting with the tool.
2. **Dashboard Overhead**: First-time visitors are forced through three configuration and review steps (source input -> configure settings -> edit questions) before playing.
3. **Information Overload**: A simple revision flow is cluttered with advanced toggles like difficulty, question types, timer options, and AI mode configuration.

## Features to Preserve
* Entire IndexedDB storage, history, and dashboard systems.
* The detailed preview, editing, and per-question regeneration capabilities of the review panel.
* Flashcard deck study flow and spaced repetition.
* All sharing, export, and import features.

## Features to Simplify (Basic Mode)
* Bypass `configure` and `review` phases by default. Paste notes -> select size (5, 10, 15) -> click "Create a quiz" -> play quiz immediately.
* Use sensible defaults: mixed question types, medium difficulty, no timer, and deterministic Quick mode.
* Reorganize sidebar navigation into Primary and Library/Secondary categories.
* Hide advanced configuration behind a collapsible "Advanced options" panel on the source input screen.

## Proposed Implementation Order
1. **Auditing**: Document baseline state.
2. **Layout & Sidebar Update**: Edit `SiteHeader.tsx` and `site.ts` to group dashboard/settings into a secondary structure.
3. **Collapsible Advanced Options**: Move `GenerateConfig.tsx` selections into an expandable accordion inside `SourceInput.tsx`.
4. **Basic Mode Flow Integration**: Modify `ToolWorkspace.tsx` to support direct generation and play bypass when advanced options are untouched.
5. **Homepage Embedding**: Update `/` (`src/app/page.tsx`) to embed the `ToolWorkspace` component.
6. **QA & Testing**: Update Playwright tests and run lint/typecheck/build commands.
