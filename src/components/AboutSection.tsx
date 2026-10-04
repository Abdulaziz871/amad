import { Reveal } from "./Reveal";
import { HighlightText } from "./HighlightWord";
import { HeadingAccent } from "./SectionHeading";
import { PatternCross, PatternFan } from "./ui/brand-patterns";
import { TonedText } from "./TonedText";
import type { SiteContent, TextHighlight } from "@/lib/content";

const highlightTones: TextHighlight["tone"][] = ["ink", "copper", "accent"];

export function AboutSection({ content }: { content: SiteContent }) {
  return (
    <section id="about" className="relative overflow-hidden scroll-mt-24 py-14 sm:py-20">
      <div className="section-glow section-glow--light" aria-hidden />
      <PatternFan
        className="pointer-events-none absolute top-10 start-6 h-9 w-9 rotate-6 text-fg opacity-[0.22] sm:h-14 sm:w-14 sm:start-10"
        aria-hidden
      />
      <PatternCross
        className="pointer-events-none absolute bottom-10 end-6 h-16 w-16 -rotate-12 text-accent opacity-[0.14] sm:h-24 sm:w-24 sm:end-10"
        aria-hidden
      />
      <div className="container-amad relative">
        <Reveal className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-fg sm:text-4xl lg:text-[2.75rem]">
            <HighlightText text={content.about.title} highlight={content.brandName} />
          </h2>
          <HeadingAccent align="center" />
          <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-14">
            {content.about.paragraphs[0] && (
              <p className="text-balance text-center text-2xl font-bold leading-snug text-fg sm:text-3xl">
                {content.about.paragraphs[0]}
              </p>
            )}
            {content.about.paragraphs.length > 1 && (
              <div className="space-y-4 text-justify text-base leading-relaxed text-brown sm:text-lg">
                {content.about.paragraphs.slice(1).map((paragraph) => (
                  <p key={paragraph}>
                    <TonedText
                      text={paragraph}
                      highlights={content.about.highlights.map((text, i) => ({
                        text,
                        tone: highlightTones[i % highlightTones.length],
                      }))}
                    />
                  </p>
                ))}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
