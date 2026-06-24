import {
  ArrowRight,
  Bell,
  CalendarHeart,
  Check,
  Droplet,
  ScanLine,
  Smartphone,
  Sparkles,
  Star,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

/**
 * Verdant's icon — a thin, typed wrapper over Lucide (the system's icon set:
 * rounded line caps, 2px stroke, `currentColor`). Register an icon here before
 * using it; the union `IconName` keeps usage honest at compile time.
 */
const registry = {
  sparkles: Sparkles,
  smartphone: Smartphone,
  "arrow-right": ArrowRight,
  star: Star,
  droplet: Droplet,
  "scan-line": ScanLine,
  "calendar-heart": CalendarHeart,
  bell: Bell,
  stethoscope: Stethoscope,
  check: Check,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof registry;

export interface IconProps {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
}

export function Icon({
  name,
  size = 22,
  strokeWidth = 2,
  color = "currentColor",
  className,
}: IconProps) {
  const Glyph = registry[name];
  return (
    <Glyph size={size} strokeWidth={strokeWidth} color={color} className={className} />
  );
}
