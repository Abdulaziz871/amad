import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { InteractiveAccordion, type AccordionItem } from "./ui/interactive-accordion";
import { PatternCross, PatternFan } from "./ui/brand-patterns";
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
      <PatternCross
        className="pointer-events-none absolute bottom-6 start-6 h-12 w-12 -rotate-6 text-ink opacity-[0.14] sm:h-20 sm:w-20"
        aria-hidden
      />
      <PatternFan
        className="pointer-events-none absolute top-2 end-6 h-9 w-9 rotate-3 text-copper opacity-[0.2] sm:h-14 sm:w-14 sm:end-10"
        aria-hidden
      />
      <div className="container-amad relative">
        <Reveal>
          <SectionHeading title={title} align="center" className="mx-auto" />
        </Reveal>
        <Reveal delay={0.1} className="mx-auto mt-10 max-w-3xl">
          <InteractiveAccordion items={accordionItems} defaultOpenId={accordionItems[0]?.id} />
        </Reveal>
      </div>
    </section>
  );
}
