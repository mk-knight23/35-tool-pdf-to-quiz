# DEPLOYMENT.md — MK QuizFlow v2

This document details the build and deployment processes.

## Build Requirements
- Node.js >= 26.5.0
- pnpm >= 11.12.0

## Local Build Pipeline
Before release, verify correct compilation via local builds:
```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Run build
pnpm build
```

## Hosting
- Target: Vercel (orchestrated under `kazi-reprime` organization).
- Env configuration required:
  - `NEXT_PUBLIC_SITE_URL` (drives SEO canonical)
  - `AI_GATEWAY_API_KEY` (for serverless AI gateway OIDC auth)
  - `AI_MODEL` / `AI_MODEL_QUALITY` (override defaults)
  - `NEXT_PUBLIC_GTM_ID` (optional, for analytics)
- Deployment attachment and DNS settings are managed by the parent orchestrator.
