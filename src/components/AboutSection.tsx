import { Reveal } from "./Reveal";
import { HighlightText } from "./HighlightWord";
import { HeadingAccent } from "./SectionHeading";
import { PatternCross, PatternFan } from "./ui/brand-patterns";
import { cn } from "@/lib/utils";
import type { SiteContent } from "@/lib/content";

const initiativeTones = ["text-ink", "text-copper", "text-accent-dark"];
const highlightedPhrase = "حماية الملكية الفكرية، تنمية مؤسسي المستقبل، ودعم المشاريع الناشئة";

function renderAboutBody(text: string) {
  const index = text.indexOf(highlightedPhrase);
  if (index === -1) return text;

  const before = text.slice(0, index);
  const after = text.slice(index + highlightedPhrase.length);
  const parts = highlightedPhrase.split(/([,،])/).filter((part) => part !== "");
  let clauseIndex = -1;

  return (
    <>
      {before}
      {parts.map((part, i) => {
        if (part === "," || part === "،") {
          return (
            <span key={i} className="text-brown">
              {part}{" "}
            </span>
          );
        }
        clauseIndex += 1;
        return (
          <span key={i} className={cn("font-bold", initiativeTones[clauseIndex % initiativeTones.length])}>
            {part.trim()}
          </span>
        );
      })}
      {after}
    </>
  );
}

export function AboutSection({ content }: { content: SiteContent }) {
  return (
    <section id="about" className="relative overflow-hidden scroll-mt-24 py-14 sm:py-20">
      <div className="section-glow section-glow--light" aria-hidden />
      <PatternFan
        className="pointer-events-none absolute top-10 start-6 h-9 w-9 rotate-6 text-ink opacity-[0.22] sm:h-14 sm:w-14 sm:start-10"
        aria-hidden
      />
      <PatternCross
        className="pointer-events-none absolute bottom-10 end-6 h-16 w-16 -rotate-12 text-accent opacity-[0.14] sm:h-24 sm:w-24 sm:end-10"
        aria-hidden
      />
      <div className="container-amad relative">
        <Reveal className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]">
            <HighlightText text={content.about.title} highlight={content.brandName} />
          </h2>
          <HeadingAccent align="center" />
          <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-14">
            {content.about.paragraphs[0] && (
              <p className="text-balance text-center text-2xl font-bold leading-snug text-ink sm:text-3xl">
                {content.about.paragraphs[0]}
              </p>
            )}
            {content.about.paragraphs[1] && (
              <p className="text-justify text-base leading-relaxed text-brown sm:text-lg">
                {renderAboutBody(content.about.paragraphs[1])}
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
