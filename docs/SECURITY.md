# SECURITY.md — MK QuizFlow v2

This document details the security threat model and disclosure policy for MK QuizFlow.

## Threat Model Summary
- **IndexedDB Exposure**: All study data is persisted locally in the browser's IndexedDB. If another user has administrative access to your device, they can extract this database. We recommend logging out of shared devices or clearing site data.
- **BYOK Key Leakage**: Custom keys are stored in session memory only to prevent XSS-based local storage attacks. We pass the keys via custom HTTPS headers (`x-byok-key`).
- **CSRF & XSS**: Standard security headers (Content Security Policy, X-Content-Type-Options) are configured via `next.config.ts` to mitigate typical script execution vulnerabilities.

## Responsible Disclosure
If you find a security vulnerability, please do not file a public issue. Report it directly via:
- Portfolio: https://www.mkazi.live
- Email: security@mkazi.live
We will address and patch the issue promptly.
