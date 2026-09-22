"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [stage, setStage] = useState<"spin" | "reveal" | "fade">("spin");

  useEffect(() => {
    const t1 = setTimeout(() => setStage("reveal"), 900);
    const t2 = setTimeout(() => setStage("fade"), 1750);
    const t3 = setTimeout(() => setVisible(false), 2250);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[999] flex items-center justify-center bg-ink transition-opacity duration-500 ${
        stage === "fade" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative flex h-16 w-40 items-center justify-center">
        <div
          className={`absolute h-16 w-16 transition-opacity duration-300 ${
            stage === "spin" ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="h-full w-full animate-spin [animation-duration:1.1s]">
            <Image src="/logos/amad-tile-white-mid.png" alt="" fill unoptimized className="object-contain" priority />
          </div>
        </div>

        <div
          className={`absolute transition-all duration-500 ${
            stage === "spin" ? "scale-90 opacity-0" : "scale-100 opacity-100"
          }`}
        >
          <Image
            src="/logos/amad-lockup-white-padded.png"
            alt=""
            width={2643}
            height={1415}
            unoptimized
            className="h-10 w-auto sm:h-12"
            priority
          />
        </div>
      </div>
    </div>
  );
}
