import React from "react";
import { cn } from "@/lib/cn";

/** Small status pill. Use the care tones (water/sun/thriving/wilt) for plant signals. */
type Tone =
  | "neutral"
  | "forest"
  | "sprout"
  | "water"
  | "sun"
  | "thriving"
  | "wilt";

const TONES: Record<Tone, string> = {
  neutral: "bg-[var(--bg-sunk)] text-[var(--text-body)]",
  forest: "bg-[var(--forest-100)] text-[var(--forest-700)]",
  sprout: "bg-[var(--sprout-200)] text-[var(--sprout-700)]",
  water: "bg-[var(--water-100)] text-[var(--water-500)]",
  sun: "bg-[var(--sun-100)] text-[#A56B12]",
  thriving: "bg-[var(--thriving-100)] text-[var(--thriving-500)]",
  wilt: "bg-[var(--wilt-100)] text-[var(--wilt-500)]",
};

export interface BadgeProps {
  tone?: Tone;
  dot?: boolean;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function Badge({
  tone = "neutral",
  dot = false,
  icon = null,
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] whitespace-nowrap",
        "font-[family-name:var(--font-text)] text-[12px] font-semibold leading-[1.4] tracking-[-0.01em]",
        icon || dot ? "py-1 pr-[11px] pl-[9px]" : "px-[11px] py-1",
        TONES[tone],
        className,
      )}
    >
      {dot && (
        <span className="h-[7px] w-[7px] rounded-full bg-current" />
      )}
      {icon}
      {children}
    </span>
  );
}
