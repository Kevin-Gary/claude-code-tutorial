import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

/**
 * Plant Doctor — server-side diagnosis endpoint.
 *
 * Takes a plant photo (base64) and asks Claude to look at it and return a
 * structured, on-brand diagnosis: what the plant is, how it's doing, and a
 * short recovery plan. The API key never leaves the server.
 */

// Vision + a compact JSON reply — no need to stream, keep it a single call.
const MODEL = "claude-opus-4-8";

const ALLOWED_MEDIA_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;
type MediaType = (typeof ALLOWED_MEDIA_TYPES)[number];

/** The shape the client renders. Keep in sync with PlantDoctor.tsx. */
export interface Diagnosis {
  plant: string; // best-guess common name, e.g. "Monstera deliciosa"
  status: string; // short headline, e.g. "Overwatered"
  severity: "healthy" | "mild" | "serious";
  summary: string; // 1–2 sentences, plain language
  actions: { title: string; detail: string }[]; // 2–3 concrete steps
}

const SYSTEM_PROMPT = `You are Verdant's Plant Doctor — a warm, encouraging, plant-nerdy houseplant expert.
A user has uploaded a photo of a plant. Look closely and diagnose it.

Voice: warm and reassuring, never preachy or alarmist. Plain language — explain any
term a beginner wouldn't know. Be specific to what you actually see in the photo
(leaf color, spots, drooping, soil, pot, light) rather than generic advice.

Return ONLY a JSON object (no markdown, no prose outside the JSON) with exactly this shape:
{
  "plant": string,        // best guess at the common name; if unsure, describe it ("a fern, likely Boston fern")
  "status": string,       // 1–3 word headline of the main finding, e.g. "Underwatered", "Looking healthy", "Root rot risk"
  "severity": string,     // one of: "healthy", "mild", "serious"
  "summary": string,      // 1–2 warm sentences explaining what you see and why
  "actions": [            // 2–3 concrete, doable steps — most important first
    { "title": string,    // short imperative, e.g. "Water more deeply"
      "detail": string }  // one sentence of specific how/why
  ]
}

If the image clearly is not a plant, set plant to "Hmm, that doesn't look like a plant",
severity to "mild", and use actions to gently ask for a clearer photo of the plant.`;

/** Pull the first balanced JSON object out of the model's text, defensively. */
function extractJson(text: string): string | null {
  const start = text.indexOf("{");
  if (start === -1) return null;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return null;
}

function isValidDiagnosis(v: unknown): v is Diagnosis {
  if (typeof v !== "object" || v === null) return false;
  const d = v as Record<string, unknown>;
  return (
    typeof d.plant === "string" &&
    typeof d.status === "string" &&
    (d.severity === "healthy" || d.severity === "mild" || d.severity === "serious") &&
    typeof d.summary === "string" &&
    Array.isArray(d.actions) &&
    d.actions.length > 0 &&
    d.actions.every(
      (a) =>
        typeof a === "object" &&
        a !== null &&
        typeof (a as Record<string, unknown>).title === "string" &&
        typeof (a as Record<string, unknown>).detail === "string",
    )
  );
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Plant Doctor isn't configured yet — missing API key." },
      { status: 500 },
    );
  }

  let body: { image?: string; mediaType?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { image, mediaType } = body;
  if (!image || typeof image !== "string") {
    return NextResponse.json({ error: "No image provided." }, { status: 400 });
  }

  // Accept either a raw base64 string or a full data: URL and normalize both.
  let base64 = image;
  let detectedType = mediaType;
  const dataUrlMatch = image.match(/^data:(image\/[a-zA-Z+]+);base64,(.*)$/s);
  if (dataUrlMatch) {
    detectedType = dataUrlMatch[1];
    base64 = dataUrlMatch[2];
  }

  if (!ALLOWED_MEDIA_TYPES.includes(detectedType as MediaType)) {
    return NextResponse.json(
      { error: "Please upload a JPEG, PNG, WebP, or GIF image." },
      { status: 400 },
    );
  }

  // Guard payload size (~7MB of base64 ≈ ~5MB image) to stay well under limits.
  if (base64.length > 7_000_000) {
    return NextResponse.json(
      { error: "That image is a bit large — try one under 5MB." },
      { status: 413 },
    );
  }

  const client = new Anthropic();

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1200,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: detectedType as MediaType,
                data: base64,
              },
            },
            {
              type: "text",
              text: "Diagnose this plant and reply with the JSON object only.",
            },
          ],
        },
      ],
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    const json = extractJson(text);
    if (!json) {
      return NextResponse.json(
        { error: "Couldn't read a diagnosis back — please try again." },
        { status: 502 },
      );
    }

    const parsed = JSON.parse(json);
    if (!isValidDiagnosis(parsed)) {
      return NextResponse.json(
        { error: "Got an unexpected response — please try again." },
        { status: 502 },
      );
    }

    // Trim to at most 3 actions for a tidy card.
    parsed.actions = parsed.actions.slice(0, 3);
    return NextResponse.json(parsed satisfies Diagnosis);
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        { error: "Plant Doctor's credentials aren't valid." },
        { status: 500 },
      );
    }
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "Plant Doctor is a little busy — try again in a moment." },
        { status: 429 },
      );
    }
    console.error("Plant Doctor diagnosis failed:", error);
    return NextResponse.json(
      { error: "Something went wrong diagnosing that photo." },
      { status: 500 },
    );
  }
}
