# TEST_REPORT.md — MK QuizFlow v2

Real command results for the v2 App Router build. Updated after the **tests + CI + docs** stage (2026-07-18). All numbers below are actual local command output, not targets.

## Summary

| Check | Command | Result |
| --- | --- | --- |
| Typecheck | `pnpm typecheck` | clean, exit 0 |
| Lint | `pnpm lint` (`eslint src`) | clean, 0 problems, exit 0 |
| Unit tests | `pnpm test` | **222 passed** (23 files), exit 0 |
| Coverage | `pnpm test:coverage` | 94.33% stmts / 84.93% branch / 93.16% funcs (`src/lib`) |
| Build | `pnpm build` | success, 38 routes |
| E2E smoke | `pnpm exec playwright test` | **5 passed, 3 skipped**, exit 0 |

## Unit tests (Vitest)

### Command
```bash
pnpm test
```

### Output
```
 Test Files  23 passed (23)
      Tests  222 passed (222)
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
- **ID generation** — `id.test.ts` (**5 tests**: `crypto.randomUUID` path, the older-Safari `getRandomValues` v4 fallback + its distinctness, and the no-secure-crypto throw). Confirmed by vitest as `src/lib/id.test.ts (5 tests)` — an earlier build note said "6", which was off by one.
- **Config / AI specs** — `prefs.test.ts`, `share.test.ts`, `export.test.ts`, `tips.test.ts`, `cn.test.ts`, `site.test.ts`, `ai/catalog.test.ts`, `ai/models.test.ts`, `ai/capabilities.test.ts`, `ai/errors.test.ts`.

### Coverage (v8)
```
File              | % Stmts | % Branch | % Funcs | % Lines
------------------|---------|----------|---------|--------
All files         |   94.33 |    84.93 |   93.16 |   94.33
 lib              |   92.85 |    83.33 |   93.54 |   92.85
 lib/ai           |   98.52 |    93.44 |   91.66 |   98.52
```
Fully covered (100% stmts): `analytics`, `cn`, `dedupe`, `scoring`, `share`, `srs`, `stats`, `site`, `types`, `guides`, `use-cases`, `id`, `tips`, `ai/catalog`, `ai/models`, `ai/quota`, `ai/rate-limit`, `ai/errors`, `ai/request`. `text` 98.6%, `capabilities` 96.6%, `export` 90.4%, `prefs` 89%, `storage` 83.7%, `generator` 85.2%.

Excluded from coverage (browser/network-only, exercised by Playwright, not unit tests): `pdf.ts` (pdf.js extraction), `audio.ts` (Web Audio), `ai/client.ts` (streaming fetch). These are listed in `vitest.config.ts` with the rationale inline.

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
  5 passed (17.2s)
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

## QA fix pass (2026-07-18)

Independent QA raised one HIGH and three MEDIUM findings; all are resolved or honestly documented below.

### HIGH — security headers (STANDARDS §8) — FIXED & verified
`next.config.ts` now emits the full §8 header set on every route via `headers()` and sets `poweredByHeader: false`. Verified with the same method QA used — `curl -sID -` against `next start` on port 3101:

```
# curl -sID - http://localhost:3101/   (and /tool — identical)
Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none';
  frame-ancestors 'none'; form-action 'self'; script-src 'self' 'unsafe-inline'
  'wasm-unsafe-eval' <gtm/ga/adsense/vercel hosts>; style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: <hosts>; font-src 'self' data:; connect-src 'self' <hosts>;
  frame-src 'self' <hosts>; worker-src 'self' blob:; manifest-src 'self';
  upgrade-insecure-requests
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()
# X-Powered-By: ABSENT (poweredByHeader:false)
```

Documented CSP exceptions: `'unsafe-inline'` in `script-src`/`style-src` (headers are static so the 38 routes keep prerendering — no per-request nonce; needed for Next's inline bootstrap + the inline theme/JSON-LD scripts). `'wasm-unsafe-eval'` + `worker-src 'self' blob:` are for client-side pdf.js decoding/worker. **No `'unsafe-eval'` in production.** GTM/GA/AdSense/Vercel hosts are an allow-list ceiling only — nothing loads them until consent (§6) / the ads flag (§7). The e2e Quick-mode flow (incl. pdf.js path) still passes under this CSP.

### MEDIUM — glowing blobs + glass shell (DESIGN §13) — FIXED (partial; rest documented)
Removed the animated purple/indigo/pink `qf-blob-1/2/3` elements + keyframes and replaced the translucent glass shell (`bg-white/10 … backdrop-blur-2xl`) in `src/app/layout.tsx` with a solid semantic paper surface (`bg-surface-2` / `border-line` / `shadow-paper`). The two concrete §13-forbidden items the finding named are gone. **Known remaining deviation (honest):** the wider theme in `globals.css` still uses cool-slate/indigo tokens + glass panels across ~15 components, whereas `DESIGN_SYSTEM.md` §10 specifies the warm-paper "annotated desk" palette + librarian-green accent. Realigning the full token system is a genuine dedicated design pass (15 files / 66 raw utility usages) and was out of scope for this FIX stage; it is not a quick edit and carries contrast/dark-mode regression risk. Flagged for a follow-up design pass.

### MEDIUM — Vercel Analytics/Speed Insights not consent-gated (§6) — FIXED
`@vercel/analytics` + `@vercel/speed-insights` are now rendered only through `src/components/layout/VercelAnalytics.tsx`, a client wrapper that mounts them exclusively after consent is granted (reacting to the shared `CONSENT_EVENT`), matching the existing GTM/GA gate. No page-view/vitals data is collected before consent.

### MEDIUM — id.test.ts count accuracy — FIXED
An earlier build note said `id.test.ts` had "6 tests"; vitest reports `src/lib/id.test.ts (5 tests)`. TEST_REPORT now states 5. The three described crypto paths (randomUUID, getRandomValues v4 fallback, no-secure-crypto throw) remain genuinely covered.

### Post-fix regression run
- `pnpm typecheck` — clean, exit 0.
- `pnpm lint` — clean, 0 problems, exit 0.
- `pnpm test` — 222 passed (23 files), exit 0.
- `pnpm build` — success, 38 routes, static prerender preserved.
- `pnpm exec playwright test` — 5 passed, 3 skipped (unchanged from baseline; verifies the tool works under the new CSP).

## Notes
- Analytics scripts only load in production + with a container id + after consent, so they never appear in `next dev`.
- Port 3101 is the only local port used; it is killed after each smoke run.
