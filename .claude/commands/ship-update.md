---
description: Draft a changelog line + clean commit message for the current changes
---
<!-- 📘 Custom slash commands live in .claude/commands/. The FILENAME is the command name, so
     this file is invoked as `/ship-update`. The body below is the prompt Claude runs when you
     call it. `$ARGUMENTS` is replaced by whatever you type after the command, e.g.
     `/ship-update focus on the pricing section`. User-level versions go in ~/.claude/commands/. -->

Review the current staged and unstaged changes (`git diff` and `git diff --staged`).

Then produce:
1. A single-line changelog entry for Verdant, written for users (impact, not implementation).
2. A clean conventional-commit message (`type(scope): summary`) with a short body if needed.

Extra direction from me: $ARGUMENTS
