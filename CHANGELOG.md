# CHANGELOG.md — MK QuizFlow v2

All notable updates to the MK QuizFlow workspace are documented here.

## [2.0.0] - 2026-07-17
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
