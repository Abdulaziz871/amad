"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const isOdd = items.length % 2 === 1;

  return (
    <div className={cn("w-full", className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-10">
        {items.map((item, i) => {
          const isActive = activeId === item.id;
          const isHovered = hoveredId === item.id;
          const isLastOdd = isOdd && i === items.length - 1;

          return (
            <div key={item.id} className={cn(isLastOdd && "sm:col-span-2")}>
              <motion.button
                onClick={() => setActiveId(isActive ? null : item.id)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="relative w-full group"
                initial={false}
              >
                <div className="flex items-center gap-6 px-1 py-5">
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                    <motion.div
                      className="absolute inset-0 rounded-full bg-accent"
                      initial={false}
                      animate={{
                        scale: isActive ? 1 : isHovered ? 0.85 : 0,
                        opacity: isActive ? 1 : isHovered ? 0.12 : 0,
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    />
                    <motion.span
                      className="relative z-10 text-sm font-semibold tracking-wide"
                      animate={{ color: isActive ? "#FFFFFF" : "#755750" }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.number}
                    </motion.span>
                  </div>

                  <motion.h3
                    className="text-start text-lg font-bold tracking-tight sm:text-xl"
                    animate={{
                      x: isActive || isHovered ? 4 : 0,
                      color: isActive || isHovered ? "#002134" : "#755750",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  >
                    {item.title}
                  </motion.h3>

                  <div className="ms-auto flex items-center justify-center">
                    <motion.div
                      className="flex h-8 w-8 items-center justify-center"
                      animate={{ rotate: isActive ? 45 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <motion.svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="text-ink"
                        animate={{ opacity: isActive || isHovered ? 1 : 0.4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </motion.svg>
                    </motion.div>
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 h-px bg-ink/10" />
                <motion.div
                  className="absolute inset-x-0 bottom-0 h-px rtl:origin-right ltr:origin-left bg-accent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isActive ? 1 : isHovered ? 0.3 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </motion.button>

              <AnimatePresence mode="wait">
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                      transition: {
                        height: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2, delay: 0.1 },
                      },
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                      transition: {
                        height: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.1 },
                      },
                    }}
                    className="overflow-hidden"
                  >
                    <motion.p
                      className="py-6 ps-16 pe-4 leading-relaxed text-brown sm:pe-12"
                      initial={{ y: -10 }}
                      animate={{ y: 0 }}
                      exit={{ y: -10 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      {item.content}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
