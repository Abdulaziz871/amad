import type { Locale } from "@/i18n/config";
import type { SiteContent } from "./types";
import { ar } from "./ar";
import { en } from "./en";

const dictionaries: Record<Locale, SiteContent> = { ar, en };

export function getContent(locale: Locale): SiteContent {
  return dictionaries[locale];
}

export type {
  SiteContent,
  ProgramDetail,
  ProgramSummary,
  ProgramSlug,
  Stat,
  FormField,
  FaqItem,
  JourneyMilestone,
  WhyAmadCard,
} from "./types";
