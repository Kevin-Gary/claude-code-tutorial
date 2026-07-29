# Nightly setup audit (Claude Code Routine)

The `setup-auditor` subagent, run on a schedule in the cloud, so this skeleton
cannot quietly go stale between cohorts.

## Why a routine and not a reminder

Claude Code ships constantly. A teaching skeleton that drifts is worse than no
skeleton, because people learn the old shape confidently. This is unattended,
repeatable, and ends in a PR a human reviews, which is exactly what routines are
for.

## How it works

Cloud sessions clone this repo and pick up `.claude/agents/` automatically, so
the routine invokes the same `setup-auditor.md` you would use locally. Nothing
is duplicated.

The division of labour matters:

- **`setup-auditor`** has `Read, Grep, Glob, WebFetch, WebSearch` and no write
  tools. It audits and is structurally incapable of changing the repo.
- **The routine session** has write tools. It reads the audit, applies what it
  agrees with, and opens the PR.

Read-only specialist, writeable orchestrator.

## Setup

Create at claude.ai/code/routines, or from the Desktop app sidebar under
Routines, New routine, Cloud.

- **Repository**: this one
- **Trigger**: schedule, daily
- **Prompt**:

```
Use the setup-auditor subagent to check whether this skeleton is still current
against the official Claude Code docs.

Read its report, then apply only the changes you are confident about: fix
anything it flagged as stale, and add anything it flagged as missing that is a
supported, non-experimental native construct. Leave the speculative
recommendations alone.

Open a pull request with the changes. In the PR description, include the
auditor's full report, and list separately what you chose NOT to act on and why.

If nothing is stale and nothing is missing, do not open a PR. Say so and stop.
```

The last line matters. A routine that opens an empty PR every night trains you
to ignore it.
