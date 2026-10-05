#!/usr/bin/env bash
# 📘 A HOOK is a shell script Claude Code runs automatically at a fixed point in a session's
# lifecycle (there are ~11: SessionStart, PreToolUse, PostToolUse, Stop, etc). This one is a
# STOP hook: it fires when Claude is about to finish its turn and yield back to you. It's wired
# up in .claude/settings.json under "hooks.Stop".
#
# What it does: once per throttle window, it nudges Claude to write any durable decisions into
# MEMORY.md before yielding. It does that by printing {"decision":"block","reason":"..."} to
# stdout, which tells Claude "don't stop yet, here's something to handle first."
#
# Native, zero dependencies: it reads the hook's JSON payload from stdin and parses with grep.
# It ALWAYS exits 0 so it can never break your session.

set -euo pipefail

# The Stop-hook JSON payload arrives on stdin. The key field is "stop_hook_active": it's true
# when we're ALREADY inside a stop-hook-triggered continuation. If we blocked again there, we'd
# loop forever, so we bail out immediately in that case.
payload="$(cat)"
if printf '%s' "$payload" | grep -q '"stop_hook_active"[[:space:]]*:[[:space:]]*true'; then
  exit 0
fi

# Throttle: only nudge once per window so we're not nagging on every single turn. The stamp file
# lives in a temp dir (kept out of the repo). Lower WINDOW_SECONDS to see it fire more often in a
# live demo; raise it for everyday use.
WINDOW_SECONDS=1800
stamp="${TMPDIR:-/tmp}/claude-code-tutorial-memory-nudge"
now="$(date +%s)"
if [ -f "$stamp" ]; then
  last="$(cat "$stamp" 2>/dev/null || echo 0)"
  if [ $(( now - last )) -lt "$WINDOW_SECONDS" ]; then
    exit 0
  fi
fi
printf '%s' "$now" > "$stamp"

# Emit the block. Claude sees "reason" and gets one chance to update memory before it stops.
printf '%s\n' '{"decision":"block","reason":"Before finishing: if this turn produced a durable decision or a gotcha worth remembering, append a short dated entry to MEMORY.md (full reasoning goes in decisions.md). If nothing durable happened, just stop."}'
exit 0
