<!-- 📘 This is a SUBDIRECTORY CLAUDE.md, and it behaves differently from the one at the repo
     root. The root file loads at the start of every session. This one loads ON DEMAND, only
     when Claude reads a file inside app/. That is a native Claude Code behaviour, and it is
     the cheapest way to keep detail out of your context until the detail is relevant.
     Rule of thumb: root CLAUDE.md is who we are and how we work. This is how THIS code works. -->

# app/ — the Verdant marketing site

Next.js App Router, TypeScript, Tailwind. Its one job is turning plant-curious visitors into
app installs, so every change should make that easier, not just prettier.

## Layout

- `src/app/` — routes, `layout.tsx`, `globals.css`. API routes live at `src/app/api/<name>/route.ts`.
- `src/components/ui/` — generic primitives with no Verdant knowledge in them: `Button`, `Badge`,
  `Icon`, `Avatar`, `CareRing`. Reusable anywhere.
- `src/components/site/` — page sections that DO know about Verdant: `SiteNav`, `Hero`,
  `HowItWorks`, `FeatureDiagnose`, `Pricing`, `SiteFooter`. Composed in `src/app/page.tsx`.
- `src/lib/` — helpers. `cn.ts` is the className joiner; use it instead of template literals.

Keeping `ui/` ignorant of Verdant is the convention that matters most here. If a primitive
starts referencing plants or pricing, it belongs in `site/`.

## Conventions

- Style with Tailwind utilities and the design tokens in `globals.css`. Those tokens come from
  Verdant's Claude Design system, so do not hand-pick hex values: change the token instead.
- Server components by default. Add `"use client"` only when a component genuinely needs state,
  refs, or browser APIs.
- Pricing shown on the site must match the tiers in the root `CLAUDE.md`. If they disagree, the
  root file wins and the site is wrong.

## Secrets

`ANTHROPIC_API_KEY` lives in `app/.env.local`, which is gitignored and never committed. Anything
that calls Claude runs in an API route so the key stays server-side. A component must never hold
a key, and the browser must never see one.
