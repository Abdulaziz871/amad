import Image from "next/image";
import { ArrowUpLeft } from "lucide-react";
import { Reveal } from "./Reveal";
import { PatternCross, PatternFan } from "./ui/brand-patterns";
import type { SiteContent } from "@/lib/content";

// Registering interest happens on the Amad team's Google Form, opened in a new tab.
const INTEREST_FORM_URL = "https://forms.gle/BYQK8FEHqBpXjDGU6";

export function FinalCta({ content, backgroundImage }: { content: SiteContent; backgroundImage?: string | null }) {
  return (
    <section id="interest" className="scroll-mt-20 py-12 sm:py-16">
      <div className="container-amad">
        <Reveal className="relative overflow-hidden rounded-3xl bg-ink px-6 py-14 text-white sm:px-12 sm:py-16">
          {backgroundImage && (
            <>
              <Image src={backgroundImage} alt="" fill unoptimized className="object-cover" />
              <div className="absolute inset-0 bg-ink/85" aria-hidden />
            </>
          )}
          <div className="section-glow section-glow--dark" aria-hidden />
          <PatternFan
            className="pointer-events-none absolute top-6 end-6 h-10 w-10 rotate-6 text-accent opacity-[0.28] sm:h-14 sm:w-14"
            aria-hidden
          />
          <PatternCross
            className="pointer-events-none absolute start-6 top-1/2 h-40 w-40 -translate-y-1/2 text-copper opacity-20 sm:h-56 sm:w-56"
            aria-hidden
          />
          <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.75rem]">{content.finalCta.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">{content.finalCta.subtitle}</p>
            <a
              href={INTEREST_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-copper-light px-8 py-3.5 text-sm font-bold text-ink shadow-[0_10px_30px_-12px_rgba(255,163,139,0.6)] transition-colors hover:bg-[#ff9275] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper-light sm:text-base"
            >
              {content.finalCta.cta}
              <ArrowUpLeft className="h-4 w-4 ltr:-scale-x-100" aria-hidden />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
