# MONETIZATION_PLAN.md — MK QuizFlow v2

This document details the monetization model and plan for MK QuizFlow.

## Current State
**Monetization is fully disabled in v1.** 
All features (Quick mode, AI integration under daily quota, and BYOK overrides) are 100% free with no ad displays or subscription gates.

## AdSense Preparation (STANDARDS §7)
- **Flag**: Controlled via `NEXT_PUBLIC_ADSENSE_ENABLED` flag (defaults to `false`). GTM/Ad scripts will not load while false.
- **Placements**: Ads will only be rendered within the long sidebar layouts of `/guides` and `/docs` routes to prevent CLS (Cumulative Layout Shift) and preserve a premium workspace feel on `/tool` and `/flashcards`.
- **Publisher ID**: No `ads.txt` will be deployed until a real publisher ID is issued.
