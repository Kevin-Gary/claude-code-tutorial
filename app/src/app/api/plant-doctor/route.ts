import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";

/**
 * Plant Doctor — server-only route.
 *
 * The visitor's photo comes in as multipart form data; we hand it to Claude's
 * vision model and return a structured diagnosis. The Anthropic key is read from
 * the server environment (ANTHROPIC_API_KEY in .env.local) and never reaches the
 * browser — route handlers run on the server only.
 */
export const runtime = "nodejs";
export const maxDuration = 30;

// Claude accepts base64 images up to ~5MB. We cap a little under that and ask for
// a smaller photo rather than letting the API reject it with a cryptic error.
const MAX_BYTES = 4.5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

/** The shape we ask Claude to return — also the shape the UI renders. */
const DiagnosisSchema = z.object({
  plant: z
    .string()
    .describe("Best guess at the plant's common name, or 'Not sure' if unclear."),
  severity: z
    .enum(["healthy", "mild", "serious"])
    .describe(
      "healthy = thriving, mild = a fixable issue, serious = needs attention soon.",
    ),
  assessment: z
    .string()
    .describe(
      "2-3 warm, plain-language sentences on what's going on with this plant.",
    ),
  // Aim for 2-3 steps (enforced via the prompt, not a hard schema bound — the
  // model occasionally returns one, and a brittle min/max would fail the parse).
  steps: z
    .array(
      z.object({
        title: z.string().describe("A short action, e.g. 'Ease up on watering'."),
        detail: z
          .string()
          .describe("One specific, doable sentence explaining how."),
      }),
    )
    .describe("2 or 3 specific things the owner can do to help."),
});

const SYSTEM_PROMPT = `You are Verdant's Plant Doctor — the encouraging friend who happens to know a lot about plants. Someone has sent a photo of their plant. Look closely, tell them what's going on, and give 2 or 3 specific things they can do to help.

Voice:
- Warm and human. Talk to one person as "you", in the present tense.
- Confident but never preachy. You help, you don't lecture.
- Short sentences. Lead with the benefit.
- Plant-nerdy is good; jargon for its own sake is not. Explain, don't show off.
- No hype words ("revolutionary", "game-changing", "unlock").
- No em-dashes. Use a period, a comma, or parentheses instead.

If the image isn't a plant, say so kindly in the assessment, set severity to "healthy", and make the steps about retaking a clear, well-lit photo.`;

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json(
      { error: "Send the photo as form data." },
      { status: 400 },
    );
  }

  const image = form.get("image");
  if (!(image instanceof File)) {
    return Response.json(
      { error: "Add a photo of your plant and try again." },
      { status: 400 },
    );
  }

  if (!ALLOWED_TYPES.has(image.type)) {
    return Response.json(
      { error: "That file type won't work. Try a JPEG, PNG, or WebP." },
      { status: 400 },
    );
  }

  if (image.size > MAX_BYTES) {
    return Response.json(
      { error: "That photo's a bit large. A smaller one (under 4MB) works best." },
      { status: 413 },
    );
  }

  const base64 = Buffer.from(await image.arrayBuffer()).toString("base64");
  const mediaType = image.type as
    | "image/jpeg"
    | "image/png"
    | "image/webp"
    | "image/gif";

  // `new Anthropic()` reads ANTHROPIC_API_KEY from the server environment.
  const client = new Anthropic();

  try {
    const response = await client.messages.parse({
      model: "claude-opus-4-8",
      max_tokens: 4000,
      thinking: { type: "adaptive" },
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: base64 },
            },
            {
              type: "text",
              text: "Here's my plant. What's going on, and what should I do to help it?",
            },
          ],
        },
      ],
      output_config: { format: zodOutputFormat(DiagnosisSchema) },
    });

    const diagnosis = response.parsed_output;
    if (!diagnosis || diagnosis.steps.length === 0) {
      return Response.json(
        { error: "We couldn't read that one. Try another photo?" },
        { status: 502 },
      );
    }

    return Response.json(diagnosis);
  } catch (error) {
    // Log the real error server-side; return something friendly and key-safe.
    console.error("[plant-doctor] diagnosis failed:", error);

    if (error instanceof Anthropic.AuthenticationError) {
      return Response.json(
        { error: "The Plant Doctor isn't configured yet. Check the API key." },
        { status: 500 },
      );
    }
    if (error instanceof Anthropic.RateLimitError) {
      return Response.json(
        { error: "Lots of plants right now. Give it a moment and try again." },
        { status: 429 },
      );
    }
    return Response.json(
      { error: "Something went wrong on our end. Try again in a bit." },
      { status: 500 },
    );
  }
}
