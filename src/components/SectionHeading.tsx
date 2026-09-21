import clsx from "clsx";
import { HighlightText } from "./HighlightWord";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  highlight,
  align = "start",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  highlight?: string;
  align?: "start" | "center";
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <span className="inline-flex items-center rounded-full bg-copper/15 px-4 py-1.5 text-xs font-semibold tracking-wide text-copper">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 text-3xl font-bold leading-tight text-ink sm:text-4xl">
        <HighlightText text={title} highlight={highlight} />
      </h2>
      {subtitle && <p className="mt-4 text-base leading-relaxed text-brown sm:text-lg">{subtitle}</p>}
    </div>
  );
}
