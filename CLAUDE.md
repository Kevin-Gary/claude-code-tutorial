<!-- 📘 CLAUDE.md is the file Claude Code auto-loads at the start of EVERY session in this
     folder. It is your "contract" with Claude: who you are, what you're building, how you
     want it to work. Claude also loads ~/.claude/CLAUDE.md (you, every project) and walks UP
     the folder tree loading any parent CLAUDE.md too, so context inherits from broad to narrow.
     Keep this tight and high-signal. It is loaded into context, so every line costs tokens. -->

When relevant pull in context from files that I have in .claude/docs make sure to check that when we're talking

# Verdant

Verdant is a plant-care and plant-identification company. This repo holds the **marketing
site** (in `app/`) plus the Claude Code setup used to build and run it.

## What we're building
A fast, friendly marketing site that turns plant-curious visitors into app installs. The site
is built with **Next.js + TypeScript + Tailwind**, styled with Verdant's **Claude Design**
system (synced into this repo via `/design-sync`).

## Pricing & business model
Verdant runs a **freemium subscription**: a free tier that gets people in the door, plus two
paid tiers billed monthly or annually.

| Tier | Monthly | Annual | Who it's for |
| --- | --- | --- | --- |
| **Free** | $0 | $0 | First few plants — ID up to 5 plants/mo, reminders for up to 3 plants, community access. |
| **Plus** | $5.99 | $39.99 (save ~44%) | A growing collection — unlimited ID, unlimited care plans + smart seasonal reminders, photo diagnosis (Plant Doctor), light meter & room placement. |
| **Family** | $9.99 | $79.99 (save ~33%) | The whole household — everything in Plus, up to 5 members, a shared plant library, priority expert help, early access. |

**Why this model:**
- **Free tier feeds the install funnel.** The site's whole job is installs. Giving away the
  magic moment (identify a plant, get a real care plan) removes friction, builds trust, and
  drives word of mouth — the cheapest growth we have.
- **Plus is the revenue core.** Keeping plants alive is a *recurring* problem, so a recurring
  price is honest. The paid features (unlimited ID, smart reminders, diagnosis) map directly to
  ongoing value, not a one-time unlock.
- **Family lifts ARPU** on our most engaged households (multi-person plant collections) and is
  nearly free to serve once Plus exists.
- **Priced for the market.** Benchmarked against Planta / PictureThis (~$30–40/yr). Plus at
  $39.99/yr sits mid-market; the annual discount nudges toward annual plans for better LTV and
  lower churn.

## How to work in this repo
<!-- 📘 Conventions go here. This is where you teach Claude your taste once, instead of
     re-explaining it in every prompt. -->
- Match the existing component and file patterns in `app/`; look before you build.
- Keep copy on-brand: warm, encouraging, plant-nerdy but never preachy (see the `brand-voice` skill).
- Never commit secrets. Anything personal or machine-specific goes in `CLAUDE.local.md` (gitignored).
- Prefer small, reviewable changes. Use **plan mode** for anything non-trivial so we agree on the
  approach before any files change.

## Project structure
- `app/` — the Verdant marketing site (the real product surface).
- `plans/` — saved plans from plan mode (our durable decision history).
- `.claude/` — the Claude Code config: skills, subagents, slash commands, settings, hooks.
- `.mcp.json` — external tools/data wired in over MCP (Claude Design lives here).

## Good to know
<!-- 📘 A "good to know" section is a cheap way to prevent repeated mistakes. Add to it whenever
     you find yourself correcting Claude on the same thing twice. -->
- The design system is the source of truth for colors, spacing, and components. Don't invent
  one-off styles; use the synced tokens/components.
- This is a teaching repo. Clarity beats cleverness everywhere.
