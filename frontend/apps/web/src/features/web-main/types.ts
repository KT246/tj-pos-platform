import type { LucideIcon } from "lucide-react";

export type IconTone =
  | "blue"
  | "teal"
  | "green"
  | "orange"
  | "purple"
  | "pink"
  | "cyan";

export type IconCard = {
  title: string;
  description: string;
  Icon: LucideIcon;
  tone: IconTone;
};

export type TrustPill = readonly [string, string, LucideIcon];

export type PosType = {
  title: string;
  shortTitle: string;
  description: string;
  bullets: string[];
  Icon: LucideIcon;
  tone: IconTone;
  visual: string;
};

export type AddOn = {
  title: string;
  description: string;
  price: string;
  Icon: LucideIcon;
  tone: IconTone;
};

export type PricingPlan = {
  name: string;
  subtitle: string;
  price: string;
  Icon: LucideIcon;
  features: string[];
  cta: string;
  featured: boolean;
};

export type HomePricingPlan = {
  name: string;
  subtitle: string;
  price: string;
  period?: string;
  features: string[];
  cta: string;
  featured?: boolean;
  badge?: string;
};

export type HomeAddOn = {
  title: string;
  description: string;
  price?: string;
  cta: string;
  Icon: LucideIcon;
  tone: IconTone;
  variant?: "default" | "view-all";
};

export type FaqGroup = {
  title: string;
  Icon: LucideIcon;
  tone: IconTone;
  questions: string[];
};
