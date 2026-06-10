import type { LucideIcon } from "lucide-react";

export type AdminStatus =
  | "active"
  | "trial"
  | "suspended"
  | "pending"
  | "new"
  | "inProgress"
  | "closed"
  | "resolved"
  | "inactive";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  match: string[];
  allowedRoles?: string[];
};

export type AdminNavGroup = {
  label: string;
  items: AdminNavItem[];
};

export type StatCard = {
  label: string;
  value: string;
  change: string;
  tone: "blue" | "green" | "purple" | "orange" | "red";
  icon: LucideIcon;
};

export type Business = {
  id: string;
  name: string;
  location: string;
  type: string;
  owner: string;
  ownerEmail: string;
  logoUrl: string;
  ownerAvatarUrl: string;
  branches: number;
  plan: string;
  status: AdminStatus;
  lastActivity: string;
  joinedOn: string;
};

export type SimpleRecord = {
  id: string;
  title: string;
  subtitle: string;
  status: AdminStatus;
  meta: string;
};

export type Plan = {
  id: string;
  name: string;
  price: string;
  businesses: number;
  modules: string;
  color: "blue" | "green" | "purple" | "orange" | "red";
  limitBranches: number | string;
  limitDevices: number | string;
  limitStaffs: number | string;
  description?: string;
  features?: string;
  isPopular?: boolean;
};

