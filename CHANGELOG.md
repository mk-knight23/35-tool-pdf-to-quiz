# CHANGELOG.md — MK QuizFlow v2

All notable updates to the MK QuizFlow workspace are documented here.

## [2.0.0] - 2026-07-17

### Testing, CI & docs
- Vitest unit suite expanded to **206 tests** across 21 files covering generators, parsers, scoring, dedupe, the SRS scheduler, derived stats, storage (via `fake-indexeddb`), quota/rate-limit, the consent-gated analytics no-op, share/export, AI catalog/models, and content integrity. Real coverage: 86.85% statements / 94.94% functions on `src/lib`.
- Playwright smoke suite on port 3101: deterministic paste → generate → play → score flow on desktop and a mobile viewport, plus a keyboard-only pass. Captures real homepage and quiz-player screenshots into `public/screenshots`.
- GitHub Actions CI (`.github/workflows/ci.yml`): pnpm typecheck → lint → vitest + coverage → build, plus gitleaks secret scan, a non-blocking `pnpm audit --prod` report, and the Playwright smoke job.
- Docs completed: rewrote the README (overview, features, env vars, testing, deployment, screenshot, author, license); refreshed TEST_REPORT.md with real command output.
- Fixed the LICENSE file — was Apache-2.0 / "Vercel, Inc."; now MIT © 2026 Kazi Musharraf to match `package.json` and STANDARDS §3.

### Content, SEO & analytics
- Cookie consent banner (default declined, equal-weight Allow/Decline, links to `/cookies`).
- Analytics are now genuinely consent-gated: GTM/GA load only in production, when a container id is set, and after consent. No third-party script loads by default.
- Typed `track()` wired into core flows: tool open/start/complete/fail, file select/process, AI start/complete/fail, quota reached, exports, share, history, settings, guide open.
- Static Open Graph / Twitter card image rendered locally with `next/og` (no external service).
- Enriched `llms.txt` with page links; fixed `security.txt` contacts and policy branch.
- Expanded all 8 guides to 700+ words each (748–803 words) with concrete, product-specific steps and stated limitations; FAQ expanded to 13 real Q&As.
- Monetization made honest and off by default: removed the fake "Premium tier" / Stripe checkout simulator and the fake "upgrade" ad banner; AdUnit is now an honest reserved slot gated by `NEXT_PUBLIC_ADSENSE_ENABLED`.
- Fixed literal `**markdown**` rendering across about/privacy/open-source/docs/contact/creator; corrected BYOK copy to "Vercel AI Gateway key".

### Added
- Complete rebuild on Next.js App Router (React 19, TypeScript strict, Tailwind CSS v4).
- Serverless AI endpoint route structure at `/api/ai/[capability]` utilizing the Vercel AI SDK and Vercel AI Gateway.
- Token-bucket rate limiter (12/min) and daily anonymous limits (40/day) on serverless capabilities.
- Bring Your Own Key (BYOK) memory-only overrides for server limits.
- Weak-Topic analysis review panel using AI.
- Player hints generation.
- Dynamic use-cases and guides content routes.
- XML Sitemap and Robots config files.
- Local IndexedDB wrapping via `idb`.

### Fixed
- Replaced third-party CDN pdf worker queries with bundled copy-pdf-worker build scripts.
- Removed legacy Vite SPA rewrite errors.
- Cleaned up unmounting React state updates and sync warnings in tabs.
- Removed unused backend service file server files.
