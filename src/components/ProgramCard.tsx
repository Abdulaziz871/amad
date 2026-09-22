import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { ProgramSummary } from "@/lib/content";
import { programIcons } from "@/lib/program-icons";
import { IconBadge, toneForSlug } from "./IconBadge";
import { cn } from "@/lib/utils";

const toneBorder: Record<string, string> = {
  ink: "hover:border-ink",
  copper: "hover:border-copper",
  accent: "hover:border-accent",
};

const toneText: Record<string, string> = {
  ink: "text-ink",
  copper: "text-copper",
  accent: "text-accent",
};

const toneTextHover: Record<string, string> = {
  ink: "group-hover:text-ink",
  copper: "group-hover:text-copper",
  accent: "group-hover:text-accent",
};

export function ProgramCard({
  program,
  locale,
  learnMore,
  image,
}: {
  program: ProgramSummary;
  locale: Locale;
  learnMore: string;
  image?: string | null;
}) {
  const Icon = programIcons[program.slug];
  const href = `/${locale}/programs/${program.slug}`;
  const tone = toneForSlug(program.slug);

  return (
    <Link
      href={href}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-3xl border-2 border-ink/8 bg-white transition-all duration-300 hover:-translate-y-1.5",
        toneBorder[tone]
      )}
    >
      {image && (
        <div className="relative h-44 w-full overflow-hidden">
          <Image
            src={image}
            alt=""
            fill
            unoptimized
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />

        </div>
      )}

      <div className="flex flex-1 flex-col p-7">
        {!image && <IconBadge icon={Icon} tone={tone} />}

        <h3
          className={cn(
            "text-xl font-bold leading-snug text-ink transition-colors",
            toneTextHover[tone],
            image ? "" : "mt-5"
          )}
        >
          {program.title}
        </h3>
        {locale !== "ar" && (
          <p className="mt-0.5 text-xs font-medium text-brown/70 rtl:text-right ltr:text-left" dir="ltr">
            {program.englishName}
          </p>
        )}
        <p className="mt-3 text-sm leading-relaxed text-brown">{program.description}</p>

        <ul className="mt-5 space-y-2 rounded-2xl bg-cream p-4">
          {program.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-xs leading-relaxed text-ink/80">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
              {feature}
            </li>
          ))}
        </ul>

        <span
          className={cn(
            "mt-6 inline-flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-2.5",
            toneText[tone]
          )}
        >
          {learnMore}
          <ArrowLeft className="h-4 w-4 ltr:rotate-180" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
