import clsx from "clsx";
import { HighlightText } from "./HighlightWord";
import { HeadingAccent } from "./HeadingAccent";
import { TonedText } from "./TonedText";
import type { TextHighlight } from "@/lib/content";

export { HeadingAccent };

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  subtitleHighlights,
  highlight,
  align = "start",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  subtitleHighlights?: TextHighlight[];
  highlight?: string;
  align?: "start" | "center";
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full bg-copper/15 px-4 py-1.5 text-xs font-semibold tracking-wide text-copper">
          <span className="h-1.5 w-1.5 rounded-full bg-copper" aria-hidden />
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 text-3xl font-extrabold leading-[1.2] tracking-tight text-fg sm:text-4xl lg:text-[2.75rem]">
        <HighlightText text={title} highlight={highlight} />
      </h2>
      <HeadingAccent align={align} />
      {subtitle && (
        <p className="mt-5 text-base leading-relaxed text-brown sm:text-lg">
          <TonedText text={subtitle} highlights={subtitleHighlights} />
        </p>
      )}
    </div>
  );
}
