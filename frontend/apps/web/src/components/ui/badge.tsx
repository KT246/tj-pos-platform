"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";

import { useI18n } from "../../lib/i18n";

export function Badge({
  children,
  Icon = Sparkles
}: {
  children: ReactNode;
  Icon?: LucideIcon;
}) {
  const { t } = useI18n();

  return (
    <span className="font900 inline-flex items-center gap-2 self-start rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm text-blue-600">
      <Icon className="h-4 w-4" />
      {typeof children === "string" ? t(children) : children}
    </span>
  );
}
