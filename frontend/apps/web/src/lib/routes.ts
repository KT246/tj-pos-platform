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

export const navItems: { label: ActiveNav; href: string; hasMenu?: boolean }[] = [
  { label: "Home", href: "/" },
  { label: "POS Types", href: "/pos-types", hasMenu: true },
  { label: "Features", href: "/features", hasMenu: true },
  { label: "Pricing", href: "/pricing" },
  { label: "Add-ons", href: "/add-ons" },
  { label: "FAQ/Help", href: "/faq-help" },
  { label: "Contact", href: "/contact" }
];
