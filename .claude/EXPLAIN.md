# The .claude folder

This is Claude Code's home for THIS project. Special, like CLAUDE.md - Claude
recognizes these files and folders by name.

- `settings.json` - the control panel: permissions (allow / ask / deny), hooks,
  env vars, the default model, and MCP approval. Committed, so the whole team
  shares the same guardrails. Claude updates it as you approve things.
- `settings.local.json` - your personal overrides, gitignored. Same shape as
  settings.json, just for you.
- `rules/` - modular instruction files. A rule with no frontmatter loads every
  session (like CLAUDE.md); a rule with `paths:` frontmatter loads only when
  Claude touches matching files. Split a bloated CLAUDE.md into topics here.
- `commands/` - your custom slash commands. Each file is a saved prompt you
  trigger with a slash (e.g. `/ship-update`).
- `agents/` - subagent definitions. Each file is a specialist worker with its
  own context, tools, and model that Claude can delegate a side task to.
- `skills/` - reusable behaviors and recipes Claude pulls in when relevant
  (see skills/EXPLAIN.md).
- `hooks/` - scripts you attach to points in a Claude session's lifecycle
  (SessionStart, PreToolUse, Stop, and about 8 more) to add behavior or
  override a default. This project uses a Stop hook to keep MEMORY.md current.

Think of it this way: CLAUDE.md (at the root) is the always-loaded project
bible. The .claude folder is the toolbox Claude reaches into.
