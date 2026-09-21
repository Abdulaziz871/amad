import { cn } from "@/lib/utils";

export function HighlightWord({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("relative inline-block whitespace-nowrap text-accent", className)}>
      <span className="absolute -inset-x-1.5 -inset-y-0.5 -z-10 rounded-lg bg-accent/10" aria-hidden />
      <span className="relative">{children}</span>
      <svg
        viewBox="0 0 100 12"
        preserveAspectRatio="none"
        className="absolute inset-x-0 -bottom-1.5 h-2.5 w-full text-accent"
        aria-hidden
      >
        <path
          d="M0,6 C4,1 8,1 12,6 C16,11 20,11 24,6 C28,1 32,1 36,6 C40,11 44,11 48,6 C52,1 56,1 60,6 C64,11 68,11 72,6 C76,1 80,1 84,6 C88,11 92,11 96,6 C98,3.5 99,3.5 100,6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export function HighlightText({ text, highlight }: { text: string; highlight?: string }) {
  if (!highlight) return <>{text}</>;
  const index = text.indexOf(highlight);
  if (index === -1) return <>{text}</>;
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
