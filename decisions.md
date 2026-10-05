<!-- 📘 decisions.md is the DEEP archive of durable decisions (ADR style: Context / Decision /
     Consequences). Unlike MEMORY.md, it is deliberately NOT @imported by CLAUDE.md, so it does NOT
     load into context automatically. Claude reads it ON DEMAND (it greps or opens it when it needs
     the full reasoning), or you pull a single entry into one prompt with @decisions.md.
     Why split it out: @import does not save context (imported files load in full at launch), so the
     way you keep the always-on context lean is to leave the deep history UN-imported and read it
     only when it matters. MEMORY.md holds the one-line "what"; this file holds the full "why". -->

# Verdant - decision records

Durable, ADR-style decisions. Append new entries at the bottom. Keep MEMORY.md's one-liner in sync.

---

## 2026-06-24 - Freemium reverse-trial over feature-unlock

**Context.** Verdant is a plant-care app whose growth loop is App Store installs, driven by the
marketing site in `app/`. We debated two monetization shapes: a hard paywall on the core magic
(identify a plant, get a care plan), versus a free tier that gives that magic away and charges for
depth (unlimited ID, smart reminders, photo diagnosis).

**Decision.** Free tier gives away the magic moment. Plus ($5.99/mo, $39.99/yr) is the revenue core.
Family ($9.99/mo, $79.99/yr) lifts ARPU on multi-person households. Annual is discounted to nudge
toward it for better LTV and lower churn.

**Consequences.** The site's whole job is installs, so removing friction at the aha moment is the
cheapest growth we have (trust plus word of mouth). We accept lower immediate conversion in exchange
for funnel volume and retention. Pricing is benchmarked mid-market against Planta and PictureThis
(~$30 to $40/yr). Revisit if free-to-paid conversion sits below ~3% after launch.

---

## 2026-06-18 - Native iOS app, marketing site on the web

**Context.** Verdant needs a camera-driven identify-and-diagnose experience (live camera, on-device
speed, offline care reminders, notifications). The marketing surface needs SEO, fast first paint,
and easy iteration.

**Decision.** Ship the product as a native iOS app; keep the marketing/acquisition surface as this
Next.js site in `app/`. The site's only job is to turn a plant-curious visitor into an install.

**Consequences.** Two codebases, two rhythms: the app optimizes for camera and reliability, the site
optimizes for load speed and conversion. This repo is the SITE plus its Claude Code setup, not the
app. A web-wrapper would have been faster to ship but could not deliver the camera and offline
experience the product promise depends on, so we took the native cost on purpose.
