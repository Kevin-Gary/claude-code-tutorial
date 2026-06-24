import React from "react";
import { cn } from "@/lib/cn";

/** Round avatar for a plant photo or user. Falls back to initials on a warm tint. */
type Size = "xs" | "sm" | "md" | "lg" | "xl";

const SIZES: Record<Size, number> = { xs: 28, sm: 36, md: 44, lg: 64, xl: 96 };

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: Size;
  ring?: boolean;
  className?: string;
}

export function Avatar({
  src,
  name = "",
  size = "md",
  ring = false,
  className,
}: AvatarProps) {
  const dim = SIZES[size] ?? SIZES.md;
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        "bg-[var(--forest-100)] text-[var(--forest-600)]",
        "font-[family-name:var(--font-display)] font-bold",
        className,
      )}
      style={{
        width: dim,
        height: dim,
        fontSize: dim * 0.38,
        boxShadow: ring
          ? "0 0 0 3px var(--bg-page), 0 0 0 5px var(--sprout-500)"
          : undefined,
      }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
        />
      ) : (
        initials
      )}
    </span>
  );
}
