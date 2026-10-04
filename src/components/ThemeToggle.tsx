"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export type Theme = "light" | "dark";
export const THEME_STORAGE_KEY = "amad-theme";

// Runs before first paint (inlined in the layout) so the saved / system theme applies without a flash.
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="light"}})();`;

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const readTheme = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

export function ThemeToggle({ labels, className }: { labels: { light: string; dark: string }; className?: string }) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "light" as Theme);
  const next: Theme = theme === "dark" ? "light" : "dark";

  function toggle() {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage can be unavailable (private mode); the choice still applies for this visit.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={next === "dark" ? labels.dark : labels.light}
      title={next === "dark" ? labels.dark : labels.light}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/15 text-white/85 transition-colors hover:border-white/30 hover:text-white",
        className
      )}
    >
      <Sun
        className={cn(
          "absolute h-[1.1rem] w-[1.1rem] transition-all duration-500",
          theme === "dark" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
        )}
        aria-hidden
      />
      <Moon
        className={cn(
          "absolute h-[1.1rem] w-[1.1rem] transition-all duration-500",
          theme === "dark" ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        )}
        aria-hidden
      />
    </button>
  );
}
