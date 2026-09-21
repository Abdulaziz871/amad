import { Reveal } from "./Reveal";
import { HighlightText } from "./HighlightWord";
import { PatternBars, PatternCross } from "./ui/brand-patterns";
import type { SiteContent } from "@/lib/content";

export function AboutSection({ content }: { content: SiteContent }) {
  return (
    <section id="about" className="relative overflow-hidden scroll-mt-24 py-14 sm:py-20">
      <PatternBars
        className="pointer-events-none absolute top-10 start-6 h-12 w-12 rotate-6 text-ink opacity-[0.1] sm:h-16 sm:w-16 sm:start-10"
        aria-hidden
      />
      <PatternCross
        className="pointer-events-none absolute bottom-10 end-6 h-12 w-12 -rotate-6 text-copper opacity-[0.1] sm:h-16 sm:w-16 sm:end-10"
        aria-hidden
      />
      <div className="container-amad relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-ink sm:text-4xl">
            <HighlightText text={content.about.title} highlight={content.brandName} />
          </h2>
          <div className="mt-6 space-y-4">
            {content.about.paragraphs.map((p) => (
              <p key={p} className="text-base leading-relaxed text-brown sm:text-lg">
                {p}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
