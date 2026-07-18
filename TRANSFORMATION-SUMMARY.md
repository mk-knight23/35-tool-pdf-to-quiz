# Transformation Summary: MK QuizFlow

## Changes Completed
* **Homepage Integration**: Embedded the core `ToolWorkspace` component directly onto the landing page (`src/app/page.tsx`), enabling immediate study note paste and PDF upload on first visit.
* **Basic Mode (Direct Play Flow)**: Reorganized phase transitions in `ToolWorkspace.tsx`. Submitting text or PDF in Basic mode deterministic Quick mode automatically generates the questions and launches the `play` phase, bypassing intermediate setup and manual editor pages.
* **Collapsible Advanced Options**: Redesigned `SourceInput.tsx` to include an expandable settings panel. Moved output formats (Quiz vs Flashcards), generation mode (Quick vs AI), specific question types, difficulty selectors, timer settings, and personal key input into this panel.
* **Refactored Navigation**: Separated sidebar navigation into `PRIMARY_LINKS` (Create, How it works, Guides, GitHub) and `SECONDARY_LINKS` (Dashboard, Library, Settings), clean and uncluttered.
* **Privacy and Trust**: Displayed a clear, concise privacy statement beneath the primary workspace.
* **E2E Test Alignment**: Rewrote Playwright tests to cover the direct-play basic flow and updated the screenshots script.

## Features Preserved
* Detailed review, editing, ordering, deleting, and single-question regeneration capabilities inside `QuestionEditor`.
* SRS flashcard deck study flow.
* History tracking and dashboards (loaded on finish or via the sidebar library menu).
* PDF range selector and character checking.
* Sharing via URL hash; JSON export and import.

## Features Simplified
* Bypassed the separate configuration page (`GenerateConfig.tsx` is no longer in the core flow).
* Bypassed manual question editor review before starting a quiz (accessible after play or through advanced setting).
* Default quiz size selectors (5, 10, 15, 20) with simple defaults.

## Advanced Features Reorganized
* Advanced quiz types, difficulty, timer settings, AI mode toggling, and BYOK input are grouped inside a collapsible panel.
* Manually editing questions before a quiz starts is available via the advanced option "Preview and edit questions before playing".

## Test and Build Results
* **Vitest Unit Tests**: Passed (222/222 tests green).
* **Playwright E2E Tests**: Passed.
* **Production Build**: Successful.

## Genuine Limitations
* Offline Quick mode works with sentence heuristics and cannot create deep contextual/conceptual rephrasings (requires AI mode).
* Scanned or image-only PDFs are not supported (no in-browser OCR).
