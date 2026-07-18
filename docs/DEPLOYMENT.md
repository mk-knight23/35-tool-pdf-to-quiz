# DEPLOYMENT.md — MK QuizFlow v2

This document details the build and deployment processes.

## Build Requirements
- Node.js >= 20 (Next.js 16 requires Node 20.9+)
- pnpm >= 9

## Local Build Pipeline
Before release, verify correct compilation via local builds:
```bash
pnpm install
pnpm typecheck              # tsc --noEmit
pnpm lint                   # eslint src
pnpm test                   # vitest run
pnpm build                  # next build
pnpm exec next start --port 3101   # production smoke (only local port used)
pnpm exec playwright test          # e2e smoke against port 3101
```

## Verification (run locally before shipping)
This repo has no hosted CI — GitHub Actions was intentionally removed during the
single-branch consolidation. Run the same gates by hand before deploying:
1. **verify** — `pnpm typecheck` → `pnpm lint` → `pnpm test` (+ `pnpm test:coverage`) → `pnpm build`.
2. **secrets** — keep credentials out of the tree; only `.env.example` is committed.
3. **audit** — `pnpm audit --prod` (advisory, non-blocking).
4. **e2e** — `pnpm exec playwright test` (builds and runs the smoke on port 3101).

## Hosting
- Target: Vercel (orchestrated under `kazi-reprime` organization).
- Env configuration required:
  - `NEXT_PUBLIC_SITE_URL` (drives SEO canonical)
  - `AI_GATEWAY_API_KEY` (for serverless AI gateway OIDC auth)
  - `AI_MODEL` / `AI_MODEL_QUALITY` (override defaults)
  - `NEXT_PUBLIC_GTM_ID` (optional, for analytics)
- Deployment attachment and DNS settings are managed by the parent orchestrator.
