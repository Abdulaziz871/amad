import { cn } from "@/lib/utils";
import type { TextHighlight } from "@/lib/content";

const toneClass: Record<TextHighlight["tone"], string> = {
  ink: "text-ink",
  copper: "text-copper",
  accent: "text-accent-dark",
};

// Renders text with the listed phrases coloured (bold, in their brand tone). A conjunction "و" written
// directly before a phrase (e.g. "ورواد امد") takes the phrase's colour too.
export function TonedText({ text, highlights }: { text: string; highlights?: TextHighlight[] }) {
  const present = (highlights ?? []).filter((h) => text.includes(h.text));
  if (present.length === 0) return <>{text}</>;

  // Longest first so overlapping phrases match the fuller one.
  const escaped = [...present]
    .sort((a, b) => b.text.length - a.text.length)
    .map((h) => h.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const parts = text.split(new RegExp(`((?<=^|\\s)و?(?:${escaped.join("|")}))`));

  return (
    <>
      {parts.map((part, i) => {
        const match = present.find((h) => h.text === part || `و${h.text}` === part);
        if (!match) return part;
        return (
          <span key={i} className={cn("font-bold", toneClass[match.tone])}>
            {part}
          </span>
        );
      })}
    </>
  );
}
