<!-- 📘 CLAUDE.md is the file Claude Code auto-loads at the start of EVERY session in this
     folder. It is your "contract" with Claude: who you are, what you're building, how you
     want it to work. Claude also loads ~/.claude/CLAUDE.md (you, every project) and walks UP
     the folder tree loading any parent CLAUDE.md too, so context inherits from broad to narrow.
     Keep this tight and high-signal. It is loaded into context, so every line costs tokens. -->

# Verdant

Verdant is a plant-care and plant-identification company. This repo holds the **marketing
site** (in `app/`) plus the Claude Code setup used to build and run it.

## What we're building
A fast, friendly marketing site that turns plant-curious visitors into app installs. The site
is built with **Next.js + TypeScript + Tailwind**, styled with Verdant's **Claude Design**
system (synced into this repo via `/design-sync`).

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
