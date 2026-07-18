# SEO_PLAN.md — MK QuizFlow v2

This document details the search engine optimization (SEO) implementation plan.

## Objectives
- Maximize search ranking for keywords like "PDF to quiz", "AI flashcard generator", "local-first study tools".
- Build rich organic landing pages using Use Cases and Guides.

## Execution
1. **Metadata Export**: Fully implemented on every App Router route using dynamic `metadata` structures with unique titles, descriptions, alternates, and OG image settings.
2. **Dynamic XML Sitemap**: `/sitemap.xml` dynamically indexes all static pages, all 5 use-cases, and all 8 guides.
3. **Structured Data**:
   - `WebApplication` schema on the root `/` page.
   - `FAQPage` schema on `/faq`.
   - `Article` schema on `/guides/[slug]`.
   - `BreadcrumbList` on all nested routes.
   - `Person` schema on `/creator`.
4. **LLMs Indexing**: Exposing `/llms.txt` and `/humans.txt` to help search crawlers and AI search tools catalog the site index.
