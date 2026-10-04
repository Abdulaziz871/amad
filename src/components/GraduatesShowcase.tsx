"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

const SWIPE_PX = 60;

// Endless arc carousel (inspired by griflan.com's "Client Confessions"): a row of framed photos that only
// moves when dragged, wrapping around so it never runs out in either direction. Each card tilts and dips
// by its distance from the centre so the row moves along a curve, and movement speed makes the cards
// swing. A flick glides on and slows to a stop. Click a photo to open it.
const GAP_PX = 24;
const MAX_TILT_DEG = 9;
const MAX_DIP_PX = 70;
const CLICK_SLOP_PX = 6;
const MAX_SWING_DEG = 7;
const FRICTION = 0.05; // fraction of a flick's speed lost per frame until it stops
const MIN_SPEED_PX_PER_S = 2;
const MAX_FLICK_PX_PER_S = 3000;

type Labels = { previous: string; next: string; close: string; expand: string; drag: string };

export function GraduatesShowcase({ images, labels }: { images: string[]; labels: Labels }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [layout, setLayout] = useState({ viewport: 0, card: 0 });
  const [cursorOn, setCursorOn] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const sizerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const dragDistance = useRef(0);
  const speed = useRef(0);
  const offset = useMotionValue(0);
  // Movement speed drives an under-damped spring, so the cards swing like pendulums and settle.
  const velocity = useVelocity(offset);
  const swing = useSpring(
    useTransform(velocity, (v) => Math.max(-MAX_SWING_DEG, Math.min(MAX_SWING_DEG, -v / 140))),
    { stiffness: 90, damping: 7, mass: 0.8 }
  );
  const cursorX = useSpring(0, { stiffness: 500, damping: 40 });
  const cursorY = useSpring(0, { stiffness: 500, damping: 40 });

  useEffect(() => {
    const viewport = viewportRef.current;
    const sizer = sizerRef.current;
    if (!viewport || !sizer) return;
    const measure = () => setLayout({ viewport: viewport.clientWidth, card: sizer.offsetWidth });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  const step = layout.card + GAP_PX;
  // Repeat the photos if needed so the loop is always wider than the screen and never shows a gap.
  const copies = step > GAP_PX ? Math.max(1, Math.ceil((layout.viewport + step * 2) / (step * images.length))) : 1;
  const slots = Array.from({ length: copies }, () => images).flat();
  const loopWidth = step > GAP_PX ? step * slots.length : 0;

  // After a flick, keep gliding with friction until the row comes to rest; no movement on its own.
  useAnimationFrame((_, delta) => {
    if (dragging.current || !loopWidth || speed.current === 0) return;
    speed.current *= 1 - FRICTION;
    if (Math.abs(speed.current) < MIN_SPEED_PX_PER_S) speed.current = 0;
    offset.set(offset.get() + (speed.current * Math.min(delta, 64)) / 1000);
  });

  function moveCursor(e: React.PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    cursorX.set(e.clientX - rect.left);
    cursorY.set(e.clientY - rect.top);
  }

  return (
    <>
      <motion.div
        ref={viewportRef}
        className="relative cursor-grab touch-pan-y select-none pt-8 pb-20 active:cursor-grabbing sm:pt-10 sm:pb-28 [@media(hover:hover)]:cursor-none"
        dir="ltr"
        onPointerMove={moveCursor}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") setCursorOn(true);
        }}
        onPointerLeave={() => setCursorOn(false)}
        onPanStart={() => {
          dragging.current = true;
          dragDistance.current = 0;
        }}
        onPan={(_, info) => {
          offset.set(offset.get() + info.delta.x);
          dragDistance.current = Math.max(dragDistance.current, Math.abs(info.offset.x));
        }}
        onPanEnd={(_, info) => {
          dragging.current = false;
          speed.current = Math.max(-MAX_FLICK_PX_PER_S, Math.min(MAX_FLICK_PX_PER_S, info.velocity.x));
        }}
      >
        {/* Invisible card in normal flow: gives the row its height and lets us measure the card width. */}
        <div ref={sizerRef} className="invisible w-64 sm:w-80 lg:w-[22rem]" aria-hidden>
          <div className="aspect-[4/3] p-1 sm:p-1.5" />
        </div>

        {slots.map((src, i) => (
          <ArcCard
            key={`${src}-${i}`}
            src={src}
            index={i}
            step={step}
            loopWidth={loopWidth}
            viewport={layout.viewport}
            card={layout.card}
            offset={offset}
            swing={swing}
            duplicate={i >= images.length}
            label={`${labels.expand} ${(i % images.length) + 1}`}
            onOpen={() => {
              if (dragDistance.current < CLICK_SLOP_PX) setOpenIndex(i % images.length);
            }}
          />
        ))}

        <motion.span
          className="pointer-events-none absolute z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-copper text-xs font-bold text-white shadow-lg"
          style={{ left: cursorX, top: cursorY }}
          initial={false}
          animate={{ scale: cursorOn ? 1 : 0, opacity: cursorOn ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          aria-hidden
        >
          {labels.drag}
        </motion.span>
      </motion.div>

      {openIndex !== null && (
        <Lightbox images={images} startIndex={openIndex} labels={labels} onClose={() => setOpenIndex(null)} />
      )}
    </>
  );
}

function ArcCard({
  src,
  index,
  step,
  loopWidth,
  viewport,
  card,
  offset,
  swing,
  duplicate,
  label,
  onOpen,
}: {
  src: string;
  index: number;
  step: number;
  loopWidth: number;
  viewport: number;
  card: number;
  offset: MotionValue<number>;
  swing: MotionValue<number>;
  duplicate: boolean;
  label: string;
  onOpen: () => void;
}) {
  // Card's left edge, wrapped into [-step, loopWidth - step) so cards leaving one side re-enter on the other.
  const x = useTransform(offset, (o) => {
    if (!loopWidth) return index * step;
    const raw = index * step + o + step;
    return (((raw % loopWidth) + loopWidth) % loopWidth) - step;
  });
  // Signed distance of the card's centre from the viewport centre, in viewport halves (-1 … 1 on screen).
  const distance = useTransform(x, (left) => (viewport ? (left + card / 2 - viewport / 2) / (viewport / 2) : 0));
  const rotate = useTransform(
    [distance, swing],
    ([d, s]: number[]) => Math.max(-1.6, Math.min(1.6, d)) * MAX_TILT_DEG + s
  );
  const y = useTransform(distance, (d) => Math.min(d * d, 2.5) * MAX_DIP_PX);
  const framed = index % 2 === 0 ? "bg-white" : "bg-copper";

  // Each card floats on its own rhythm so the row never moves in lockstep.
  const floatStyle = {
    "--float-delay": `${-(index * 0.7) % 6}s`,
    "--float-duration": `${5 + (index % 4) * 0.8}s`,
  } as React.CSSProperties;

  return (
    <motion.div
      style={{ x, rotate, y }}
      className="absolute top-8 left-0 w-64 origin-top sm:top-10 sm:w-80 lg:w-[22rem]"
      aria-hidden={duplicate || undefined}
    >
      <div className="card-float" style={floatStyle}>
        <button
          type="button"
          onClick={onOpen}
          aria-label={label}
          tabIndex={duplicate ? -1 : undefined}
          className={cn(
            "group relative block w-full rounded-[1rem] p-1 shadow-[0_24px_50px_-28px_rgba(12,35,65,0.55)] outline-none focus-visible:ring-2 focus-visible:ring-copper sm:p-1.5",
            framed
          )}
        >
          <span className="relative block aspect-[4/3] overflow-hidden rounded-[0.8rem]">
            <Image
              src={src}
              alt=""
              fill
              unoptimized
              draggable={false}
              className="pointer-events-none object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </span>
        </button>
      </div>
    </motion.div>
  );
}

function Lightbox({
  images,
  startIndex,
  labels,
  onClose,
}: {
  images: string[];
  startIndex: number;
  labels: Labels;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const stripRef = useRef<HTMLDivElement>(null);
  const count = images.length;

  const go = useCallback((delta: number) => setIndex((current) => (current + delta + count) % count), [count]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const rtl = document.dir === "rtl";
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") go(rtl ? 1 : -1);
      if (e.key === "ArrowRight") go(rtl ? -1 : 1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [go, onClose]);

  // Keep the active thumbnail centred; relative offsets work in both LTR and RTL.
  useEffect(() => {
    const strip = stripRef.current;
    const thumb = strip?.children[index] as HTMLElement | undefined;
    if (!strip || !thumb) return;
    const stripRect = strip.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();
    strip.scrollBy({
      left: thumbRect.left + thumbRect.width / 2 - (stripRect.left + stripRect.width / 2),
      behavior: "smooth",
    });
  }, [index]);

  // Portalled to <body> so transformed section wrappers cannot break position: fixed.
  return createPortal(
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col bg-ink/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center justify-between p-4 sm:p-6">
        <span className="font-display text-sm font-bold text-white tabular-nums" dir="ltr">
          {String(index + 1).padStart(2, "0")}
          <span className="text-white/50"> / {String(count).padStart(2, "0")}</span>
        </span>
        <LightboxButton label={labels.close} onClick={onClose}>
          <X className="h-5 w-5" aria-hidden />
        </LightboxButton>
      </div>

      <div className="relative min-h-0 flex-1" onClick={onClose}>
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={images[index]}
            className="absolute inset-x-4 inset-y-0 cursor-grab active:cursor-grabbing sm:inset-x-24"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={(e) => e.stopPropagation()}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              const rtl = document.dir === "rtl";
              if (info.offset.x < -SWIPE_PX) go(rtl ? -1 : 1);
              else if (info.offset.x > SWIPE_PX) go(rtl ? 1 : -1);
            }}
          >
            <Image
              src={images[index]}
              alt=""
              fill
              unoptimized
              draggable={false}
              className="pointer-events-none object-contain"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-y-0 start-6 hidden items-center sm:flex">
          <LightboxButton
            label={labels.previous}
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
          >
            <ChevronRight className="h-5 w-5 ltr:rotate-180" aria-hidden />
          </LightboxButton>
        </div>
        <div className="absolute inset-y-0 end-6 hidden items-center sm:flex">
          <LightboxButton
            label={labels.next}
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
          >
            <ChevronLeft className="h-5 w-5 ltr:rotate-180" aria-hidden />
          </LightboxButton>
        </div>
      </div>

      <div ref={stripRef} className="thumb-strip no-scrollbar flex gap-2 overflow-x-auto px-4 py-4 sm:px-6">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`${i + 1} / ${count}`}
            aria-current={i === index}
            className={cn(
              "relative h-12 w-[4.5rem] shrink-0 overflow-hidden rounded-lg outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-copper sm:h-14 sm:w-20",
              i === index ? "opacity-100 ring-2 ring-copper" : "opacity-40 hover:opacity-80"
            )}
          >
            <Image src={src} alt="" fill unoptimized className="object-cover" />
          </button>
        ))}
      </div>
    </motion.div>,
    document.body
  );
}

function LightboxButton({
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
      className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-white hover:text-ink focus-visible:ring-2 focus-visible:ring-copper focus-visible:outline-none"
    >
      {children}
    </button>
  );
}
