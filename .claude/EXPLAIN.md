# The .claude folder

This is Claude Code's home for THIS project. Special, like CLAUDE.md.

- `settings.json` - permissions + hooks. Claude updates it as you approve things.
- `skills/` - reusable recipes (see skills/EXPLAIN.md).
- `commands/` - your custom slash commands (encoded action sequences).
- hooks - scripts you attach to about 11 points in a Claude session's lifecycle,
  to program in behavior or override a default.

Think of it this way: CLAUDE.md (at the root) is the always-loaded project
bible. The .claude folder is the toolbox Claude reaches into.
