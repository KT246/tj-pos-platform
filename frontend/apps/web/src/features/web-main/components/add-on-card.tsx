"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { IconBox, iconToneClass } from "../../../components/ui/icon-box";
import { useI18n } from "../../../lib/i18n";
import type { AddOn, HomeAddOn } from "../types";

export function AddOnCard({ item }: { item: AddOn }) {
  const { t } = useI18n();

  return (
    <div className="rounded-lg border border-blue-100 bg-white p-4 shadow-sm">
      <IconBox Icon={item.Icon} tone={item.tone} />
      <h3 className="mt-3 text-sm font-black text-slate-950">{t(item.title)}</h3>
      <p className="mt-2 min-h-10 text-xs leading-5 text-slate-600">
        {t(item.description)}
      </p>
      <p className="mt-3 text-lg font-black whitespace-nowrap text-slate-950">
        {item.price}
        <span className="font700 text-xs text-slate-500"> /month</span>
      </p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <button className="font900 h-8 rounded-md border border-blue-300 px-3 text-xs text-blue-600">
          {t("Add")}
        </button>
        <Link
          href="/#add-ons"
          className="font900 inline-flex items-center gap-1 text-xs text-blue-600"
        >
          {t("More")}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

export function HomeAddOnCard({ item }: { item: HomeAddOn }) {
  const { t } = useI18n();

  return (
    <div
      className={`rounded-md border bg-white p-2.5 text-center shadow-sm ${
        item.variant === "view-all" ? "border-blue-200" : "border-blue-100"
      }`}
    >
      <span
        className={`mx-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-md ring-1 ${iconToneClass(item.tone)}`}
      >
        <item.Icon className="h-3.5 w-3.5" />
      </span>
      <h3 className="mt-2 min-h-7 text-[11px] leading-4 font-black text-slate-950">
        {t(item.title)}
      </h3>
      <p className="mt-1 min-h-8 text-[9px] leading-4 text-slate-600">
        {t(item.description)}
      </p>
      {item.price ? (
        <p className="mt-1.5 text-sm font-black whitespace-nowrap text-slate-950">
          {item.price}
          <span className="font700 text-[10px] text-slate-500"> /month</span>
        </p>
      ) : null}
      <button
        className={`font900 mt-1.5 h-6 w-full rounded-md border text-[10px] ${
          item.variant === "view-all"
            ? "border-blue-600 bg-blue-600 text-white"
            : "border-blue-300 bg-white text-blue-600"
        }`}
      >
        {t(item.cta)}
      </button>
    </div>
  );
}
