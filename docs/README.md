<!-- 📘 docs/ is the on-demand reference library. This README is for humans. -->

# `docs/` - on-demand reference material

This folder is Verdant's reference library: specs, research, PRDs, notes, anything Claude might need
occasionally but should NOT carry in context every session.

The pattern that makes it work is **on-demand loading**:

- **Do not `@import` these files** in `CLAUDE.md`. An `@import` loads the file in full at launch, so
  importing this folder would put every doc in context every session - the opposite of the point.
- Instead, either **point Claude at the folder** (CLAUDE.md says "check `docs/` when relevant" so
  Claude greps/opens a file when a task calls for it), or **pull one doc into a single prompt** with
  `@docs/verdant-market-research.md` when you want it for that turn only.

The trade-off in one line:

| Mechanism                     | Cost                                             |
| ----------------------------- | ------------------------------------------------ |
| `@import` in CLAUDE.md        | Loads in full **every** session (always-on cost) |
| A file in `docs/`, read on demand | Costs context **only when actually used**    |

So: facts Claude needs every session go in `CLAUDE.md` or an always-on rule; deep reference that's
only occasionally relevant lives here and gets pulled in when needed.

## What's here

- [`verdant-market-research.md`](./verdant-market-research.md) - competitive and pricing research
  behind the freemium model. Handy to `@`-mention when working on pricing or positioning copy.
