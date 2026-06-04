import type { ReactNode } from "react";

export type ActiveNav =
  | "Home"
  | "POS Types"
  | "Features"
  | "Pricing"
  | "Add-ons"
  | "FAQ/Help"
  | "Contact";

export type PageShellProps = {
  active: ActiveNav;
  children: ReactNode;
};

export type NavItem = {
  label: ActiveNav;
  href: string;
  sectionId: string;
};

export const navItems: NavItem[] = [
  { label: "Home", href: "/#home", sectionId: "home" },
  { label: "POS Types", href: "/#pos-types", sectionId: "pos-types" },
  { label: "Features", href: "/#features", sectionId: "features" },
  { label: "Pricing", href: "/#pricing", sectionId: "pricing" },
  { label: "Add-ons", href: "/#add-ons", sectionId: "add-ons" },
  { label: "FAQ/Help", href: "/#faq-help", sectionId: "faq-help" },
  { label: "Contact", href: "/#contact", sectionId: "contact" }
];
