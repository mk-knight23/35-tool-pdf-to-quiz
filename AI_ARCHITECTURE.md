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
  ├──► Credentials resolver: BYOK key ? forward to OpenRouter : fallback to Server credentials
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

## Security & Memory Commitments
- **Zero retention**: Study texts passed to API routes are sent directly to the model upstream and never written to logs or disk on the server.
- **BYOK Keys**: Custom API keys provided by the user are stored strictly in client-side browser tab memory (`sessionStorage`). They are passed directly via the `x-byok-key` header to our serverless route and are never persisted anywhere.
- **Graceful degradation**: If the server API limits are reached, the client displays a toast/warning and prompts the user to either:
  1. Continue using the deterministic offline **Quick Mode**.
  2. Input their own API key (BYOK) to skip server limits.
