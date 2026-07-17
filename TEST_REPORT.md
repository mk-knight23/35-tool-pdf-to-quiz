# TEST_REPORT.md — MK QuizFlow v2

Real command results for the v2 App Router build. Updated after the **tests + CI + docs** stage (2026-07-17). All numbers below are actual local command output, not targets.

## Summary

| Check | Command | Result |
| --- | --- | --- |
| Typecheck | `pnpm typecheck` | clean, exit 0 |
| Lint | `pnpm lint` (`eslint src`) | clean, 0 problems, exit 0 |
| Unit tests | `pnpm test` | **206 passed** (21 files), exit 0 |
| Coverage | `pnpm test:coverage` | 86.85% stmts / 84.13% branch / 94.94% funcs (`src/lib`) |
| Build | `pnpm build` | success, 38 routes |
| E2E smoke | `pnpm exec playwright test` | **5 passed, 3 skipped**, exit 0 |

## Unit tests (Vitest)

### Command
```bash
pnpm test
```

### Output
```
 Test Files  21 passed (21)
      Tests  206 passed (206)
```

Per-area coverage (files under `src/lib`, AAA structure + behaviour-named tests):

- **Generators** — `generator.test.ts` (Quick-mode quiz + flashcards: determinism, counts, MCQ/fill shape, warnings).
- **Parsers** — `text.test.ts` (hash, seeded RNG, shuffle, normalise, cleanText, sentence split, keyword extraction, word count).
- **Scoring / dedupe** — `scoring.test.ts`, `dedupe.test.ts`.
- **Simulators** — `srs.test.ts` (SM-2-style scheduler: intervals, ease floor, due counts).
- **Analyzers** — `stats.test.ts` (derived dashboard stats, honest null accuracy), `content.test.ts` (guide/use-case integrity + banned-cliché audit).
- **Storage** — `storage.test.ts` (IndexedDB via `fake-indexeddb`: CRUD, ordering, export/import validation).
- **Quota / limits** — `ai/quota.test.ts`, `ai/rate-limit.test.ts`.
- **Analytics no-op** — `analytics.test.ts` (consent-gated: no data-layer writes until id + production + consent).
- **Config / AI specs** — `prefs.test.ts`, `share.test.ts`, `export.test.ts`, `id.test.ts`, `cn.test.ts`, `site.test.ts`, `ai/catalog.test.ts`, `ai/models.test.ts`, `ai/capabilities.test.ts`, `ai/errors.test.ts`.

### Coverage (v8)
```
File              | % Stmts | % Branch | % Funcs | % Lines
------------------|---------|----------|---------|--------
All files         |   86.85 |    84.13 |   94.94 |   86.85
 lib              |   87.91 |    82.09 |      96 |   87.91
 lib/ai           |   84.41 |    94.73 |   91.66 |   84.41
```
Fully covered (100% stmts): `analytics`, `cn`, `dedupe`, `scoring`, `share`, `srs`, `stats`, `site`, `types`, `guides`, `use-cases`, `ai/catalog`, `ai/models`, `ai/quota`, `ai/rate-limit`, `ai/errors`, `ai/request`. `text` 98.6%, `capabilities` 96.6%, `export` 90.4%, `generator` 85.2%, `prefs` 89%.

Excluded from coverage (browser/network-only, exercised by Playwright, not unit tests): `pdf.ts` (pdf.js extraction), `audio.ts` (Web Audio), `ai/client.ts` (streaming fetch). `id.ts` shows partial because the older-Safari UUID fallback is unreachable under Node.

## Compilation, lint, build
- `pnpm typecheck` (`tsc --noEmit`): clean, exit 0.
- `pnpm lint` (`eslint src`): clean, 0 problems, exit 0.
- `pnpm build`: success. 38 routes. `/opengraph-image` and `/twitter-image` prerender as static; `/sitemap.xml` and `/robots.txt` generate; all 8 guides and 5 use-cases prerender via `generateStaticParams`.

## E2E smoke (Playwright, port 3101)

### Command
```bash
pnpm exec playwright test    # webServer: next start --port 3101
```

### Output
```
Running 8 tests using 1 worker
  ✓ [desktop-chromium] generates and plays a Quick-mode quiz by pointer to a score
  ✓ [desktop-chromium] plays an MCQ Quick-mode quiz with the keyboard only
  ✓ [desktop-chromium] captures homepage and quiz-player screenshots
  ✓ [mobile-chrome]     generates and plays a Quick-mode quiz by pointer to a score
  ✓ [mobile-chrome]     mobile viewport reaches the configure step
  3 skipped
  5 passed (14.7s)
```

- **Primary flow** (both desktop + mobile viewports): paste text → Quick mode → generate quiz → play → score, asserting a percentage result. No AI/network involved.
- **Keyboard pass** (desktop): MCQ-only quiz played entirely with `1` (select), `Enter` (check), `Enter` (advance) per spec F3.
- **Mobile viewport**: reaches the Configure step on a Pixel 7 profile.
- **Screenshots**: real `home.png` and `quiz-player.png` written to `public/screenshots` for the README/docs.
- The 3 skips are intentional project guards (keyboard/screenshots run desktop-only; mobile-only assertion runs on mobile-only).

## Runtime / SEO / analytics smoke (from the prior stage, still valid)
- Route status: `/`, `/tool`, `/faq`, `/guides/how-to-study`, `/use-cases/exam-prep`, `/cookies`, `/contact`, `/creator`, `/sitemap.xml`, `/robots.txt`, `/opengraph-image`, `/twitter-image` all returned 200.
- OG image served as `image/png` (real static PNG, no external service).
- JSON-LD verified in served HTML: `SoftwareApplication` (root), `FAQPage` (`/faq`), `Article` + `BreadcrumbList` (`/guides/[slug]`), `Person` (`/creator`).
- Analytics consent gating: 0 GTM/GA and 0 AdSense script references before consent; GTM loads only after consent in production with an id set. AdSense stays disabled behind its flag.

## Notes
- Analytics scripts only load in production + with a container id + after consent, so they never appear in `next dev`.
- Port 3101 is the only local port used; it is killed after each smoke run.
