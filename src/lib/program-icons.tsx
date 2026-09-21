import { ShieldCheck, Rocket, TrendingUp, type LucideIcon } from "lucide-react";
import type { ProgramSlug } from "@/lib/content";

export const programIcons: Record<ProgramSlug, LucideIcon> = {
  ip: ShieldCheck,
  bootcamps: Rocket,
  "venture-clinic": TrendingUp,
};
