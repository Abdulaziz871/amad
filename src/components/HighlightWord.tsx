import { cn } from "@/lib/utils";

export function HighlightWord({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-block whitespace-nowrap text-copper", className)}>
      {children}
    </span>
  );
}

function renderLine(text: string, highlight?: string) {
  if (!highlight) return text;
  const index = text.indexOf(highlight);
  if (index === -1) return text;
  const before = text.slice(0, index);
  const after = text.slice(index + highlight.length);
  return (
    <>
      {before}
      <HighlightWord>{highlight}</HighlightWord>
      {after}
    </>
  );
}

export function HighlightText({ text, highlight }: { text: string; highlight?: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <span key={i} className="block">
          {renderLine(line, highlight)}
        </span>
      ))}
    </>
  );
}
