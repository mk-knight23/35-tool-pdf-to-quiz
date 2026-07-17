# ANALYTICS_PLAN.md — MK QuizFlow v2

This document details the tracking implementation plan.

## Setup
- Uses Google Tag Manager (GTM) enabled via `NEXT_PUBLIC_GTM_ID`.
- Fully disabled during development or when no ID is set.

## Consent Gate
- Analytics are locked behind an opt-in banner on first load.
- Preference is saved in localStorage (`quizflow.consent`).
- GTM script is injected only after explicit consent is granted.

## Event Tracking Union (STANDARDS §6)
Only standard events from the defined tracking union are dispatched:
- `tool_opened` | `tool_started` | `tool_completed` | `tool_failed`
- `file_selected` | `file_processed`
- `ai_started` | `ai_completed` | `ai_failed`
- `result_exported` | `result_copied` | `result_shared`
- `history_opened` | `settings_changed` | `guide_opened`
- `quota_reached`

No document contents, texts, user answers, keys, or filenames are ever sent.
