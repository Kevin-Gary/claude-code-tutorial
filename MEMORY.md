<!-- 📘 MEMORY.md is a COMMITTED, human-plus-Claude memory log. CLAUDE.md @imports it (see the top
     of CLAUDE.md), so it auto-loads in FULL every session. Claude writes to it two ways: when you
     say "add that to memory" in chat, or automatically via the Stop hook in .claude/hooks/. Because
     it lives in git, this memory is SHARED with your team, VERSIONED, and it survives across
     machines and context compactions. Native auto-memory is none of those.
     Keep it LEAN. It loads in full every session, so every line costs context. When an entry needs
     the full "why", write it in decisions.md (read on demand) and keep a one-liner here. -->

# Verdant - working memory

Running log of durable decisions and gotchas. Newest first. Keep entries short.

## 2026-06-24 - Freemium reverse-trial, not feature-unlock
Free tier gives away the magic moment (identify a plant, get a real care plan) to feed the
install funnel. Plus ($5.99/mo) is the revenue core. Full reasoning: see decisions.md.

## 2026-06-22 - Site copy runs through the brand-voice skill
Every user-facing string on the marketing site is warm, second-person, no hype words, no
em-dashes. The always-on guardrails live in .claude/rules/brand-voice.md; the fuller recipe
is the brand-voice skill.

## 2026-06-20 - Gotcha: design tokens are the source of truth
Do not hand-write one-off colors or spacing in app/. Use the synced Claude Design tokens and
components. A hardcoded hex slipped into the hero once and broke dark mode. Look before you build.
