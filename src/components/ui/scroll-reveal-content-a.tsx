"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { CityLandmarks } from "@/components/CityLandmarks";
import type { CityPlace } from "@/lib/content";
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
  /** Optional host cities shown as landmark cards under the title. */
  places?: CityPlace[];
}

interface Props extends Omit<React.ComponentProps<"div">, "children"> {
  items: ScrollRevealItem[];
  /** Rendered inside the sticky panel so it stays visible while scrolling through the items. */
  header?: React.ReactNode;
}

export function ScrollRevealContentA({ items, header, className, ...props }: Props) {
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: trackRef });
  useMotionValueEvent(scrollYProgress, "change", (v) => setScrollProgress(v));

  const n = items.length;

  return (
    <div className={cn(className)} ref={trackRef} {...props}>
      <div className="container-amad">
        <div className="relative flex flex-col w-full">
          <div className="sticky top-24 flex w-full flex-col items-start py-4">
            {header && <div className="mb-6 w-full shrink-0">{header}</div>}
            <div className="mb-6 flex w-full gap-1.5 shrink-0" aria-hidden>
              {items.map((item, i) => (
                <div key={item.number} className="h-1 flex-1 overflow-hidden rounded-full bg-fg/10">
                  <motion.div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${getBarPercentageHeight(scrollProgress, i / n, (i + 1) / n)}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="grid w-full items-center gap-6 lg:grid-cols-2 lg:gap-16">
              <div className="relative min-h-[170px] w-full lg:min-h-[300px]">
                {items.map((item, i) => (
                  <PointItem
                    key={item.number}
                    item={item}
                    total={items[n - 1]?.number}
                    isActive={scrollProgress >= i / n && scrollProgress < (i + 1) / n}
                  />
                ))}
              </div>

              <div className="relative flex h-56 w-full items-center justify-center sm:h-72 lg:h-[min(62vh,32rem)]">
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

function PointItem({ item, total, isActive }: { item: ScrollRevealItem; total?: string; isActive: boolean }) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex w-full flex-col justify-center transition-opacity duration-500",
        isActive ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <div className="relative flex flex-col gap-4">
        <div className="flex w-fit items-baseline gap-1.5 font-display tabular-nums" dir="ltr">
          <span className={cn("text-2xl font-bold sm:text-3xl", item.tone.text)}>{item.number}</span>
          {total && <span className="text-base font-medium text-fg/35 sm:text-lg">/ {total}</span>}
        </div>
        <span
          className={cn(
            "inline-flex w-fit items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-extrabold sm:text-base",
            item.tone.badge
          )}
        >
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
          {item.description}
        </span>
        <h3 className="text-2xl font-bold leading-snug text-fg sm:text-3xl lg:text-4xl">{item.title}</h3>
        {item.places && item.places.length > 0 && <CityLandmarks places={item.places} active={isActive} />}
      </div>
    </div>
  );
}

function getBarPercentageHeight(scrollProgress: number, thresholdStart: number, thresholdEnd: number) {
  if (scrollProgress < thresholdStart) return 0;
  if (scrollProgress > thresholdEnd) return 100;
  return ((scrollProgress - thresholdStart) / (thresholdEnd - thresholdStart)) * 100;
}
