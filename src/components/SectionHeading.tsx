import clsx from "clsx";
import { HighlightText } from "./HighlightWord";
import { HeadingAccent } from "./HeadingAccent";

export { HeadingAccent };

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
      <h2 className="mt-4 text-4xl font-extrabold leading-[1.15] tracking-tight text-ink sm:text-5xl lg:text-6xl">
        <HighlightText text={title} highlight={highlight} />
      </h2>
      <HeadingAccent align={align} />
      {subtitle && <p className="mt-5 text-base leading-relaxed text-brown sm:text-lg">{subtitle}</p>}
    </div>
  );
}
