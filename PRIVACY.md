# PRIVACY.md — MK QuizFlow v2

This document details the privacy guarantees of MK QuizFlow.

## Binding Guarantees
1. **Local-First Processing**: All file text extraction and Quick Mode questions are processed in the client browser tab. 
2. **Serverless AI Zero-Retention**: If you use AI mode, text is passed to our serverless route to call the Vercel AI SDK and is immediately discarded. We do not store, review, or collect your files or study texts.
3. **Analytics Opt-In**: Google Tag Manager tracking is completely disabled by default. If enabled, we only track bucketed feature metadata (e.g. word count bucket, question count). We never track study text or questions.
4. **BYOK Key Confidentiality**: Custom keys are held client-side in the browser's session memory, passed to the Vercel AI Gateway, and never persisted server-side.
