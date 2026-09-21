import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { SiteContent } from "@/lib/content";
import { IconBadge, toneForIndex } from "./IconBadge";
import { programIcons } from "@/lib/program-icons";
import { PatternCross } from "./ui/brand-patterns";

export function ProgramsQuickLinks({ locale, content }: { locale: Locale; content: SiteContent }) {
  return (
    <div className="relative overflow-hidden border-b border-ink/8 bg-white">
      <PatternCross
        className="pointer-events-none absolute end-8 top-1/2 h-10 w-10 -translate-y-1/2 text-copper opacity-[0.1] sm:h-14 sm:w-14"
        aria-hidden
      />
      <div className="container-amad relative grid gap-4 py-8 sm:grid-cols-3">
        {content.programs.map((program, i) => (
          <Link
            key={program.slug}
            href={`/${locale}/programs/${program.slug}`}
            className="group flex items-center gap-4 rounded-2xl border border-ink/8 p-4 transition-colors hover:border-accent/40 hover:bg-accent/[0.04]"
          >
            <IconBadge icon={programIcons[program.slug]} tone={toneForIndex(i)} size="sm" />
            <span className="flex-1">
              <span className="block text-sm font-bold text-ink">{program.title}</span>
              <span className="block text-xs text-brown" dir="ltr">
                {program.englishName}
              </span>
            </span>
            <ArrowLeft
              className="h-4 w-4 shrink-0 text-ink/30 transition-transform ltr:rotate-180 group-hover:text-accent group-hover:-translate-x-1 ltr:group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
