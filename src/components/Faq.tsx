import { Reveal } from "./Reveal";
import { HeadingAccent } from "./SectionHeading";
import { InteractiveAccordion, type AccordionItem } from "./ui/interactive-accordion";
import { PatternFan, PatternCross, PatternBars } from "./ui/brand-patterns";
import type { FaqItem } from "@/lib/content";

export function Faq({ title, items }: { title: string; items: FaqItem[] }) {
  const accordionItems: AccordionItem[] = items.map((item, i) => ({
    id: `faq-${i}`,
    number: String(i + 1).padStart(2, "0"),
    title: item.question,
    content: item.answer,
  }));

  return (
    <section id="faq" className="relative overflow-hidden scroll-mt-24 py-12 sm:py-16">
      <div className="section-glow section-glow--light" aria-hidden />
      <PatternFan
        className="pointer-events-none absolute top-2 end-6 h-9 w-9 rotate-3 text-copper opacity-[0.2] sm:h-14 sm:w-14 sm:end-10"
        aria-hidden
      />
      <PatternBars
        className="pointer-events-none absolute top-6 end-[12%] h-32 w-32 -rotate-6 text-accent opacity-[0.05] sm:h-48 sm:w-48"
        aria-hidden
      />
      <div className="container-amad relative">
        <Reveal>
          <h2 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl lg:text-6xl">{title}</h2>
          <HeadingAccent />
        </Reveal>
        <Reveal delay={0.1} className="mx-auto mt-8 max-w-5xl rounded-3xl border border-ink/8 bg-white px-6 sm:px-8">
          <InteractiveAccordion items={accordionItems} />
        </Reveal>
      </div>
      <PatternCross
        className="pointer-events-none absolute bottom-6 start-6 h-12 w-12 -rotate-6 text-ink opacity-[0.14] sm:h-20 sm:w-20"
        aria-hidden
      />
    </section>
  );
}
