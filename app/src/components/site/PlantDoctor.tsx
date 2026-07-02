"use client";

import { useCallback, useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

/** Mirror of the server `Diagnosis` shape in /api/diagnose/route.ts. */
interface Diagnosis {
  plant: string;
  status: string;
  severity: "healthy" | "mild" | "serious";
  summary: string;
  actions: { title: string; detail: string }[];
}

type Phase = "idle" | "loading" | "result" | "error";

/** How each severity reads on the result card. */
const SEVERITY: Record<
  Diagnosis["severity"],
  { tone: "thriving" | "sun" | "wilt"; icon: IconName; label: string }
> = {
  healthy: { tone: "thriving", icon: "check", label: "Looking good" },
  mild: { tone: "sun", icon: "triangle-alert", label: "Needs a tweak" },
  serious: { tone: "wilt", icon: "triangle-alert", label: "Needs care" },
};

const ACTION_ICONS: IconName[] = ["droplet", "sun", "leaf"];

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function PlantDoctor() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = useCallback(() => {
    setPhase("idle");
    setPreview(null);
    setDiagnosis(null);
    setErrorMsg("");
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const diagnose = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setPhase("error");
      setErrorMsg("That file isn't an image — try a photo of your plant.");
      return;
    }

    try {
      const dataUrl = await readAsDataUrl(file);
      setPreview(dataUrl);
      setDiagnosis(null);
      setErrorMsg("");
      setPhase("loading");

      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl, mediaType: file.type }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPhase("error");
        setErrorMsg(data?.error ?? "Something went wrong — please try again.");
        return;
      }

      setDiagnosis(data as Diagnosis);
      setPhase("result");
    } catch {
      setPhase("error");
      setErrorMsg("Couldn't reach Plant Doctor — check your connection and retry.");
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) diagnose(file);
    },
    [diagnose],
  );

  return (
    <section id="plant-doctor" className="bg-[var(--bg-page)] py-24">
      <div className="mx-auto max-w-[var(--content-max)] px-6 md:px-10">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-[640px] text-center">
          <span className="inline-flex items-center gap-[7px] text-[13px] font-bold uppercase tracking-[0.12em] text-[var(--forest-600)]">
            <Icon name="stethoscope" size={15} /> Plant doctor
          </span>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-[32px] font-extrabold tracking-[-0.02em] text-[var(--forest-900)] md:text-[42px]">
            Something looks off? Get a diagnosis in seconds.
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-[17px] leading-[1.6] text-[var(--text-muted)]">
            Upload a photo of a struggling plant and Verdant&apos;s Plant Doctor
            tells you what&apos;s likely wrong — plus a few things you can do today.
          </p>
        </div>

        {/* Card */}
        <div className="mx-auto max-w-[760px] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-[var(--shadow-md)]">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: image / dropzone */}
            <div className="relative border-b border-[var(--border-subtle)] md:border-b-0 md:border-r">
              {preview ? (
                <div className="relative h-full min-h-[300px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt="Your plant"
                    className="h-full w-full object-cover"
                  />
                  {phase === "loading" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[rgba(16,42,32,0.55)] text-[var(--cream)] backdrop-blur-[2px]">
                      <Icon
                        name="loader-circle"
                        size={30}
                        className="animate-[verdant-spin_0.9s_linear_infinite]"
                      />
                      <span className="text-[15px] font-semibold">
                        Reading the leaves…
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <label
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                  className={cn(
                    "flex h-full min-h-[300px] cursor-pointer flex-col items-center justify-center gap-3 p-8 text-center transition-colors duration-200",
                    dragging
                      ? "bg-[var(--sprout-100)]"
                      : "bg-[var(--bg-sunk)] hover:bg-[var(--forest-50)]",
                  )}
                >
                  <span className="inline-flex h-[60px] w-[60px] items-center justify-center rounded-[var(--radius-md)] bg-[var(--forest-600)] text-[var(--sprout-300)]">
                    <Icon name="image-plus" size={28} />
                  </span>
                  <span className="mt-1 text-[16px] font-bold text-[var(--text-strong)]">
                    Drop a photo here
                  </span>
                  <span className="text-[14px] text-[var(--text-muted)]">
                    or tap to choose — JPEG, PNG or WebP
                  </span>
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) diagnose(file);
                    }}
                  />
                </label>
              )}
            </div>

            {/* Right: result / prompt / error */}
            <div className="flex min-h-[300px] flex-col justify-center p-8 md:p-10">
              {phase === "idle" && (
                <div className="flex flex-col gap-4 text-[var(--text-muted)]">
                  <Badge tone="sprout" icon={<Icon name="sparkles" size={13} />}>
                    Powered by Verdant AI
                  </Badge>
                  <p className="m-0 text-[16px] leading-[1.6]">
                    Your diagnosis appears here. We&apos;ll name the plant, flag
                    what&apos;s going on, and give you a short recovery plan —
                    usually in under ten seconds.
                  </p>
                  <p className="m-0 text-[13px] leading-[1.5] text-[var(--text-faint)]">
                    Photos are used only to generate your diagnosis.
                  </p>
                </div>
              )}

              {phase === "loading" && (
                <div className="flex flex-col gap-3">
                  <div className="h-3 w-24 animate-pulse rounded-full bg-[var(--bg-sunk)]" />
                  <div className="h-6 w-3/4 animate-pulse rounded-full bg-[var(--bg-sunk)]" />
                  <div className="mt-2 h-3 w-full animate-pulse rounded-full bg-[var(--bg-sunk)]" />
                  <div className="h-3 w-5/6 animate-pulse rounded-full bg-[var(--bg-sunk)]" />
                </div>
              )}

              {phase === "result" && diagnosis && (
                <div className="flex flex-col">
                  <div className="mb-3 flex items-center gap-2">
                    <Badge
                      tone={SEVERITY[diagnosis.severity].tone}
                      icon={
                        <Icon
                          name={SEVERITY[diagnosis.severity].icon}
                          size={13}
                        />
                      }
                    >
                      {SEVERITY[diagnosis.severity].label}
                    </Badge>
                    <span className="font-[family-name:var(--font-mono)] text-[12px] font-semibold uppercase tracking-[0.06em] text-[var(--text-faint)]">
                      {diagnosis.plant}
                    </span>
                  </div>
                  <h3 className="m-0 font-[family-name:var(--font-display)] text-[24px] font-bold text-[var(--text-strong)]">
                    {diagnosis.status}
                  </h3>
                  <p className="mb-5 mt-2 text-[15px] leading-[1.6] text-[var(--text-body)]">
                    {diagnosis.summary}
                  </p>
                  <ul className="m-0 flex list-none flex-col gap-3 p-0">
                    {diagnosis.actions.map((a, i) => (
                      <li key={a.title} className="flex items-start gap-3">
                        <span className="mt-px inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--forest-50)] text-[var(--forest-600)]">
                          <Icon
                            name={ACTION_ICONS[i % ACTION_ICONS.length]}
                            size={15}
                          />
                        </span>
                        <span className="text-[15px] leading-[1.5] text-[var(--text-body)]">
                          <span className="font-bold text-[var(--text-strong)]">
                            {a.title}.
                          </span>{" "}
                          {a.detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={reset}
                      leftIcon={<Icon name="refresh-cw" size={15} />}
                    >
                      Diagnose another
                    </Button>
                  </div>
                </div>
              )}

              {phase === "error" && (
                <div className="flex flex-col gap-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--wilt-100)] text-[var(--wilt-500)]">
                    <Icon name="triangle-alert" size={20} />
                  </span>
                  <p className="m-0 text-[16px] leading-[1.6] text-[var(--text-body)]">
                    {errorMsg}
                  </p>
                  <div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={reset}
                      leftIcon={<Icon name="refresh-cw" size={15} />}
                    >
                      Try again
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
