import Link from "next/link";
import clsx from "clsx";
import type { Route } from "next";

type Variant = "primary" | "secondary" | "ghost";

interface BaseProps {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-dark shadow-[0_10px_30px_-10px_rgba(131,127,216,0.6)]",
  secondary:
    "bg-transparent text-ink border border-ink/20 hover:border-ink/40 hover:bg-ink/5",
  ghost: "bg-white text-ink hover:bg-cream border border-ink/10",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
}: BaseProps & { href: Route | string }) {
  return (
    <Link href={href as Route} className={clsx(base, variantStyles[variant], className)}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={clsx(base, variantStyles[variant], className)} {...props}>
      {children}
    </button>
  );
}
