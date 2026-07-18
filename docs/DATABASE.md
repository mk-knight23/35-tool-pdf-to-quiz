# DATABASE.md — MK QuizFlow v2

This document details the database architecture decision for MK QuizFlow.

## Decision
**No server-side database is implemented in v1.**

## Rationale
1. **Local-First & Privacy Constraints**: The primary value proposition of QuizFlow is data confidentiality. Uploaded lectures and note files remain completely client-side in the browser tab. Persisting them or their resulting question arrays on a cloud database violates this constraint.
2. **Local Persistence**: Client-side storage is handled using **IndexedDB** (via the `idb` wrapper) behind a unified storage interface (`src/lib/storage.ts`). This is capable of holding megabytes of quiz data, decks, results, and settings per standard browser storage quotas.
3. **Data Control**: Rather than account sync, users backup and restore their data via standardized JSON envelopes that they can export and import.
4. **Maintenance & Costs**: A database-free server model is cheap, serverless, and has near-zero overhead.
