<!-- 📘 This README is for humans reading the repo. Claude does not need it to use the rules; the
     rule files below work on their own. -->

# `.claude/rules/` - modular, optionally path-scoped instructions

Rules are a native Claude Code feature for splitting instructions into small, one-topic files
instead of piling everything into `CLAUDE.md`. Every `.md` file in this folder is discovered
(recursively, so you can nest `frontend/`, `backend/`, etc).

There are two kinds, and the difference is the whole point:

## 1. Always-on rules (no frontmatter)

A rule with no YAML frontmatter loads **every session, at the same priority as `.claude/CLAUDE.md`**.
Use it for a house rule that should hold no matter what Claude is touching.

- Example: [`brand-voice.md`](./brand-voice.md) - our non-negotiable copy guardrails (no em-dashes,
  no hype words, second person). They apply to any writing Claude does here.

## 2. Path-scoped rules (`paths:` frontmatter)

A rule with a `paths:` glob list loads **only when Claude reads a file matching one of the globs**.
This is conditional context: it stays out of your way until it's relevant, so it costs zero tokens
the rest of the time.

- Example: [`app-conventions.md`](./app-conventions.md) - frontend conventions scoped to
  `app/**/*.{ts,tsx}`. They appear only when Claude opens a file in the site.

```markdown
---
paths:
  - "app/**/*.tsx"
  - "app/**/*.ts"
---
```

Common globs: `**/*.ts` (any TS file), `src/**/*` (everything under `src/`), `*.md` (root markdown).

## Rule vs CLAUDE.md vs skill - how to choose

| You want...                                                        | Use          |
| ------------------------------------------------------------------ | ------------ |
| One always-on fact, small enough to sit next to project context    | `CLAUDE.md`  |
| A house rule you'd rather keep in its own modular file             | Always-on rule |
| Guidance that only matters for a slice of the codebase             | Path-scoped rule |
| A multi-step recipe you invoke on demand (not needed every turn)   | A **skill** (`.claude/skills/`) |

Rules of thumb: **CLAUDE.md and always-on rules are the same weight** (loaded every session), just
organized differently. **Path-scoped rules** trade always-on presence for a lighter default context.
**Skills** don't load at all until they're relevant, so heavy or occasional guidance belongs there,
not in a rule. (`brand-voice` exists as BOTH here: a tiny always-on rule for the guardrails, and a
fuller `brand-voice` skill for the full recipe when you're actually writing marketing copy.)

Run `/memory` in a session to see exactly which CLAUDE.md and rules files are loaded right now.
