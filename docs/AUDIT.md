# AUDIT.md — MK QuizFlow (35-tool-pdf-to-quiz)

Source: `/Users/mkazi/Tools/_shared/audits/35-tool-pdf-to-quiz.json` (Agent A, evidence-based, spot-checked by Agent B on 2026-07-17).
Legacy stack: React 18.3 SPA + Vite 6 + Tailwind v4 + zustand 5, ~2,930 lines, optional (dead) Express server.

## 1. What the legacy app is

A client-side BYOK (bring-your-own OpenRouter key) tool: extract text from an uploaded PDF in the browser with pdf.js, send it to OpenRouter, render an interactive MCQ quiz with preview/edit, scoring, history, share-by-URL, and JSON export/import. All data in localStorage. An Express file-storage backend exists in `server/` but is unused and undeployed.

## 2. What works (verified by Agent A)

- PDF upload via picker + drag-and-drop with type and 10 MB validation
- Client-side PDF text extraction via pdfjs-dist
- AI quiz generation via OpenRouter (user key, JSON response format, retry with exponential backoff)
- Preview/prune questions before starting a quiz
- Quiz-taking UX: keyboard shortcuts 1-4/Enter/Escape, per-question feedback, score, explanations
- History persisted to localStorage (zustand persist) with search and sort
- Share quiz via base64 URL hash; JSON export/import with duplicate-ID merge
- Settings: API key, question count, sound, dark/light/system theme, focus mode
- ErrorBoundary, toasts, rotating study tips during generation, Web Audio click sounds

Build: PASS (tsc + vite, 4.05 s; 793 kB single JS bundle, no code splitting). Tests: 13/13 pass but largely hollow (see below).

## 3. What is broken or fake

| Finding | Evidence |
|---|---|
| Stats tracking never wired — tiles show permanent zeros | `useStatsStore` actions have zero call sites outside the store |
| "Regenerate" button silently discards the quiz | `QuizGenerator.tsx:394-400` calls `handleCancelPreview` |
| SPA deep links 404 in production | live check: `/history` returns HTTP 404; `vercel.json` lacks SPA fallback |
| Progress bar is simulated | `setInterval` + `Math.random()*15` capped at 90% |
| Entire backend is dead | `backendService` server functions never imported; Express app never deployed |
| Tests are hollow | `expect(true).toBe(true)`; store test tests a re-implemented mock; coverage excludes nearly all app code |
| `.env.example` advertises vars no code reads | only `VITE_API_URL` is referenced |
| GitHub nav link points at the wrong repo | `App.tsx:64` → `37-PDF-to-Quiz-Generator` |
| README is template inflation | fake "100/100" badges, nonexistent Gitleaks step, wrong live URLs; `docs/FEATURES.md` is literal placeholder text |
| `deploy-vercel.yml` uses a nonexistent action | `vercel/action-deploy@v1` |
| Footer says v1.0.0, package.json says 2.2.0 | version drift |

## 4. Security findings

- OpenRouter key in plaintext localStorage inside the persisted store; sent browser→openrouter.ai. Deliberate BYOK, but XSS-exposed and no proxy option.
- `Math.random()` for quiz/question IDs (not auth-relevant; still not collision-safe).
- Shared-quiz payloads from the URL hash are `JSON.parse`d with **no schema validation** — malformed payloads crash the quiz view.
- Dead Express server, if ever run publicly: unauthenticated `DELETE /api/data`, open CORS, no rate limit, no body limits, logs full request bodies.
- pdf.js worker loaded from cdnjs at runtime + Google Fonts CDN — third-party egress contradicting the privacy positioning.
- No hardcoded secrets found; no `.env` committed.

## 5. What v2 keeps (copied to `_legacy_reference/`, gitignored)

- `src/services/aiService.ts` — PDF extraction loop, fetchWithRetry, prompt + JSON contract
- `src/types/quiz.ts` — clean domain model
- `src/components/QuizGenerator.tsx` — preview-and-prune flow, keyboard nav, feedback/scoring UX (to be decomposed)
- Share-hash encode/decode + export/import/merge logic (`backendService.ts`, `quizStore.ts`)
- Store shapes (`quizStore.ts`, `settings.ts`, `stats.ts` — stats as a reference for what v2 must actually wire up)
- The "editorial" CSS token system (`src/index.css`) — evolved, not copied, into the v2 design system
- Home hero copy + the 8 GENERATION_TIPS, `public/favicon.svg`, `firebase.json` header set, `useAudio.ts` tone synth

Explicitly NOT ported: `server/` Express app, `dist-server/`, the 36-file `docs/` marketing filler, all 8 legacy GitHub workflows, the 5-platform deployment config sprawl.

## 6. Must-fix carried into v2 acceptance criteria

1. Stats must be recorded from real events (quiz created, question answered, session finished) — no permanent zeros.
2. Regenerate must regenerate (call the generator again with the same source), never discard silently.
3. `crypto.randomUUID()` for all IDs.
4. Zod-validate shared-quiz payloads (and every API input) before use.
5. Real progress reporting where feasible; honest indeterminate states otherwise.
6. Honest README/docs — no fake badges, scores, or URLs.

## 7. Tool availability (STANDARDS §0)

- Available and used: Superpowers, **ui-ux-pro-max** (design-system generation; output adapted — see DESIGN_SYSTEM.md §1), gstack.
- Unavailable: **Graphify** (fallback: direct repository inspection), **Humanizer** (fallback: manual copy audit per STANDARDS §9 + independent QA re-check), **RALPH** (fallback: iterative verify loops).
- No AI provider keys in the environment: AI features go through the Vercel AI Gateway with labeled degradation + BYOK; the deterministic Quick mode works with zero keys.

## 8. ADR-001 — Rebuild on Next.js App Router (orchestrator decision, binding)

**Decision.** All five products in this program rebuild on Next.js (App Router, `src/`, TypeScript strict, Tailwind v4), even where an audit recommended keeping the existing client-only stack.

**Rationale.** The product spec requires server-rendered public content hubs (guides/use-cases at scale), serverless AI routes (`/api/ai/*` behind the Vercel AI Gateway, so users don't have to paste keys into localStorage), and SEO (per-route metadata, sitemap, JSON-LD) that a client-only SPA cannot satisfy. Uniform stack also lets the orchestrator share CI, security headers, and deployment handling across the five squads.

**The audit's own recommendation, recorded honestly.** For this repo, Agent A recommended migration *conditionally*: "as a single BYOK client tool, the current Vite SPA is fine and the cheapest production path is a two-line vercel.json rewrite fix. Migration is justified by the stated product direction, not the current code. … If scope stays 'one small client tool', do NOT migrate — just fix the rewrite." The orchestrator's product direction (content hub + serverless AI + SEO) is exactly the expansion case the audit conditioned on, so for QuizFlow the audit and the ADR converge; the dissent that migration is unnecessary for the *current* scope stands recorded. This ADR will be restated in ARCHITECTURE.md.

**Consequences.** ~1 day migration cost (audit estimate); kills the 5-platform config sprawl; AI calls move server-side; the legacy SPA deep-link 404 class of bug disappears with file-system routing.
