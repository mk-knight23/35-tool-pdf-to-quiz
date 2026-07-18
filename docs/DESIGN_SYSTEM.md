# DESIGN_SYSTEM.md — MK QuizFlow v2

The binding visual contract for MK QuizFlow. The implementation stage applies the Tailwind v4 `@theme` mapping in §10 **verbatim**.

## 1. Provenance and direction

Generated with the `ui-ux-pro-max` skill (2026-07-17), then adapted: the skill's first-pass recommendation (claymorphism, purple `#7C3AED`, Baloo 2/Comic Neue via Google Fonts CDN) was **rejected** — it contradicts the mandated direction (calm academic, warm neutral, not a generic AI-gradient site) and external font CDNs are forbidden by our CSP. Retained from the skill's database: the E-Ink/Paper style family (warm paper surfaces, high-contrast ink, reading-first restraint) and the Academic serif+sans pairing principle (scholarly serif display, highly legible sans body), re-based on system font stacks. The legacy "editorial" token system (`_legacy_reference/src/index.css`) is the ancestor; v2 warms it up and adds an accent, glass, and full state coverage.

**Identity: "the annotated desk."** A calm academic reading environment — warm paper surfaces, layered document stacks, index-card questions, a librarian-green accent for actions and progress, marginalia amber for highlights. Quiet chrome, confident typography, no gradients-as-decoration.

**Product metaphors**
- **Layered documents** — source panels render as stacked sheets (offset pseudo-layers, §6).
- **Question cards** — index cards: slightly raised, generous padding, one question per card.
- **Learning path** — a vertical stepper (Upload → Configure → Generate → Play) styled as a reading-list rail.
- **Progress rings** — thin 3px rings in accent green; score rings tick clockwise once.
- **Glass document panels** — frosted preview headers/sticky bars evoke a sheet protector (§6 rules).

## 2. Color tokens

Semantic names; raw hex listed for both modes. AA-verified pairs in §9.

| Token | Light | Dark | Use |
|---|---|---|---|
| `surface` | `#F6F2EA` | `#171412` | Page background (warm paper / lamp-lit desk) |
| `surface-2` | `#FFFDF8` | `#1F1B17` | Cards, document sheets |
| `raised` | `#FFFFFF` | `#2A241F` | Popovers, modals, top layer |
| `ink` | `#1C1917` | `#F2EDE4` | Primary text, primary button bg |
| `ink-secondary` | `#57534E` | `#BEB5A7` | Secondary text, labels |
| `ink-muted` | `#79716B` | `#948A7C` | Hints, timestamps (min 16px) |
| `line` | `#E7E0D5` | `#37312A` | Hairline borders, dividers |
| `line-strong` | `#C9BFAE` | `#4C443A` | Input borders, emphasized rules |
| `accent` | `#0F766E` | `#2DD4BF` | Links, icons, rings, progress, selected states |
| `accent-strong` | `#115E59` | `#14B8A6` | Filled accent buttons/badges bg |
| `on-accent` | `#FFFFFF` | `#0F2E28` | Text on `accent-strong` |
| `accent-tint` | `#E4F1EE` | `#16302C` | Selected option wash, active nav |
| `highlight` | `#B45309` | `#E5B567` | Marginalia: due badges, streaks, timed mode (bold/large only in light) |
| `highlight-tint` | `#F7EDDD` | `#2A2214` | Highlight washes |
| `success` | `#15803D` | `#4ADE80` | Correct answers (always with icon + label) |
| `success-tint` | `#E3F1E7` | `#16261C` | Correct option background |
| `error` | `#B91C1C` | `#F87171` | Incorrect/destructive (always with icon + label) |
| `error-tint` | `#F9E8E8` | `#2C1A18` | Incorrect option background |
| `warning` | `#A16207` | `#FBBF24` | Quota, unsaved changes |
| `warning-tint` | `#F8F0DC` | `#2A2214` | Warning washes |
| `focus` | `#0F766E` | `#2DD4BF` | Focus-visible ring |

Primary button is **ink on paper** (light: `#1C1917` bg / `#F6F2EA` text, hover `#292524`; dark: `#F2EDE4` bg / `#1C1917` text, hover `#E5DFD2`) — the editorial signature. Accent fills are for secondary emphasis (progress, "Start quiz" inside cards, selected chips). Forbidden: purple-blue gradients, glowing blobs, particle fields, emoji-as-icons (lucide-react only, stroke 1.75).

## 3. Typography

Self-hosted/system only — **no font CDNs** (CSP).

- `--font-display` (headings, quiz questions, stat numbers): `"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino, Georgia, "Times New Roman", serif`
- `--font-sans` (UI, body, forms): `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- `--font-mono` (page ranges, counts, timers, code): `ui-monospace, "SF Mono", "Cascadia Code", Menlo, Consolas, "Liberation Mono", monospace`

Scale (rem; 1.25 ratio, 16px base):

| Token | Size | LH | Use |
|---|---|---|---|
| `2xs` | 0.6875 | 1.3 | Uppercase overlines, tracking +0.08em |
| `xs` | 0.75 | 1.4 | Badges, table meta |
| `sm` | 0.875 | 1.5 | Secondary UI, helper text |
| `base` | 1 | 1.6 | Body, answers, forms |
| `lg` | 1.125 | 1.55 | Question text (player), lead paragraphs |
| `xl` | 1.25 | 1.4 | Card titles |
| `2xl` | 1.5 | 1.3 | Section headings |
| `3xl` | 1.875 | 1.25 | Page titles |
| `4xl` | 2.375 | 1.15 | Landing sub-hero, stat numbers (tabular-nums) |
| `5xl` | 3 | 1.1 | Landing hero (display serif, tracking −0.015em) |

Weights: display 400/600 (serif italic for emphasis, as in the legacy hero); sans 400 body, 500 labels, 600 buttons/headings. Reading measure 68ch max; timers/scores use `font-variant-numeric: tabular-nums`.

## 4. Spacing

4px grid (Tailwind default scale). Rhythm rules: card padding 20–24px; gap between question cards 16px; section spacing 48/64px; page gutters 16px mobile / 24px tablet / 32px desktop; content container `max-w-6xl` (72rem), reading content `max-w-[68ch]`. Touch targets ≥44×44px for primary controls, never <24×24px (WCAG 2.2 2.5.8).

## 5. Radii

| Token | Value | Use |
|---|---|---|
| `xs` | 4px | Checkboxes, tags |
| `sm` | 6px | Inputs, small buttons |
| `md` | 10px | Buttons, question cards |
| `lg` | 14px | Document panels, modals |
| `xl` | 20px | Hero panels, dropzone |
| `full` | 9999px | Pills, progress bars, rings |

## 6. Elevation & glass

Warm-tinted shadows (`rgba(62,50,37,·)`), never pure black in light mode. Dark mode reduces shadow reliance: elevation = surface step + border.

| Token | Light value | Dark equivalent |
|---|---|---|
| `hairline` | `0 0 0 1px rgba(28,25,23,0.06)` | `0 0 0 1px rgba(242,237,228,0.07)` |
| `paper` | `0 1px 2px rgba(62,50,37,0.06), 0 2px 6px rgba(62,50,37,0.05)` | surface-2 + `line` border |
| `lifted` | `0 2px 4px rgba(62,50,37,0.07), 0 10px 24px rgba(62,50,37,0.09)` | raised + `line-strong` border |
| `overlay` | `0 4px 12px rgba(62,50,37,0.10), 0 24px 48px rgba(62,50,37,0.16)` | raised + border + scrim |

**Layered-document stack** (source/deck cards): two pseudo-layers behind the sheet, offset `4px`/`8px`, rotated `−0.4deg`/`+0.5deg`, `surface-2` bg + hairline — reads as a paper pile. Static decoration; no animation on it beyond the parent's hover lift.

**Glass rules** (sheet-protector effect): `backdrop-filter: blur(12px) saturate(1.4)`; bg `rgba(255,253,248,0.72)` light / `rgba(31,27,23,0.66)` dark; always 1px `line` border; `@supports not (backdrop-filter: blur(1px))` falls back to solid `surface-2`. Allowed only on: document-preview panel header, sticky quiz progress bar, command/nav bar on scroll. Never behind long-form reading text; text on glass must meet 4.5:1 against the worst-case backdrop (add a solid tint layer if needed). Modal scrim: `rgba(23,20,18,0.5)` both modes.

## 7. Motion

Tokens: `--duration-fast: 120ms` (hover, presses) · `--duration-base: 180ms` (state changes, fades) · `--duration-slow: 240ms` (panels, accordions) · `--duration-deliberate: 320ms` (modals, route-level) · flip `400ms`. Easing: enter `cubic-bezier(0.2, 0, 0, 1)`, exit `cubic-bezier(0.4, 0, 1, 1)`; exits ~70% of enter duration.

Rules: animate `transform`/`opacity` only; press feedback scale 0.98; list/stagger 30ms per item, max 6; answer feedback = 180ms background/border crossfade + icon pop (scale 0.8→1); flashcard flip = 400ms `rotateY` with `perspective: 1200px`; progress ring animates `stroke-dashoffset` 600ms ease-out **once** on view; never block input during animation; no parallax; max 2 animated elements per view.

`prefers-reduced-motion: reduce`: all transitions/animations ≤1ms except opacity crossfades ≤120ms; flip → crossfade; ring renders statically at final value; stagger disabled. Implemented globally (as in the legacy CSS) plus component-level fallbacks.

## 8. Component inventory & interaction states

Every interactive component defines: default / hover / active / focus-visible / disabled / loading (async) / error where applicable. Focus-visible is always: `2px solid var(--color-focus)`, `outline-offset: 2px`, never removed, never obscured (WCAG 2.2 2.4.11). Disabled: 45% opacity + `cursor: not-allowed` + `disabled` attr. Loading buttons keep width, swap label for spinner + `aria-busy`.

| Component | States & notes |
|---|---|
| **Button** primary / secondary (outline `line-strong`, hover border `ink`) / ghost / destructive (`error` fill, confirm dialog first) / link | hover: bg shift 120ms; active: scale 0.98; loading per above |
| **Text input / Textarea** (paste source) | border `line-strong`; hover border `ink-muted`; focus border `accent` + ring; error border `error` + message below + `aria-describedby`; disabled wash |
| **Select / Combobox** | native-first; custom listbox mirrors input states; active option `accent-tint` |
| **Checkbox / Radio / Switch** | 20px control in ≥44px hit area; checked `accent-strong` + white glyph; focus ring; switch thumb slides 120ms |
| **Slider (page range)** | dual-handle; handles 20px in 44px target; filled track `accent`; keyboard arrows ±1, PgUp/PgDn ±10; values shown in mono text (not color-only) |
| **File dropzone** | idle (dashed `line-strong`, xl radius) / dragover (`accent` border + `accent-tint` bg) / parsing (indeterminate bar + honest label, no fake %) / parsed (file chip + page count) / error (message + retry) |
| **Stepper (learning path)** | done (accent check) / current (ring + bold) / upcoming (muted); vertical rail on desktop, compact dots on mobile; steps are links when reachable |
| **Question card (editor)** | default `paper` shadow; hover `lifted`; edit-mode `accent` border; invalid `error` border + summary; duplicate-flagged `warning-tint` + "possible duplicate" chip; drag: lifted + 2° tilt; **keyboard alternative: up/down buttons** (WCAG 2.2 2.5.7) |
| **Answer option (player)** | default outline; hover wash; focus ring; selected `accent-tint` + `accent` border; correct `success-tint` + check icon + "Correct"; incorrect `error-tint` + x icon + "Incorrect"; revealed-correct dashed `success` border; all states icon+text, never color alone; announced via `aria-live="polite"` |
| **Flashcard** | flip on click/Enter/Space; front/back are separate a11y surfaces (`aria-hidden` on hidden face); grade row Again/Hard/Good/Easy as labeled buttons (1–4 keys) |
| **Progress ring** | 3px stroke, `line` track, `accent` fill; center mono number; `role="img"` + `aria-label="Score 8 of 10"` |
| **Progress bar (quiz)** | full radius, `accent`; text "Question 3 of 12" beside it |
| **Badge/Chip** | "Quick mode (no AI)" = `highlight-tint` bg + `highlight` text + zap-off icon, present on generator, quiz header, and exports; difficulty/type chips `accent-tint`; deletable chips have labeled × button |
| **Toast** | raised + overlay shadow; auto-dismiss 4s + pause on hover; `aria-live="polite"`; never steals focus; undo action for destructive ops |
| **Modal / Sheet** | overlay elevation, scrim click + Esc close, focus trap, labeled close button, return focus on close; unsaved-changes confirm |
| **Tabs** | underline indicator slides 180ms; roving tabindex, arrow keys |
| **Accordion (FAQ)** | chevron rotates 180ms; height animation via grid-rows trick (no height animation of raw px) |
| **Table (history)** | row hover wash; sortable headers with `aria-sort`; mobile collapses to cards |
| **Skeleton** | `line` base with subtle shimmer (disabled under reduced motion) |
| **Empty state** | icon + one-sentence honest message + primary action ("No quizzes yet. Create your first from a PDF or pasted notes.") — never fake numbers |
| **Stat tile (dashboard)** | mono tabular number `4xl`, label `sm` `ink-secondary`; real data only; pre-first-use shows "—" + hint |
| **Nav header** | `surface` → glass on scroll; active route `accent` underline + `aria-current="page"`; mobile menu = sheet |
| **Footer** | every public route; the exact creator sentence + GitHub/portfolio/repo links |
| **Cookie consent banner** | equal-weight Accept/Decline (default declined), links to `/cookies`; no dark patterns |
| **Theme toggle** | light/dark/system tri-state, labeled, persisted locally |

## 9. Accessibility constraints (WCAG 2.2 AA)

- **Contrast (1.4.3/1.4.11), verified pairs:** light — ink/surface 14.9:1, ink-secondary/surface-2 7.0:1, ink-muted/surface-2 4.7:1, accent/surface-2 4.8:1, on-accent/accent-strong 6.0:1, success/white 4.5:1, error/white 6.4:1, primary-btn text 13.9:1. Dark — ink/surface 15.2:1, ink-secondary/surface-2 8.1:1, accent/surface-2 8.6:1, on-accent/accent-strong 6.6:1. Non-text UI (borders of inputs, focus ring, ring track vs fill) ≥3:1. Any new pair must be checked before use.
- **Focus:** visible on every interactive element (2.4.7), never fully obscured by sticky bars (2.4.11) — sticky elements get `scroll-padding` allowances.
- **Target size (2.5.8):** ≥24×24px minimum everywhere; ≥44×44px for player answers, grade buttons, primary actions.
- **Dragging (2.5.7):** question reorder and any drag interaction has a single-pointer + keyboard alternative (up/down buttons).
- **Keyboard:** full app operable by keyboard; quiz map 1–4/Enter/Esc documented in-UI; roving tabindex in option groups; no keyboard traps.
- **Semantics:** one `h1` per page, sequential headings; landmarks (`header/nav/main/footer`); labels tied to inputs (never placeholder-only); errors adjacent + `role="alert"`/`aria-live`; quiz feedback announced politely; charts/rings get text equivalents; `lang="en"`.
- **Motion & preferences:** `prefers-reduced-motion` per §7; no flashing content; timed mode always optional and never the default, remaining time conveyed by text + color.
- **Consistent help & redundancy (3.2.6/3.3.7):** contact/help link in the same footer slot on all pages; import/share never asks users to re-enter known data.

## 10. Tailwind v4 `@theme` mapping (implement verbatim in `src/app/globals.css`)

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

:root {
  --qf-surface: #F6F2EA;
  --qf-surface-2: #FFFDF8;
  --qf-raised: #FFFFFF;
  --qf-ink: #1C1917;
  --qf-ink-secondary: #57534E;
  --qf-ink-muted: #79716B;
  --qf-line: #E7E0D5;
  --qf-line-strong: #C9BFAE;
  --qf-accent: #0F766E;
  --qf-accent-strong: #115E59;
  --qf-on-accent: #FFFFFF;
  --qf-accent-tint: #E4F1EE;
  --qf-highlight: #B45309;
  --qf-highlight-tint: #F7EDDD;
  --qf-success: #15803D;
  --qf-success-tint: #E3F1E7;
  --qf-error: #B91C1C;
  --qf-error-tint: #F9E8E8;
  --qf-warning: #A16207;
  --qf-warning-tint: #F8F0DC;
  --qf-focus: #0F766E;
  --qf-btn-primary-bg: #1C1917;
  --qf-btn-primary-fg: #F6F2EA;
  --qf-btn-primary-hover: #292524;
  --qf-glass-bg: rgba(255, 253, 248, 0.72);
  --qf-scrim: rgba(23, 20, 18, 0.5);
  --qf-shadow-hairline: 0 0 0 1px rgba(28, 25, 23, 0.06);
  --qf-shadow-paper: 0 1px 2px rgba(62, 50, 37, 0.06), 0 2px 6px rgba(62, 50, 37, 0.05);
  --qf-shadow-lifted: 0 2px 4px rgba(62, 50, 37, 0.07), 0 10px 24px rgba(62, 50, 37, 0.09);
  --qf-shadow-overlay: 0 4px 12px rgba(62, 50, 37, 0.10), 0 24px 48px rgba(62, 50, 37, 0.16);
}

.dark {
  --qf-surface: #171412;
  --qf-surface-2: #1F1B17;
  --qf-raised: #2A241F;
  --qf-ink: #F2EDE4;
  --qf-ink-secondary: #BEB5A7;
  --qf-ink-muted: #948A7C;
  --qf-line: #37312A;
  --qf-line-strong: #4C443A;
  --qf-accent: #2DD4BF;
  --qf-accent-strong: #14B8A6;
  --qf-on-accent: #0F2E28;
  --qf-accent-tint: #16302C;
  --qf-highlight: #E5B567;
  --qf-highlight-tint: #2A2214;
  --qf-success: #4ADE80;
  --qf-success-tint: #16261C;
  --qf-error: #F87171;
  --qf-error-tint: #2C1A18;
  --qf-warning: #FBBF24;
  --qf-warning-tint: #2A2214;
  --qf-focus: #2DD4BF;
  --qf-btn-primary-bg: #F2EDE4;
  --qf-btn-primary-fg: #1C1917;
  --qf-btn-primary-hover: #E5DFD2;
  --qf-glass-bg: rgba(31, 27, 23, 0.66);
  --qf-shadow-hairline: 0 0 0 1px rgba(242, 237, 228, 0.07);
  --qf-shadow-paper: var(--qf-shadow-hairline);
  --qf-shadow-lifted: var(--qf-shadow-hairline);
  --qf-shadow-overlay: 0 24px 48px rgba(0, 0, 0, 0.5);
}

@theme inline {
  --font-display: "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino, Georgia, "Times New Roman", serif;
  --font-sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-mono: ui-monospace, "SF Mono", "Cascadia Code", Menlo, Consolas, "Liberation Mono", monospace;

  --color-surface: var(--qf-surface);
  --color-surface-2: var(--qf-surface-2);
  --color-raised: var(--qf-raised);
  --color-ink: var(--qf-ink);
  --color-ink-secondary: var(--qf-ink-secondary);
  --color-ink-muted: var(--qf-ink-muted);
  --color-line: var(--qf-line);
  --color-line-strong: var(--qf-line-strong);
  --color-accent: var(--qf-accent);
  --color-accent-strong: var(--qf-accent-strong);
  --color-on-accent: var(--qf-on-accent);
  --color-accent-tint: var(--qf-accent-tint);
  --color-highlight: var(--qf-highlight);
  --color-highlight-tint: var(--qf-highlight-tint);
  --color-success: var(--qf-success);
  --color-success-tint: var(--qf-success-tint);
  --color-error: var(--qf-error);
  --color-error-tint: var(--qf-error-tint);
  --color-warning: var(--qf-warning);
  --color-warning-tint: var(--qf-warning-tint);
  --color-focus: var(--qf-focus);

  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 20px;

  --shadow-hairline: var(--qf-shadow-hairline);
  --shadow-paper: var(--qf-shadow-paper);
  --shadow-lifted: var(--qf-shadow-lifted);
  --shadow-overlay: var(--qf-shadow-overlay);

  --ease-enter: cubic-bezier(0.2, 0, 0, 1);
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);
}

body {
  background: var(--qf-surface);
  color: var(--qf-ink);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

:where(a, button, input, select, textarea, [tabindex]):focus-visible {
  outline: 2px solid var(--qf-focus);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

@media print {
  body { background: #FFFFFF; color: #000000; }
  .no-print { display: none !important; }
}
```

Usage: components use semantic utilities only (`bg-surface-2`, `text-ink-secondary`, `border-line`, `bg-accent-strong text-on-accent`, `shadow-paper`, `rounded-md`) — raw hex in components is forbidden. Dark mode = `.dark` class on `<html>` (tri-state toggle, `system` follows `prefers-color-scheme`). Motion durations via `duration-[120ms|180ms|240ms|320ms]` with `ease-(--ease-enter)`.
