import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { ProgramSummary } from "@/lib/content";
import { programIcons } from "@/lib/program-icons";
import { IconBadge, toneForIndex } from "./IconBadge";

export function ProgramCard({
  program,
  index,
  locale,
  learnMore,
}: {
  program: ProgramSummary;
  index: number;
  locale: Locale;
  learnMore: string;
}) {
  const Icon = programIcons[program.slug];
  const href = `/${locale}/programs/${program.slug}`;
  const tone = toneForIndex(index);

  return (
    <div className="group flex h-full flex-col rounded-3xl border border-ink/8 bg-white p-7 shadow-[0_20px_45px_-30px_rgba(0,33,52,0.35)] transition-transform hover:-translate-y-1">
      <IconBadge icon={Icon} tone={tone} />

      <h3 className="mt-5 text-xl font-bold leading-snug text-ink">{program.title}</h3>
      <p className="mt-0.5 text-xs font-medium text-brown/70 rtl:text-right ltr:text-left" dir="ltr">
        {program.englishName}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-brown">{program.description}</p>

      <ul className="mt-5 space-y-2 rounded-2xl bg-cream p-4">
        {program.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-xs leading-relaxed text-ink/80">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href={href}
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent-dark"
      >
        {learnMore}
        <ArrowLeft className="h-4 w-4 ltr:rotate-180" aria-hidden />
      </Link>
    </div>
  );
}
