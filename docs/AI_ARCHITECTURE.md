# AI_ARCHITECTURE.md — MK QuizFlow v2

This document details the AI integration architecture, routing, rate limits, and BYOK overrides.

## Routing Pipeline
```
Browser Request (fetch)
  │
  ├──► Attach x-byok-key (if client key is provided)
  │
  ▼
POST /api/ai/[capability]
  │
  ├──► Rate Limiter: Per-IP token-bucket check (12/min)
  │
  ├──► Input Validator: Zod parsing of body parameters
  │
  ├──► Credentials resolver: BYOK key ? createGateway({ apiKey }) : ambient gateway (server AI_GATEWAY_API_KEY / Vercel OIDC)
  │
  ├──► Quota checker: If not BYOK, consume daily free allowance (40/day limit)
  │
  ▼
Vercel AI SDK generateObject
  │
  ├──► Model: quality (Claude Sonnet 4.5) / fast (Claude Haiku 4.5)
  │
  ▼
Browser Response (with X-Quota-Remaining headers)
```

## Credentials & degradation

- **Primary path (no key needed by the user)**: on a Vercel deploy, OIDC provides
  ambient AI Gateway credentials, so anonymous visitors get the free daily quota
  (40/day, best-effort per instance) without supplying anything. Locally, set
  `AI_GATEWAY_API_KEY` or run `vercel env pull` to populate `VERCEL_OIDC_TOKEN`.
- **BYOK (optional)**: users may paste their own **Vercel AI Gateway** key
  (format `vck_...`). BYOK requests skip the anonymous daily quota. The key is
  forwarded per-request via `createGateway({ apiKey })`.
- **No credentials at all**: the route returns a structured `ai_unavailable`
  (503) response. The client surfaces the honest message and the user continues
  with the deterministic, clearly-labeled **Quick mode (no AI)**.

## Security & memory commitments

- **Zero retention**: study text is sent to the model upstream and never written
  to logs or disk on the server. Error responses leak no user text, keys, or stack traces.
- **BYOK keys**: held strictly in the browser tab's `sessionStorage`, sent only as
  the `x-byok-key` request header, never logged or persisted server-side.
- **Graceful degradation**: when AI is unavailable or the daily limit is reached,
  the client prompts the user to either (1) continue in Quick mode, or (2) add
  their own Vercel AI Gateway key to skip server limits.
