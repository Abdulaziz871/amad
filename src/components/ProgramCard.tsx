import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check, Lock } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { ProgramSummary } from "@/lib/content";
import { programIcons } from "@/lib/program-icons";
import { toneForSlug } from "./IconBadge";
import { cn } from "@/lib/utils";

const toneChip: Record<string, string> = {
  ink: "bg-white/15 text-white",
  copper: "bg-copper text-white",
  accent: "bg-accent text-white",
};

const toneButton: Record<string, string> = {
  ink: "bg-white text-ink",
  copper: "bg-copper text-white",
  accent: "bg-accent text-white",
};

const toneFallback: Record<string, string> = {
  ink: "from-ink to-[#16325a]",
  copper: "from-copper to-[#ffa38b]",
  accent: "from-accent to-accent-dark",
};

// Details are always shown on touch devices, revealed on hover/focus elsewhere.
const reveal =
  "[@media(hover:hover)]:grid-rows-[0fr] [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:grid-rows-[1fr] [@media(hover:hover)]:group-hover:opacity-100 group-focus-visible:grid-rows-[1fr] group-focus-visible:opacity-100";

export function ProgramCard({
  program,
  locale,
  learnMore,
  image,
  statusLabel,
}: {
  program: ProgramSummary;
  locale: Locale;
  learnMore: string;
  image?: string | null;
  /** Shown as a locked badge, for programs that only admit qualified teams. */
  statusLabel?: string;
}) {
  const Icon = programIcons[program.slug];
  const href = `/${locale}/programs/${program.slug}`;
  const tone = toneForSlug(program.slug);

  return (
    <Link
      href={href}
      className="group relative isolate flex h-[30rem] flex-col justify-end overflow-hidden rounded-3xl shadow-[0_24px_60px_-30px_rgba(12,35,65,0.45)] outline-none sm:h-[34rem]"
    >
      {image ? (
        <Image
          src={image}
          alt=""
          fill
          unoptimized
          className="-z-20 object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
      ) : (
        <div className={cn("absolute inset-0 -z-20 bg-linear-to-br", toneFallback[tone])} aria-hidden />
      )}

      <div
        className="absolute inset-0 -z-10 bg-linear-to-t from-ink via-ink/55 to-transparent transition-opacity duration-500"
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/55"
        aria-hidden
      />

      <span
        className={cn(
          "absolute top-5 start-5 flex h-11 w-11 items-center justify-center rounded-2xl backdrop-blur-md transition-all duration-500 [@media(hover:hover)]:group-hover:-translate-y-2 [@media(hover:hover)]:group-hover:opacity-0 [&_svg]:h-5 [&_svg]:w-5",
          toneChip[tone]
        )}
      >
        <Icon aria-hidden />
      </span>

      {statusLabel && (
        <span
          className={cn(
            "absolute top-5 end-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold backdrop-blur-md",
            program.access === "open" ? "bg-white/90 text-ink" : "border border-white/25 bg-ink/50 text-white"
          )}
        >
          {program.access === "open" ? (
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
          ) : (
            <Lock className="h-3.5 w-3.5" aria-hidden />
          )}
          {statusLabel}
        </span>
      )}

      <div className="p-6 text-white sm:p-7">
        <h3 className="text-2xl font-bold leading-snug transition-transform duration-500 ease-out group-hover:-translate-y-1 sm:text-[1.7rem]">
          {program.title}
        </h3>
        {locale !== "ar" && (
          <p className="mt-0.5 text-xs font-medium text-white/60 rtl:text-right ltr:text-left" dir="ltr">
            {program.englishName}
          </p>
        )}

        <div className={cn("grid grid-rows-[1fr] opacity-100 transition-all duration-500 ease-out", reveal)}>
          <div className="overflow-hidden">
            <p className="mt-3 text-sm leading-relaxed text-white/80">{program.description}</p>

            <ul className="mt-4 space-y-1.5">
              {program.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-xs leading-relaxed text-white/85">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
                  {feature}
                </li>
              ))}
            </ul>

            <span
              className={cn(
                "mt-5 inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-all group-hover:gap-2.5",
                toneButton[tone]
              )}
            >
              {learnMore}
              <ArrowLeft className="h-4 w-4 ltr:rotate-180" aria-hidden />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
