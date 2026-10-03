"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 5000;
const SWIPE_PX = 60;

type Labels = { previous: string; next: string; close: string; expand: string };

// One large photo with a thumbnail strip: autoplays until the visitor interacts, supports swipe and a fullscreen view.
export function GraduatesShowcase({ images, labels }: { images: string[]; labels: Labels }) {
  const [index, setIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [paused, setPaused] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const count = images.length;
  const playing = autoplay && !paused && !fullscreen && !reduceMotion;

  const go = useCallback(
    (delta: number) => {
      setAutoplay(false);
      setIndex((current) => (current + delta + count) % count);
    },
    [count]
  );

  useEffect(() => {
    if (!playing || count < 2) return;
    const id = window.setTimeout(() => setIndex((current) => (current + 1) % count), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [playing, index, count]);

  // Keep the active thumbnail centred in the strip. Relative offsets work in both LTR and RTL,
  // unlike absolute scrollLeft values, and scrolling the strip never moves the page itself.
  useEffect(() => {
    const strip = stripRef.current;
    const thumb = strip?.children[index] as HTMLElement | undefined;
    if (!strip || !thumb) return;
    const stripRect = strip.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();
    const delta = thumbRect.left + thumbRect.width / 2 - (stripRect.left + stripRect.width / 2);
    strip.scrollBy({ left: delta, behavior: "smooth" });
  }, [index]);

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
      if (e.key === "ArrowLeft") go(document.dir === "rtl" ? 1 : -1);
      if (e.key === "ArrowRight") go(document.dir === "rtl" ? -1 : 1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [fullscreen, go]);

  if (count === 0) return null;
  const current = images[index];

  return (
    <div className="relative mx-auto max-w-5xl" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-ink shadow-[0_30px_70px_-35px_rgba(12,35,65,0.6)] sm:aspect-[16/9]">
        <AnimatePresence initial={false}>
          <motion.div
            key={current}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              const rtl = document.dir === "rtl";
              if (info.offset.x < -SWIPE_PX) go(rtl ? -1 : 1);
              else if (info.offset.x > SWIPE_PX) go(rtl ? 1 : -1);
            }}
          >
            <Image src={current} alt="" fill unoptimized draggable={false} className="pointer-events-none object-cover" />
          </motion.div>
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/70 via-transparent to-ink/10" aria-hidden />

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-4 sm:p-6">
          <span className="font-display text-sm font-bold text-white tabular-nums" dir="ltr">
            {String(index + 1).padStart(2, "0")}
            <span className="text-white/50"> / {String(count).padStart(2, "0")}</span>
          </span>
          <div className="flex items-center gap-2">
            <NavButton label={labels.previous} onClick={() => go(-1)}>
              <ChevronRight className="h-5 w-5 ltr:rotate-180" aria-hidden />
            </NavButton>
            <NavButton label={labels.next} onClick={() => go(1)}>
              <ChevronLeft className="h-5 w-5 ltr:rotate-180" aria-hidden />
            </NavButton>
            <NavButton label={labels.expand} onClick={() => setFullscreen(true)}>
              <Expand className="h-4 w-4" aria-hidden />
            </NavButton>
          </div>
        </div>

        {playing && (
          <motion.span
            key={`progress-${index}`}
            className="absolute inset-x-0 top-0 h-1 origin-left bg-copper rtl:origin-right"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
            aria-hidden
          />
        )}
      </div>

      <div ref={stripRef} className="thumb-strip no-scrollbar mt-3 flex gap-2 overflow-x-auto px-1 py-1.5 sm:mt-4 sm:gap-2.5">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => {
              setAutoplay(false);
              setIndex(i);
            }}
            aria-label={`${i + 1} / ${count}`}
            aria-current={i === index}
            className={cn(
              "relative h-12 w-[4.5rem] shrink-0 overflow-hidden rounded-lg outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-copper sm:h-16 sm:w-24 sm:rounded-xl",
              i === index ? "opacity-100 ring-2 ring-copper ring-offset-1 ring-offset-cream sm:ring-offset-2" : "opacity-45 hover:opacity-80"
            )}
          >
            <Image src={src} alt="" fill unoptimized className="object-cover" />
          </button>
        ))}
      </div>

      {/* Portalled to <body> so the transformed section wrappers cannot break position: fixed. */}
      {fullscreen &&
        createPortal(
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm sm:p-10"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setFullscreen(false)}
          >
            <div className="relative h-full w-full" onClick={(e) => e.stopPropagation()}>
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={current}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <Image src={current} alt="" fill unoptimized className="object-contain" />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="absolute top-4 end-4 flex gap-2 sm:top-6 sm:end-6">
              <NavButton label={labels.close} onClick={() => setFullscreen(false)}>
                <X className="h-5 w-5" aria-hidden />
              </NavButton>
            </div>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-3 sm:bottom-6">
              <NavButton label={labels.previous} onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}>
                <ChevronRight className="h-5 w-5 ltr:rotate-180" aria-hidden />
              </NavButton>
              <span className="font-display text-sm font-bold text-white tabular-nums" dir="ltr">
                {index + 1} / {count}
              </span>
              <NavButton label={labels.next} onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}>
                <ChevronLeft className="h-5 w-5 ltr:rotate-180" aria-hidden />
              </NavButton>
            </div>
          </motion.div>,
          document.body
        )}
    </div>
  );
}

function NavButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-white hover:text-ink focus-visible:ring-2 focus-visible:ring-copper focus-visible:outline-none"
    >
      {children}
    </button>
  );
}
