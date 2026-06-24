# app/ — the Verdant marketing site

The real product surface: a **Next.js + TypeScript + Tailwind v4** marketing site, built on
Verdant's **Claude Design** system (tokens + components imported via the `claude_design` MCP).

## Run it
```bash
cd app
npm install
npm run dev        # http://localhost:3000
```
`npm run build` produces an optimized static export of the landing page.

## How it's wired
- **Design tokens are the source of truth.** `src/styles/tokens/{fonts,colors,typography,spacing,effects}.css`
  are synced **verbatim** from the Verdant design system. `src/app/globals.css` imports them (the
  webfont `@import` is kept first so the browser doesn't ignore it) and pulls in Tailwind v4.
- **Components mirror the design system.** `src/components/ui/` holds the primitives
  (`Button`, `Badge`, `Avatar`, `CareRing`, `Icon`); `src/components/site/` holds the six landing
  sections. They style themselves with Tailwind utilities that reference the token CSS variables
  (e.g. `bg-[var(--forest-600)]`, `rounded-[var(--radius-pill)]`), so the tokens stay authoritative.
- **Icons** come from `lucide-react` (the system's Lucide choice), wrapped by a typed `Icon`.
- **Page:** `src/app/page.tsx` composes Nav → Hero → How it works → Diagnose → Testimonials → Footer.

## Notes / swap-later
- Fonts load from the Google Fonts CDN (matching the design system's `fonts.css`). Swap for
  `next/font` or licensed binaries when available.
- Hero / diagnose imagery uses the design system's Unsplash placeholders — replace with owned assets.
