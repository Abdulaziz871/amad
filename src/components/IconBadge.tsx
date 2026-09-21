import type { LucideIcon } from "lucide-react";
import clsx from "clsx";

export type IconTone = "accent" | "copper" | "ink" | "accent-dark";

const toneStyles: Record<IconTone, string> = {
  accent: "bg-accent/12 text-accent",
  copper: "bg-copper/15 text-copper",
  ink: "bg-ink/10 text-ink",
  "accent-dark": "bg-accent-dark/12 text-accent-dark",
};

const tones: IconTone[] = ["accent", "copper", "ink", "accent-dark"];

export function toneForIndex(i: number): IconTone {
  return tones[i % tones.length];
}

export function IconBadge({
  icon: Icon,
  tone = "accent",
  size = "md",
  className,
}: {
  icon: LucideIcon;
  tone?: IconTone;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeStyles = {
    sm: "h-9 w-9 [&_svg]:h-4 [&_svg]:w-4",
    md: "h-12 w-12 rounded-2xl [&_svg]:h-6 [&_svg]:w-6",
    lg: "h-14 w-14 rounded-2xl [&_svg]:h-7 [&_svg]:w-7",
  };

  return (
    <span
      className={clsx(
        "flex shrink-0 items-center justify-center rounded-xl",
        sizeStyles[size],
        toneStyles[tone],
        className
      )}
    >
      <Icon aria-hidden />
    </span>
  );
}
