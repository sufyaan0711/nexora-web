# Zirofi Design System

## Overview

**Zirofi** is a UK-based fintech startup that enables businesses to accept **Pay by Bank** payments via payment link or QR code — eliminating percentage-based card fees entirely. Their positioning is direct, modern, and UK-focused.

- **Website:** https://zirofi.co.uk/
- **Tagline:** "Pay by Bank for Businesses | No % Card Fees"
- **Core value props:** Faster payments, better cash flow, no hardware rental

### Product Context

Zirofi is a single-product marketing + payments platform:

1. **Marketing website** (`zirofi.co.uk`) — Framer-built site. Hero-driven landing page converting UK businesses to sign up.
2. **Payment flows** — Pay-by-bank link + QR code. Merchant-facing dashboard (implied).

### Sources

- `uploads/Zirofi Branding JSON.json` — Scraped branding JSON from zirofi.co.uk (includes color tokens, typography, logo SVG paths, OG metadata, button styles)
- Source URL: https://zirofi.co.uk/ (Framer-generated site, scraped May 2026)
- OG Image: https://framerusercontent.com/images/jqZG5hxvd3TjgUIkhu1yxhV6J8.png (inaccessible from sandbox)
- Favicon: https://framerusercontent.com/images/snombQbpn57REhz13RXTnLf2ayw.png (inaccessible from sandbox)

---

## Content Fundamentals

### Tone of Voice

- **Modern, direct, confident** — no fluff, no jargon overload
- **B2B focused** — speaks to business owners, not consumers
- **"You"-first** — addresses the reader directly ("Take payments your way", "No % fees for you")
- **Benefit-led headlines** — lead with outcome, not feature
- **British English** — UK spelling, UK currency (£), UK banking context ("Pay by Bank" is a UK open-banking term)

### Casing

- **Headlines:** Title Case or Sentence case (both used); NOT all-caps
- **CTAs:** Sentence case ("Get a Free savings check", "Get a free savings check")
- **Nav items:** Sentence case
- **Labels/tags:** Sentence case or all-caps with tracking

### Emoji

- **Not used** in UI. Clean, professional, emoji-free.

### Copy patterns

- Short, punchy headlines (4–8 words)
- Subheads are 1–2 sentences max
- CTAs are action-oriented with a benefit hint ("Get a Free savings check")
- Numbers used prominently to quantify savings ("0% card fees", "£X saved")
- Avoid: filler phrases, passive voice, buzzwords like "innovative" or "revolutionary"

### Example copy

- "Pay by Bank for Businesses"
- "No % Card Fees"
- "Faster payments, better cash flow, no hardware rental"
- "Get a Free savings check"

---

## Visual Foundations

### Colors

| Role | Hex | Usage |
|------|-----|-------|
| Lime (Primary) | `#D0FA93` | CTAs, highlights, active states, accent fills |
| Lime Light (Secondary) | `#E9F9D0` | Soft section backgrounds, hover fills |
| Forest (Dark) | `#0A3D2A` | Primary text, nav background, dark sections |
| Forest Mid | `#1A5C3F` | Hover state for dark elements |
| Background | `#F9F9F9` | Page background |
| Surface | `#FFFFFF` | Cards, modals |

**Color vibe:** High-contrast, fresh, nature-adjacent. The lime + deep forest pairing is bold and distinctive. Very little mid-range color — mostly extremes (near-white bg, near-black text, electric lime accent).

### Typography

- **Headings:** `Exo` — geometric sans with slight futuristic edge. Weights 600–800. Large, bold, confident.
- **Body / UI:** `Inter` — neutral, highly legible. Weight 400–600. Standard 15px body.
- **H1:** 60px, Exo Bold, tight tracking
- **H2:** 48px, Exo Bold
- **Body:** 15px, Inter Regular, 1.65 line-height
- **No serif typeface** in the brand.

### Backgrounds & Sections

- **Alternating section approach:** White/F9F9F9 → Forest green → Lime green → back to white
- **No gradients** — flat, solid color fills only
- **No textures or patterns** — clean, minimal
- **No full-bleed photography** (website uses illustration/icon-style graphics)
- Background images: Not observed; brand relies on color blocking

### Layout

- Wide, spacious sections with generous padding (80–96px vertical)
- Centered hero with CTA buttons
- Feature grids (3-column) below hero
- Fixed navigation bar at top
- Max content width ~1200px

### Spacing

- **Base unit:** 4px
- **Border radius:** 15px (cards, inputs); 100px pill (buttons)
- Standard padding multiples: 16, 24, 32, 48, 64, 80px

### Buttons

- **Primary:** Lime green `#D0FA93` background, forest text `#0A3D2A`, pill shape (border-radius: 100px), no shadow
- **Secondary:** Forest `#0A3D2A` background, lime or white text, pill shape, no shadow
- **No outline-only buttons** observed
- **Hover:** Likely slight darkening / brightness shift (no explicit data)
- **Press state:** Subtle scale-down implied

### Cards

- White background
- 15px border radius (brand default)
- Subtle shadow: `0 4px 16px rgba(10,61,42,0.10)`
- Light green border or no border
- Clean, minimal — no colored left-border accent

### Animations & Interactions

- **Framer-built site** — implies smooth scroll animations, fade-in-up on scroll
- **No aggressive motion** — medium energy brand
- **Hover:** Opacity shift or color darken; no dramatic transforms
- **Easing:** Standard ease-out for most transitions

### Iconography

- Custom or minimal iconography implied
- No icon font detected in branding JSON
- Icons likely simple, line-style SVGs matching the clean brand aesthetic
- See ICONOGRAPHY section below

### Imagery

- **Color vibe:** Fresh, clean — not warm or grainy
- **Illustration style:** Likely flat / isometric fintech illustrations (common for UK open banking brands)
- **No photography** detected in branding data
- Logo is wordmark only (SVG paths)

### Corner Radii

- Cards / containers: 15px
- Buttons: 100px (full pill)
- Small elements (tags, badges): 6–8px

### Shadows

- Minimal shadow use — just enough to lift cards
- Green-tinted shadows (using `rgba(10,61,42,...)`) rather than grey
- No dramatic drop shadows or glow effects

### Borders

- Subtle: `#E4EAE2` for light mode borders
- Rarely used — brand prefers color blocking over bordered containers

---

## Iconography

- **No bundled icon font** detected in the branding JSON
- **Approach:** Simple, stroke-based SVG icons; line weight ~1.5–2px; no fill icons
- **CDN substitute:** Lucide Icons (https://unpkg.com/lucide@latest/dist/umd/lucide.min.js) — closest match in stroke weight and minimal style
- **Emoji:** Not used
- **Unicode chars:** Not observed as decorative icons
- Logo variants available in `assets/`:
  - `assets/logo-dark.svg` — Forest green `#0A3D2A` wordmark (for light backgrounds)
  - `assets/logo-light.svg` — Lime `#D0FA93` wordmark (for dark backgrounds)
  - `assets/logo-white.svg` — White wordmark (for dark backgrounds)

> ⚠️ **Substitution flag:** No icon assets were bundled in the provided branding JSON. Lucide Icons (CDN) are used as the closest stylistic match. If Zirofi uses a custom icon set, please provide the SVG files to replace.

---

## File Index

```
/
├── README.md                  ← This file; brand overview + guidelines
├── SKILL.md                   ← Agent skill descriptor
├── colors_and_type.css        ← CSS custom properties: colors, type, spacing, radius, shadow
├── assets/
│   ├── logo-dark.svg          ← Wordmark, forest green (for light backgrounds)
│   ├── logo-light.svg         ← Wordmark, lime green (for dark backgrounds)
│   └── logo-white.svg         ← Wordmark, white (for dark/image backgrounds)
├── preview/
│   ├── colors-primary.html    ← Primary color swatches
│   ├── colors-neutral.html    ← Neutral / background swatches
│   ├── colors-semantic.html   ← Semantic color tokens
│   ├── type-scale.html        ← Heading type scale specimen
│   ├── type-body.html         ← Body & UI type specimen
│   ├── spacing-tokens.html    ← Spacing scale tokens
│   ├── radius-shadow.html     ← Border radius + shadow system
│   ├── buttons.html           ← Button component states
│   ├── cards.html             ← Card component variants
│   ├── logo.html              ← Logo on light/dark backgrounds
│   └── badges.html            ← Badge / tag components
└── ui_kits/
    └── website/
        ├── README.md          ← Website UI kit notes
        └── index.html         ← Interactive marketing website prototype
```
