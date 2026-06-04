"use client";

import { useI18n } from "../../../lib/i18n";
import type { TrustPill } from "../types";
import { defaultTrustItems } from "../data";

export function TrustPills({
  items = defaultTrustItems
}: {
  items?: readonly TrustPill[];
}) {
  const { t } = useI18n();

  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(([title, body, Icon]) => (
        <div key={title} className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
            <Icon className="h-4 w-4" />
          </span>
          <span>
            <span className="font900 block text-xs text-slate-900">{t(title)}</span>
            <span className="font700 block text-xs text-slate-500">{t(body)}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
