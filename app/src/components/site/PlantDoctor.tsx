"use client";

import { useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";

/**
 * Plant Doctor — the interactive section. The visitor drops in a photo, we send
 * it to the /api/plant-doctor route (where Claude reads it), and we render the
 * diagnosis back on-brand. All the AI work happens server-side; this component
 * only handles the photo and the result.
 */

type Step = { title: string; detail: string };
type Diagnosis = {
  plant: string;
  severity: "healthy" | "mild" | "serious";
  assessment: string;
  steps: Step[];
};
type Status = "idle" | "loading" | "done" | "error";

/** How each severity reads in the UI — colour, label, and icon. */
const SEVERITY: Record<
  Diagnosis["severity"],
  { tone: "thriving" | "sun" | "wilt"; label: string; icon: IconName }
> = {
  healthy: { tone: "thriving", label: "Looking healthy", icon: "leaf" },
  mild: { tone: "sun", label: "Minor issue", icon: "triangle-alert" },
  serious: { tone: "wilt", label: "Needs attention", icon: "triangle-alert" },
};

/**
 * Shrink large photos in the browser before upload. Phone shots are often
 * 10MB+, which the vision API rejects; 1568px is Claude's sweet spot for detail
 * vs. size. Falls back to the original file if the browser can't encode.
 */
async function downscale(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const maxDim = 1568;
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("encode failed"))),
      "image/jpeg",
      0.85,
    ),
  );
}

export function PlantDoctor() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<Diagnosis | null>(null);
  const [error, setError] = useState<string | null>(null);

  function selectFile(next: File | null) {
    if (!next) return;
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(next));
    setFile(next);
    setResult(null);
    setError(null);
    setStatus("idle");
  }

  function reset() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFile(null);
    setResult(null);
    setError(null);
    setStatus("idle");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function diagnose() {
    if (!file) return;
    setStatus("loading");
    setError(null);

    try {
      let payload: Blob = file;
      try {
        payload = await downscale(file);
      } catch {
        // Browser couldn't resize — send the original and let the server cap it.
      }

      const body = new FormData();
      body.append("image", payload, "plant.jpg");

      const res = await fetch("/api/plant-doctor", { method: "POST", body });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Try again in a bit.");
        setStatus("error");
        return;
      }

      setResult(data as Diagnosis);
      setStatus("done");
    } catch {
      setError("Couldn't reach the Plant Doctor. Check your connection.");
      setStatus("error");
    }
  }

  const severity = result ? SEVERITY[result.severity] : null;

  return (
    <section
      id="plant-doctor"
      className="scroll-mt-24 bg-[var(--bg-sunk)] py-[88px]"
    >
      <div className="mx-auto max-w-[var(--content-max)] px-6 md:px-10">
        <div className="mx-auto mb-12 max-w-[620px] text-center">
          <span className="inline-flex items-center gap-[7px] text-[13px] font-bold uppercase tracking-[0.12em] text-[var(--forest-600)]">
            <Icon name="stethoscope" size={15} /> Plant doctor
          </span>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-[32px] font-extrabold tracking-[-0.02em] text-[var(--forest-900)] md:text-[42px]">
            Not sure what&apos;s wrong? Ask the doctor.
          </h2>
          <p className="mx-auto mt-4 max-w-[460px] text-[17px] leading-[1.6] text-[var(--text-muted)]">
            Drop in a photo of a struggling plant. Verdant reads it and tells you
            what&apos;s going on, plus a few things you can do today.
          </p>
        </div>

        <div className="mx-auto max-w-[760px] rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 shadow-[var(--shadow-sm)] md:p-8">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => selectFile(e.target.files?.[0] ?? null)}
          />

          {/* Photo zone — empty drop target, or the chosen photo with a result. */}
          {!preview ? (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex w-full flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--border-default)] bg-[var(--bg-sunk)] px-6 py-14 text-center transition-colors duration-200 hover:border-[var(--sprout-500)] hover:bg-[var(--forest-50)]"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--forest-100)] text-[var(--forest-600)]">
                <Icon name="image-plus" size={22} />
              </span>
              <span className="font-[family-name:var(--font-display)] text-[18px] font-bold text-[var(--text-strong)]">
                Add a plant photo
              </span>
              <span className="text-[14px] text-[var(--text-muted)]">
                JPEG, PNG, or WebP. One clear, well-lit shot works best.
              </span>
            </button>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-default)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="Your plant"
                  className="h-full max-h-[360px] w-full object-cover"
                />
                <button
                  type="button"
                  onClick={reset}
                  aria-label="Remove photo"
                  className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(27,36,31,0.66)] text-[var(--cream)] backdrop-blur transition-colors hover:bg-[rgba(27,36,31,0.85)]"
                >
                  <Icon name="x" size={16} />
                </button>
              </div>

              <div className="flex flex-col">
                {status !== "done" && (
                  <>
                    <p className="mb-5 text-[15px] leading-[1.55] text-[var(--text-muted)]">
                      Looks good. Tap the button below and we&apos;ll take a
                      look.
                    </p>
                    <Button
                      variant="accent"
                      size="lg"
                      onClick={diagnose}
                      disabled={status === "loading"}
                      leftIcon={
                        <Icon
                          name={
                            status === "loading" ? "loader-circle" : "stethoscope"
                          }
                          size={18}
                          className={status === "loading" ? "animate-spin" : ""}
                        />
                      }
                    >
                      {status === "loading"
                        ? "Reading your plant…"
                        : "Diagnose my plant"}
                    </Button>
                    <button
                      type="button"
                      onClick={() => inputRef.current?.click()}
                      className="mt-3 text-[14px] font-semibold text-[var(--text-link)] hover:underline"
                    >
                      Choose a different photo
                    </button>
                  </>
                )}

                {status === "error" && (
                  <div className="mt-4 flex items-start gap-2.5 rounded-[var(--radius-md)] bg-[var(--wilt-100)] p-3.5 text-[14px] leading-[1.5] text-[var(--wilt-500)]">
                    <Icon name="triangle-alert" size={16} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {status === "done" && severity && result && (
                  <div className="flex flex-col">
                    <Badge
                      tone={severity.tone}
                      icon={<Icon name={severity.icon} size={13} />}
                      className="mb-3 self-start"
                    >
                      {severity.label}
                    </Badge>
                    {result.plant && result.plant !== "Not sure" && (
                      <div className="mb-1 text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--text-faint)]">
                        {result.plant}
                      </div>
                    )}
                    <p className="m-0 text-[16px] leading-[1.55] text-[var(--text-body)]">
                      {result.assessment}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recovery steps, full-width below the photo once we have a result. */}
          {status === "done" && result && (
            <div className="mt-7 border-t border-[var(--border-subtle)] pt-7">
              <h3 className="mb-4 font-[family-name:var(--font-display)] text-[19px] font-bold text-[var(--text-strong)]">
                What to do
              </h3>
              <ol className="m-0 flex list-none flex-col gap-3.5 p-0">
                {result.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3.5">
                    <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--sprout-500)] font-[family-name:var(--font-display)] text-[14px] font-bold text-[var(--forest-900)]">
                      {i + 1}
                    </span>
                    <div>
                      <div className="text-[16px] font-bold text-[var(--text-strong)]">
                        {step.title}
                      </div>
                      <div className="text-[15px] leading-[1.5] text-[var(--text-muted)]">
                        {step.detail}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
              <Button
                variant="secondary"
                size="md"
                onClick={reset}
                className="mt-6"
                leftIcon={<Icon name="refresh-cw" size={16} />}
              >
                Try another photo
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
