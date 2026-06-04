"use client";

import { IconBox } from "../../../components/ui/icon-box";
import { useI18n } from "../../../lib/i18n";
import type { AddOn } from "../types";

export function AddOnCard({ item }: { item: AddOn }) {
  const { t } = useI18n();

  return (
    <div className="flex h-full min-h-[210px] flex-col items-center rounded-lg border border-blue-100 bg-white p-4 text-center shadow-sm">
      <IconBox Icon={item.Icon} tone={item.tone} />
      <h3 className="mt-3 min-h-9 text-sm leading-5 font-black text-slate-950">
        {t(item.title)}
      </h3>
      <p className="mt-2 min-h-10 text-xs leading-5 text-slate-600">
        {t(item.description)}
      </p>
      <p className="mt-4 text-lg font-black whitespace-nowrap text-slate-950">
        {item.price}
        <span className="font700 text-xs text-slate-500"> /month</span>
      </p>
      <button className="font900 mt-auto h-8 w-full rounded-md border border-blue-300 px-3 text-xs text-blue-600">
        {t("Add")}
      </button>
    </div>
  );
}
