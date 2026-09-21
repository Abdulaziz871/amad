"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useMotionValueEvent, useScroll, motion } from "motion/react";

export interface ScrollRevealItem {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradientClass: string;
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
        <div className="relative flex w-full">
          <div className="sticky top-24 flex h-[calc(100vh-6rem)] w-full flex-col items-start justify-center">
            <div className="grid h-full w-full items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="flex h-auto w-full flex-col justify-center gap-10">
                {items.map((item, i) => (
                  <PointItem
                    key={item.number}
                    item={item}
                    thresholdStart={i / n}
                    thresholdEnd={(i + 1) / n}
                    scrollProgress={scrollProgress}
                  />
                ))}
              </div>

              <div className="relative hidden h-[70%] w-full items-center justify-center lg:flex">
                {items.map((item, i) => (
                  <div
                    key={item.number}
                    className={cn(
                      "absolute inset-0 flex items-center justify-center overflow-hidden rounded-[2rem] shadow-2xl transition-opacity duration-500",
                      !item.image && item.gradientClass,
                      scrollProgress >= i / n && scrollProgress < (i + 1) / n
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  >
                    {item.image ? (
                      <>
                        <Image src={item.image} alt="" fill unoptimized className="object-cover" />
                        <div
                          className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent"
                          aria-hidden
                        />
                      </>
                    ) : (
                      item.icon
                    )}
                    <span className="absolute bottom-8 start-8 text-7xl font-black text-white/30">
                      {item.number}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ height: `${n * 90}vh` }} />
        </div>
      </div>
    </div>
  );
}

function PointItem({
  item,
  thresholdStart,
  thresholdEnd,
  scrollProgress,
}: {
  item: ScrollRevealItem;
  thresholdStart: number;
  thresholdEnd: number;
  scrollProgress: number;
}) {
  const barHeightPercentage = getBarPercentageHeight(scrollProgress, thresholdStart, thresholdEnd);
  const isActive = barHeightPercentage > 0;

  return (
    <div className={cn("flex w-full flex-col transition-opacity duration-300", isActive ? "opacity-100" : "opacity-40")}>
      <div className="flex items-start gap-4">
        <div className="relative flex w-8 shrink-0 flex-col items-center">
          <div className="absolute top-0 h-full w-[2px] bg-ink/10" />
          <motion.div
            className="absolute top-0 w-[2px] bg-accent"
            style={{ height: `${barHeightPercentage}%` }}
          />
        </div>
        <div className="flex flex-col gap-1.5 pb-10">
          <span className="text-sm font-bold text-copper">{item.number}</span>
          <h3 className="text-xl font-bold text-ink sm:text-2xl">{item.title}</h3>
          <p className="max-w-sm text-sm leading-relaxed text-brown sm:text-base">{item.description}</p>
        </div>
      </div>
    </div>
  );
}

function getBarPercentageHeight(scrollProgress: number, thresholdStart: number, thresholdEnd: number) {
  if (scrollProgress < thresholdStart) return 0;
  if (scrollProgress > thresholdEnd) return 100;
  return ((scrollProgress - thresholdStart) / (thresholdEnd - thresholdStart)) * 100;
}
