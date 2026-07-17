# TEST_REPORT.md — MK QuizFlow v2

Real command results for the v2 App Router build. Updated after the content + SEO + analytics stage (2026-07-17).

## Automated tests

### Command
```bash
pnpm test
```

### Output
```
 RUN  v3.2.7 /Users/mkazi/Tools/35-tool-pdf-to-quiz

 ✓ src/lib/ai/quota.test.ts (5 tests)
 ✓ src/lib/ai/rate-limit.test.ts (5 tests)
 ✓ src/lib/ai/errors.test.ts (7 tests)
 ✓ src/lib/ai/capabilities.test.ts (21 tests)

 Test Files  4 passed (4)
      Tests  38 passed (38)
```

## Compilation, lint, build
- `pnpm tsc --noEmit`: clean (exit 0).
- `pnpm lint` (`eslint src`): clean, 0 problems (exit 0).
- `pnpm build`: success. 38 routes generated. `/opengraph-image` and `/twitter-image` prerender as static content; `/sitemap.xml` and `/robots.txt` generate; all 8 guides and 5 use-cases prerender via `generateStaticParams`.

## Runtime smoke (`next start -p 3101`, production mode)
- Route status: `/`, `/tool`, `/faq`, `/guides/how-to-study`, `/use-cases/exam-prep`, `/cookies`, `/contact`, `/creator`, `/sitemap.xml`, `/robots.txt`, `/opengraph-image`, `/twitter-image` all returned 200.
- OG image: served as `image/png`, 64 KB (real static PNG, no external service).
- JSON-LD verified in served HTML: `SoftwareApplication` (root), `FAQPage` with 13 questions (`/faq`), `Article` + `BreadcrumbList` (`/guides/[slug]`), `Person` (`/creator`).
- Canonical verified: `/faq` → `https://quizflow.mkazi.live/faq`; `og:image` meta points at the static opengraph image.
- Sitemap: 31 `<loc>` entries including 8 guide URLs and 5 use-case URLs.
- Analytics consent gating (the key check):
  - Initial SSR HTML with no consent: 0 GTM/GA script references, 0 AdSense references.
  - After clicking "Allow" in the consent banner (browser): `localStorage['quizflow.consent'] === "granted"` and GTM/GA scripts load (3 googletagmanager references) because ids are set in `.env.local`; AdSense stays 0 (disabled by flag).
  - Consent banner renders by default on first load with equal-weight Allow/Decline and dismisses on choice.
- Footer creator sentence present on public routes.

## Notes
- Analytics scripts only load in production + with a container id + after consent, so they do not appear in `next dev`.
- Ads never load unless `NEXT_PUBLIC_ADSENSE_ENABLED=true` and a client id are both set.
