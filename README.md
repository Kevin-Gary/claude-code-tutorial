# Claude Code Tutorial

A clean, minimal, fully-commented reference repo that shows **every core Claude Code building block in one place**. Built for [Claude Camp](https://claudecamp.ai) Day 2.

Clone it, read it, steal the patterns into your own projects. Every file here is a working example with comments explaining *what it is* and *why it exists*.

> The example product is **Verdant**, a fictional plant-care and plant-ID company, so the examples read like real config instead of `foo`/`bar` toys. The actual product (a marketing site) lives in [`app/`](./app).

---

## The map

| Path | What it teaches |
| --- | --- |
| [`CLAUDE.md`](./CLAUDE.md) | The project context "contract" Claude auto-loads every session. Scopes, inheritance, `@`-imports. |
| [`MEMORY.md`](./MEMORY.md) | **Committed memory**: a team-shared, versioned log CLAUDE.md `@`-imports so it loads every session. |
| [`decisions.md`](./decisions.md) | The **deep ADR archive**. Deliberately NOT imported, so it loads only when Claude reads it. |
| [`CLAUDE.local.md.example`](./CLAUDE.local.md.example) | Personal, gitignored overrides for shared repos. |
| [`.claude/settings.json`](./.claude/settings.json) | Permissions (allow/ask/deny), env, and lifecycle **hooks**. |
| [`.claude/rules/`](./.claude/rules) | **Rules**: modular instructions, always-on or path-scoped via `paths:` globs. |
| [`.claude/hooks/`](./.claude/hooks) | Shell **hooks** wired to lifecycle events (here: a Stop hook that nudges memory). |
| [`.claude/commands/`](./.claude/commands) | Custom slash commands (e.g. `/ship-update`) + the `$ARGUMENTS` pattern. |
| [`.claude/agents/`](./.claude/agents) | Custom **subagents** (YAML frontmatter, scoped tools + model). |
| [`.claude/skills/`](./.claude/skills) | **Skills**: reusable recipes Claude pulls in when relevant. |
| [`.mcp.json`](./.mcp.json) | **MCP** servers wired into this project. |
| [`docs/`](./docs) | **On-demand reference** library (specs, research). Read when relevant, never auto-imported. |
| [`plans/`](./plans) | Durable copies of plans from plan mode (the per-project history pattern). |
| [`app/`](./app) | The real thing to operate on: the Verdant site, built with the synced Claude Design system. |

---

## A note on comments

Markdown files here (`CLAUDE.md`, commands, agents, skills, plans) carry inline teaching notes marked `<!-- 📘 ... -->`. You can read them in the raw file; they stay out of the rendered view.

**JSON files can't have comments**, so the two JSON configs are documented right here:

### `.mcp.json`
Declares the MCP servers this project connects to. MCP ("Model Context Protocol") is the open standard that lets Claude talk to outside tools and data through a consistent interface. This repo's example is **`claude_design`** (`https://api.anthropic.com/v1/design/mcp`), the connector that powers `/design-sync` between Claude Code and Claude Design. Run `/design-login` once to authorize it, then `/mcp` to see/manage it.

### `.claude/settings.json`
- **`$schema`** - points at the Claude Code settings schema so your editor autocompletes and validates the file as you edit.
- **`permissions`** - `allow` / `ask` / `deny` lists that decide what Claude can do without stopping to ask. This repo allows reads/edits and safe git, asks before `git push`, and denies destructive commands + reading `.env*`.
- **`env`** - environment variables set for the session (here, an experimental agent-teams flag).
- **`hooks.Stop`** - two hooks fire when a session ends: one copies your most recent plan from `~/.claude/plans/` into this repo's `plans/` (durable per-project plan history, since the home-level copy only survives a compaction or two), the other runs [`.claude/hooks/persist-memory.sh`](./.claude/hooks/persist-memory.sh) to nudge Claude to record any durable decision in `MEMORY.md`.

---

## Quickstart

```bash
git clone https://github.com/Kevin-Gary/claude-code-tutorial.git
cd claude-code-tutorial
claude                 # start Claude Code in this folder
```

Then poke around: ask it about the repo, try `/ship-update`, run the `brand-voice` skill, open plan mode on a change to `app/`.

Built at [Claude Camp](https://claudecamp.ai) · Master the full Claude stack.
