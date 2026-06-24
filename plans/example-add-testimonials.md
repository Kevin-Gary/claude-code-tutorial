<!-- 📘 This is an example of a SAVED PLAN. When you use plan mode, Claude writes the plan to
     ~/.claude/plans/<name>.md automatically. That home-level copy may only survive a compaction
     or two, so the durable move is to keep a copy in the project (this folder). The Stop hook in
     .claude/settings.json does that copy for you automatically. Below is what a plan looks like. -->

# Plan: Add a testimonials section to the Verdant landing page

## Goal
Add a "Loved by plant people" testimonials section to `app/` between the features and the
final call-to-action, using the existing design-system components.

## Approach
1. Read the current page layout in `app/` to find the features and CTA sections.
2. Reuse the design system's Card component for each testimonial (avatar, quote, name, plant count).
3. Add 3 testimonials with placeholder copy that matches the brand-voice skill.
4. Make it responsive: 1 column on mobile, 3 on desktop.

## Files to change
- `app/` page/layout file: insert the new section in the right spot.
- A new `Testimonials` component, following the existing component pattern.

## Out of scope
- Real testimonial content (placeholders for now).
- A CMS or data source (hardcoded array is fine for the landing page).

## How we'll verify
- Run the dev server and check the section renders, on-brand, responsive.
- Run the `design-reviewer` subagent to confirm it's on-system.
