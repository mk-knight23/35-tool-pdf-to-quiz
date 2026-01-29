# QuizFlow AI — Design System

## Theme Identity: Black & White Editorial

A typography-focused, high-contrast design inspired by print editorial and academic publications. The interface prioritizes readability, information hierarchy, and professional elegance over decorative elements.

---

## Color Palette

### Primary Colors (Strict Monochrome)

| Token | Value | Usage |
|-------|-------|-------|
| `--ink-black` | `#0a0a0a` | Primary text, headings, key UI elements |
| `--off-black` | `#1a1a1a` | Secondary text, borders |
| `--paper-white` | `#fafaf9` | Background (light mode) |
| `--pure-white` | `#ffffff` | Cards, elevated surfaces |
| `--warm-gray` | `#a1a1aa` | Muted text, placeholders |
| `--cool-gray` | `#71717a` | Secondary UI elements |

### Accent Colors (Minimal)

| Token | Value | Usage |
|-------|-------|-------|
| `--accent-black` | `#0a0a0a` | Primary actions, active states |
| `--accent-white` | `#ffffff` | Inverted elements |

### Semantic Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--success` | `#16a34a` | Correct answers, success states |
| `--error` | `#dc2626` | Incorrect answers, errors |
| `--warning` | `#ca8a04` | Warnings |

---

## Typography

### Font Families

```css
--font-display: "Tiémpos", "Georgia", serif;
--font-body: "Inter", system-ui, sans-serif;
--font-mono: "JetBrains Mono", "SF Mono", monospace;
```

### Type Scale

| Size | rem | px | Usage |
|------|-----|-----|-------|
| Display | 4.5rem | 72px | Hero title |
| Headline 1 | 3rem | 48px | Page titles |
| Headline 2 | 2.25rem | 36px | Section headers |
| Headline 3 | 1.5rem | 24px | Card titles |
| Body Large | 1.125rem | 18px | Lead paragraphs |
| Body | 1rem | 16px | Default text |
| Body Small | 0.875rem | 14px | Secondary text |
| Caption | 0.75rem | 12px | Labels, metadata |
| Overline | 0.625rem | 10px | Tags, badges |

### Typography Rules

- Display font (serif) for all headlines and titles
- Body font (sans-serif) for UI elements and body text
- Mono font for code, keyboard shortcuts, numbers
- Maximum line length: 75 characters for body text
- Line height: 1.2 for headings, 1.6 for body

---

## Spacing System

Based on 4px base unit:

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | 4px | Tight spacing |
| `--space-sm` | 8px | Icon-text gaps |
| `--space-md` | 16px | Default padding |
| `--space-lg` | 24px | Section spacing |
| `--space-xl` | 32px | Component gaps |
| `--space-2xl` | 48px | Major sections |
| `--space-3xl` | 64px | Page margins |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 2px | Subtle rounding |
| `--radius-md` | 4px | Cards, buttons |
| `--radius-lg` | 6px | Large containers |

**Note:** Minimal rounded corners for editorial feel.

---

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle elevation |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.08)` | Cards |
| `--shadow-lg` | `0 8px 24px rgba(0,0,0,0.12)` | Modals |
| `--shadow-print` | `0 0 0 1px rgba(0,0,0,0.08)` | Print-style borders |

---

## Components

### Buttons

**Primary Button**
```css
background: var(--ink-black);
color: var(--paper-white);
border: 1px solid var(--ink-black);
padding: var(--space-md) var(--space-lg);
border-radius: var(--radius-sm);
font-weight: 600;
```

**Secondary Button**
```css
background: transparent;
color: var(--ink-black);
border: 1px solid var(--off-black);
padding: var(--space-md) var(--space-lg);
border-radius: var(--radius-sm);
```

### Cards

```css
background: var(--pure-white);
border: 1px solid var(--warm-gray);
border-radius: var(--radius-md);
padding: var(--space-lg);
box-shadow: var(--shadow-print);
```

### Inputs

```css
background: var(--paper-white);
border: 1px solid var(--off-black);
border-radius: var(--radius-sm);
padding: var(--space-sm) var(--space-md);
font-family: var(--font-body);
```

---

## Layout

### Container Widths

| Breakpoint | Max Width | Usage |
|------------|-----------|-------|
| Mobile | 100% | Default |
| Tablet | 640px | Narrow content |
| Desktop | 768px | Reading width |
| Wide | 1024px | Max container |

### Grid System

- 12-column grid
- 16px gutters
- Flexible breakpoints

---

## Motion & Transitions

### Timing Functions

```css
--ease-out: cubic-bezier(0.215, 0.61, 0.355, 1);
--ease-in-out: cubic-bezier(0.645, 0.045, 0.355, 1);
```

### Durations

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-fast` | 150ms | Hover states |
| `--duration-base` | 250ms | Default transitions |
| `--duration-slow` | 400ms | Complex animations |

---

## Iconography

- Use Lucide icons
- Stroke width: 1.5px
- Size: 16px, 20px, 24px
- Color: Inherit from text

---

## Accessibility

- Minimum contrast ratio: 4.5:1 for body text
- Focus visible: 2px solid var(--ink-black)
- Reduced motion: Respect `prefers-reduced-motion`
- Touch targets: Minimum 44x44px

---

## Anti-Patterns

### Don't Use

- Gradient backgrounds
- Drop shadows on text
- Rounded corners > 6px
- Colors other than black/white/gray
- Emoji icons
- Animation on page load
- Background patterns
- Blurred/glass effects

### Use Instead

- Clean borders
- Typography hierarchy
- Whitespace
- Subtle transitions
- Monochromatic palette

---

## Print Styles

```css
@media print {
  background: white;
  color: black;
  box-shadow: none;
}
```

---

## Dark Mode

Dark mode simply inverts the palette:

- Background: `#0a0a0a`
- Surface: `#171717`
- Text: `#fafaf9`
- Border: `#262626`
