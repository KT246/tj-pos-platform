"use client";

import { ChevronDown } from "lucide-react";

import { useI18n } from "../../lib/i18n";

export function SelectField({ label, value }: { label: string; value: string }) {
  const { t } = useI18n();

  return (
    <label>
      <span className="font900 text-sm text-slate-800">{t(label)}</span>
      <button className="font800 mt-2 flex h-12 w-full items-center justify-between rounded-md border border-blue-100 px-4 text-left text-sm text-slate-700">
        {t(value)}
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>
    </label>
  );
}
