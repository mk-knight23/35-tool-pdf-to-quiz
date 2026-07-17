# DEPLOYMENT.md — MK QuizFlow v2

This document details the build and deployment processes.

## Build Requirements
- Node.js >= 26.5.0
- pnpm >= 11.12.0

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

## Continuous integration
`.github/workflows/ci.yml` runs on pushes to `main`/`rebuild/**` and PRs to `main`:
1. **verify** — typecheck → lint → vitest + coverage → build.
2. **gitleaks** — secret scan over full history.
3. **audit** — `pnpm audit --prod` report (non-blocking).
4. **e2e** — Playwright smoke (installs chromium, builds, runs on port 3101; non-blocking).

## Hosting
- Target: Vercel (orchestrated under `kazi-reprime` organization).
- Env configuration required:
  - `NEXT_PUBLIC_SITE_URL` (drives SEO canonical)
  - `AI_GATEWAY_API_KEY` (for serverless AI gateway OIDC auth)
  - `AI_MODEL` / `AI_MODEL_QUALITY` (override defaults)
  - `NEXT_PUBLIC_GTM_ID` (optional, for analytics)
- Deployment attachment and DNS settings are managed by the parent orchestrator.
