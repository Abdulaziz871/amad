"use client";

import { useId, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  id: string;
  number: string;
  title: string;
  content: string;
}

export function InteractiveAccordion({
  items,
  defaultOpenId,
  className,
}: {
  items: AccordionItem[];
  defaultOpenId?: string | null;
  className?: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(defaultOpenId ?? null);
  const baseId = useId();

  return (
    <ul className={cn("flex w-full flex-col gap-3", className)}>
      {items.map((item) => {
        const isActive = activeId === item.id;
        const buttonId = `${baseId}-${item.id}-button`;
        const panelId = `${baseId}-${item.id}-panel`;

        return (
          <li
            key={item.id}
            className={cn(
              "overflow-hidden rounded-2xl border bg-white transition-all duration-300",
              isActive
                ? "border-copper/30 shadow-[0_18px_40px_-28px_rgba(198,110,78,0.45)]"
                : "border-ink/[0.07] hover:border-ink/15 hover:shadow-[0_12px_30px_-26px_rgba(12,35,65,0.35)]"
            )}
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isActive}
                aria-controls={panelId}
                onClick={() => setActiveId(isActive ? null : item.id)}
                className="group flex w-full items-center gap-4 px-5 py-4 text-start focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-copper sm:gap-5 sm:px-7 sm:py-5"
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-colors duration-300",
                    isActive ? "bg-copper text-white" : "bg-ink/[0.05] text-ink/50 group-hover:bg-ink/[0.08]"
                  )}
                  dir="ltr"
                >
                  {item.number}
                </span>
                <span
                  className={cn(
                    "flex-1 text-base font-bold leading-snug transition-colors duration-300 sm:text-lg",
                    isActive ? "text-ink" : "text-ink/80 group-hover:text-ink"
                  )}
                >
                  {item.title}
                </span>
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                    isActive
                      ? "rotate-45 border-copper bg-copper text-white"
                      : "border-ink/15 text-ink/60 group-hover:border-ink/30"
                  )}
                  aria-hidden
                >
                  <Plus className="h-4 w-4" />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isActive && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
                  className="overflow-hidden"
                >
                  <p className="border-t border-ink/[0.06] px-5 pb-5 pt-4 text-sm leading-relaxed text-brown sm:ps-[4.75rem] sm:pe-16 sm:text-base">
                    {item.content}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
