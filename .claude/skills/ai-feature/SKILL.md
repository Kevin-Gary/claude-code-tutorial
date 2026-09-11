---
name: ai-feature
description: The pattern for building a Claude-powered feature into the Verdant site (like Plant Doctor) — a server API route that calls Claude plus an on-brand client component. Use this whenever adding any AI/Claude/LLM feature to app/ — photo diagnosis, plant ID, a care-plan generator, a chatbot, smart search, anything that sends user input to a model and shows a result. Reach for it even if the user just says "add an AI thing that does X" without naming this pattern.
---
<!-- 📘 This skill captures HOW we build AI features here, learned from building Plant Doctor.
     It's a recipe, not a script: apply it with judgment. It leans on three other skills instead
     of repeating them — brand-voice (copy), claude-api (SDK specifics), verdant-design-audit
     (styling). Keep those as the source of truth; this skill is the assembly instructions. -->

# Building an AI feature for Verdant

Every Claude-powered feature on the site is the same two pieces. Keep them separate — it's
what keeps the API key off the client and the UI testable.

1. **A server API route** — `app/src/app/api/<feature>/route.ts`. Talks to Claude. Never runs
   in the browser, so the key stays secret.
2. **A client component** — `app/src/components/site/<Feature>.tsx`. Handles the upload/input,
   the loading and error states, and renders the result using our design system.

Then you wire the component into the page and verify it end to end. That's the whole shape.

## Before you build

- The Anthropic SDK (`@anthropic-ai/sdk`) is already a dependency and `ANTHROPIC_API_KEY` already
  lives in `app/.env.local` (gitignored). Don't add a new key or re-install the SDK — reuse them.
- Read the **claude-api** skill for anything SDK-specific (model IDs, vision message shape,
  structured outputs, streaming). Don't guess API surface from memory — it drifts.
- Default model: `claude-opus-4-8`. Only downgrade if the user asks — that's their call, not yours.

## The server route

A single `POST` handler. The reliable recipe:

- `import Anthropic from "@anthropic-ai/sdk"` and construct `new Anthropic()` **inside** the
  handler — it picks up the key from the environment automatically.
- **Define one TypeScript `interface` for the response shape and export it.** The client mirrors
  it. This shared contract is what keeps the two halves honest.
- **Put the brand voice in the system prompt.** Pull the rules from the **brand-voice** skill
  (warm, plant-nerdy, never preachy, no hype). The system prompt is where tone lives.
- **Ask for JSON and parse defensively.** Instruct the model to return *only* a JSON object with
  an exact shape, then extract the first balanced `{...}` from the text and validate it with a
  type guard before trusting it. (For a stricter contract, use structured outputs per claude-api —
  but a clear schema in the prompt + a guard is robust and dependency-free.)
- **Validate input and guard size** — check the media type for images, cap the payload (base64
  balloons ~1.33×), and reject junk early with a clear message.
- **Map errors to friendly, on-brand messages**, most-specific first:
  `Anthropic.AuthenticationError` → config problem, `Anthropic.RateLimitError` → "a little busy,
  try again", everything else → a generic apology. Never leak a raw stack to the user.

Vision features send the image as a base64 block before the text block — see claude-api's Vision
section for the exact `content` array shape. `Plant Doctor`'s route
(`app/src/app/api/diagnose/route.ts`) is the worked example; copy its structure.

## The client component

- `"use client";` at the top — it owns interaction state.
- Model the flow as explicit phases: **idle → loading → result → error**. Loading and error
  states aren't optional; a real network call fails sometimes and a 10-second model call needs a
  visible "working on it".
- **Build only from what exists.** Compose `Button`, `Icon`, and `Badge`, and style with the CSS
  custom-property tokens (`var(--forest-600)`, `var(--radius-lg)`, the care tones, etc.). Do not
  invent one-off colors, spacings, or shadows — the design system is the source of truth. If you
  need an icon that isn't registered, add it to `Icon.tsx`'s registry (it's a typed Lucide
  wrapper) rather than reaching for raw SVG.
- Mirror the server's exported `interface` for the result, and lean on the **care-semantic Badge
  tones** (`thriving`/`sun`/`water`/`wilt`) to signal plant state — that's what they're for.
- Keep copy on-voice (brand-voice skill) and give the user a way to start over ("try another").

`Plant Doctor`'s component (`app/src/components/site/PlantDoctor.tsx`) is the reference.

## Wire it in

- Add the component to `app/src/app/page.tsx` and give its `<section>` an `id`.
- Connect any existing marketing CTA to it. (Our `Button` renders as an anchor when given `href`,
  so a dead "Try it" button becomes `href="#your-section"` with no JS.)

## Verify before you call it done

Use the preview tools, not the user's eyeballs. Confirm it compiles (no server/console errors),
then run one **real** request end to end — feed a genuine input through the live route and watch a
real result render. Screenshot the result state. A feature that's never made a real model call is
unverified.

## When you're done

Offer a **design-reviewer** pass (or the **verdant-design-audit** skill) on the new component —
a second set of eyes on token usage before it ships.
