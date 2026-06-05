"use client";

import { IconBox } from "../../../components/ui/icon-box";
import { useI18n } from "../../../lib/i18n";
import type { AddOn } from "../types";

export function AddOnCard({ item }: { item: AddOn }) {
  const { t } = useI18n();

  return (
    <div className="group flex h-full min-h-[210px] flex-col items-center rounded-lg border border-blue-100 bg-white p-4 text-center shadow-sm transition-all duration-300 focus-within:border-blue-400 focus-within:shadow-lg focus-within:shadow-blue-100/70 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/70 motion-reduce:hover:translate-y-0">
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
      <button
        type="button"
        className="font900 mt-auto h-8 w-full rounded-md border border-blue-300 px-3 text-xs text-blue-600 transition-all duration-200 hover:border-blue-600 hover:bg-blue-600 hover:text-white focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {t("Add")}
      </button>
    </div>
  );
}
