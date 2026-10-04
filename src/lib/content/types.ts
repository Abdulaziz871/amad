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
  /** "open" programs accept direct applications; "qualified" ones only admit teams promoted from another program. */
  access: "open" | "qualified";
  /** For "qualified" programs: the programs whose qualifying teams move on to this one. */
  qualifiesFrom?: ProgramSlug[];
  title: string;
  englishName: string;
  description: string;
  features: string[];
  cta: string;
}

export type BenefitIcon = "asset" | "market" | "route" | "network";

export interface BenefitCard {
  icon: BenefitIcon;
  title: string;
  description: string;
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
    /** When set, benefits render as icon cards instead of the plain `items` checklist. */
    cards?: BenefitCard[];
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
  faq?: FaqItem[];
  form: {
    title: string;
    subtitle: string;
    extraFields: FormField[];
    embedUrl?: string;
  };
  cta: string;
  /** Where the hero button scrolls to; defaults to the application form. */
  ctaTarget?: "apply" | "criteria";
  /** Set to false for programs that don't take public applications. */
  showApplicationForm?: boolean;
}

export interface JourneyMilestone {
  title: string;
  timing: string;
}

export interface WhyAmadCard {
  title: string;
  description: string;
}

export interface AlfiaFormUi {
  step: string;
  next: string;
  back: string;
  reviewHint: string;
  member: string;
  selectPlaceholder: string;
  submit: string;
  submitting: string;
  errorFields: string;
  errorGeneric: string;
  chooseAtLeastOne: string;
  closedTitle: string;
  closedBody: string;
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
    /** First entry is the lead statement; the rest are body paragraphs. */
    paragraphs: string[];
    /** Phrases in the body paragraphs to colour, cycling through the brand tones in order. */
    highlights: string[];
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
    subtitle: string;
    statusOpen: string;
    statusQualified: string;
    hint: string;
    standalone: string;
    steps: { apply: string; qualify: string; grow: string };
    comingSoon: { label: string; text: string; cta: string };
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
    viewer: { previous: string; next: string; close: string; expand: string; drag: string };
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
    followUs: string;
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
    qualifiedNote: string;
    submit: string;
    notice: string;
  };
  alfiaForm: AlfiaFormUi;
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

