import { Reveal } from "./Reveal";
import { InteractiveAccordion, type AccordionItem } from "./ui/interactive-accordion";
import { PatternBars, PatternCross } from "./ui/brand-patterns";
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
      <PatternBars
        className="pointer-events-none absolute top-2 end-6 h-12 w-12 rotate-3 text-copper opacity-[0.1] sm:h-16 sm:w-16 sm:end-10"
        aria-hidden
      />
      <div className="container-amad relative">
        <Reveal>
          <h2 className="text-2xl font-bold text-ink sm:text-3xl">{title}</h2>
        </Reveal>
        <Reveal delay={0.1} className="mx-auto mt-8 max-w-3xl rounded-3xl border border-ink/8 bg-white px-6 sm:px-8">
          <InteractiveAccordion items={accordionItems} />
        </Reveal>
      </div>
      <PatternCross
        className="pointer-events-none absolute -bottom-6 start-6 h-16 w-16 -rotate-6 text-ink opacity-[0.06] sm:h-24 sm:w-24"
        aria-hidden
      />
    </section>
  );
}
