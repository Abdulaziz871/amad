export type ProgramSlug = "ip" | "bootcamps" | "venture-clinic";

export interface Stat {
  value: string;
  label: string;
}

export interface FormField {
  name: string;
  label: string;
  type: "text" | "select" | "textarea" | "file";
  placeholder?: string;
  options?: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ProgramSummary {
  slug: ProgramSlug;
  title: string;
  englishName: string;
  description: string;
  features: string[];
  cta: string;
}

export interface JourneyStep {
  title: string;
  description: string;
}

export interface ProgramDetail {
  slug: ProgramSlug;
  englishName: string;
  title: string;
  tagline?: string;
  intro: string;
  audience: string;
  benefits: {
    title: string;
    items: string[];
  };
  criteria?: {
    title: string;
    subtitle?: string;
    items: { title: string; description: string }[];
  };
  journey: {
    title: string;
    steps: JourneyStep[];
  };
  form: {
    title: string;
    subtitle: string;
    extraFields: FormField[];
    embedUrl?: string;
  };
  cta: string;
  /** Where the hero button scrolls to; defaults to the application form. */
  ctaTarget?: "apply" | "criteria";
}

export interface JourneyMilestone {
  title: string;
  timing: string;
}

export interface WhyAmadCard {
  title: string;
  description: string;
}

export interface SiteContent {
  brandName: string;
  meta: {
    title: string;
    description: string;
  };
  nav: {
    home: string;
    about: string;
    programs: string;
    journey: string;
    faq: string;
    gallery: string;
    registerInterest: string;
    langSwitch: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    ctaVideo: string;
    closeVideo: string;
    programsStripLabel: string;
  };
  about: {
    title: string;
    paragraphs: string[];
  };
  whyAmad: {
    eyebrow: string;
    title: string;
    cards: WhyAmadCard[];
    statsTitle: string;
    stats: Stat[];
  };
  programsOverview: {
    learnMore: string;
    pathwayNote: string;
  };
  programs: ProgramSummary[];
  programDetails: Record<ProgramSlug, ProgramDetail>;
  journey: {
    eyebrow: string;
    title: string;
    tagline: string;
    milestones: JourneyMilestone[];
  };
  gallery: {
    title: string;
    videoCaption: string;
  };
  partners: {
    title: string;
    sponsorshipLine: string;
    alinma: { name: string; description: string };
    falak: { name: string; description: string };
  };
  clients: {
    title: string;
  };
  faq: {
    title: string;
    items: FaqItem[];
  };
  footer: {
    quickLinks: string;
    registerInterest: string;
    legal: string;
  };
  finalCta: {
    title: string;
    subtitle: string;
    nameLabel: string;
    emailLabel: string;
    trackLabel: string;
    trackPlaceholder: string;
    submit: string;
    notice: string;
  };
  applicationForm: {
    nameLabel: string;
    emailLabel: string;
    phoneLabel: string;
    agreeLabel: string;
    submit: string;
    successTitle: string;
    successBody: string;
  };
}

