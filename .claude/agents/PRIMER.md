# Subagents — a primer

A **subagent** is a specialized assistant Claude Code can spawn to handle a focused
task in its **own context window**, then report just the result back. They're good for
parallel work, keeping the main thread clean, and routing a job to a tool-restricted
specialist. A subagent is just a markdown file with YAML frontmatter (see
`design-reviewer.md` for a worked example).

There are three kinds you'll run into.

## 1. Project subagents — defined in this `.claude/agents/` folder

The custom ones that ship with this repo:

- **design-reviewer** — reviews UI changes against Verdant's design system. Read-only
  (`tools: Read, Grep, Glob`), so it can review but never edit. Use it after editing
  anything in `app/`.
- **copy-polish** — polishes Verdant marketing copy to the brand voice. (Built live in
  class with `/agents` — proof that a subagent is just a markdown file you can create
  by talking.)

Each one declares its own `description` (when Claude should reach for it), its own
`tools` (what it's allowed to touch), and its own `model`.

## 2. Plugin / global agents — bundled by installed plugins

Installed plugins can ship their own agents. A few **built-ins** are always available,
no plugin required:

- **Explore** — read-only, broad fan-out search across many files; returns conclusions,
  not file dumps.
- **Plan** — designs an implementation strategy without writing code.
- **general-purpose** — catch-all for multi-step research / search.

When you install a plugin (this repo enables `example-skills`), it can add more agents
on top of these.

## 3. How you invoke them

- **Automatically** — Claude launches a subagent via its Agent tool when a task fits the
  agent's `description` (and can run several in parallel).
- **By name** — just ask: "use the design-reviewer subagent on my changes."
- **`/agents`** — the interactive command to create, edit, and list your project agents.
  Pick "create a new agent" and it interviews you (what it does, when it triggers, which
  tools) and writes the markdown file for you.

---

**The one-line mental model:** a subagent does a focused job in its own context and
reports a summary back to *you* — so the noisy work never clutters your main chat. When
you need agents that talk to *each other* (not just report back), that's agent teams;
when you need a script to orchestrate dozens, that's a workflow. Both build on this.
