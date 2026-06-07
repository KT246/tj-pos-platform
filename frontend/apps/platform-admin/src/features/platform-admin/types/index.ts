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
