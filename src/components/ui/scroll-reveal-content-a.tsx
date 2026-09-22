"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMotionValueEvent, useScroll, motion } from "motion/react";

export interface ScrollRevealTone {
  text: string;
  ghost: string;
  frameGhost: string;
  badge: string;
}

export interface ScrollRevealItem {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradientClass: string;
  tone: ScrollRevealTone;
  image?: string | null;
}

interface Props extends Omit<React.ComponentProps<"div">, "children"> {
  items: ScrollRevealItem[];
}

export function ScrollRevealContentA({ items, className, ...props }: Props) {
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: trackRef });
  useMotionValueEvent(scrollYProgress, "change", (v) => setScrollProgress(v));

  const n = items.length;

  return (
    <div className={cn("bg-white", className)} ref={trackRef} {...props}>
      <div className="container-amad">
        <div className="relative flex flex-col w-full">
          <div className="sticky top-24 flex min-h-[calc(100vh-6rem)] w-full flex-col items-start justify-center py-6">
            <div className="mb-6 flex w-full gap-1.5 shrink-0" aria-hidden>
              {items.map((item, i) => (
                <div key={item.number} className="h-1 flex-1 overflow-hidden rounded-full bg-ink/10">
                  <motion.div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${getBarPercentageHeight(scrollProgress, i / n, (i + 1) / n)}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="relative min-h-[220px] w-full">
                {items.map((item, i) => (
                  <PointItem
                    key={item.number}
                    item={item}
                    isActive={scrollProgress >= i / n && scrollProgress < (i + 1) / n}
                  />
                ))}
              </div>

              <div className="relative hidden h-[min(55vh,22rem)] w-full items-center justify-center lg:flex">
                {items.map((item, i) => {
                  const active = scrollProgress >= i / n && scrollProgress < (i + 1) / n;
                  return (
                    <div
                      key={item.number}
                      className={cn(
                        "absolute inset-0 transition-opacity duration-500",
                        active ? "opacity-100" : "opacity-0"
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "pointer-events-none absolute top-1/2 -end-16 z-0 -translate-y-1/2 select-none text-[13rem] font-black leading-none",
                          item.tone.frameGhost
                        )}
                      >
                        {item.number}
                      </span>
                      <div className="relative z-10 flex h-full w-full items-center justify-center overflow-hidden rounded-[2rem] shadow-2xl">
                        <div className={cn("absolute inset-0", !item.image && item.gradientClass)}>
                          {item.image ? (
                            <>
                              <Image src={item.image} alt="" fill unoptimized className="object-cover" />
                              <div
                                className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent"
                                aria-hidden
                              />
                            </>
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">{item.icon}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div style={{ height: `${n * 90}vh` }} />
        </div>
      </div>
    </div>
  );
}

function PointItem({ item, isActive }: { item: ScrollRevealItem; isActive: boolean }) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex w-full flex-col justify-center transition-opacity duration-500",
        isActive ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute -top-10 -start-3 select-none text-[8rem] font-black leading-none sm:-top-14 sm:text-[10rem]",
          item.tone.ghost
        )}
      >
        {item.number}
      </span>
      <div className="relative flex flex-col gap-3">
        <span
          className={cn(
            "inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-extrabold",
            item.tone.badge
          )}
        >
          <Calendar className="h-4 w-4" aria-hidden />
          {item.description}
        </span>
        <h3 className="text-2xl font-bold leading-snug text-ink sm:text-3xl">{item.title}</h3>
      </div>
    </div>
  );
}

function getBarPercentageHeight(scrollProgress: number, thresholdStart: number, thresholdEnd: number) {
  if (scrollProgress < thresholdStart) return 0;
  if (scrollProgress > thresholdEnd) return 100;
  return ((scrollProgress - thresholdStart) / (thresholdEnd - thresholdStart)) * 100;
}
