"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { IconBox, iconToneClass } from "../../../components/ui/icon-box";
import { useI18n } from "../../../lib/i18n";
import type { PosType } from "../types";

export function PosTypeCard({
  item,
  large = false
}: {
  item: PosType;
  large?: boolean;
}) {
  const { t } = useI18n();

  return (
    <div
      className={`rounded-lg border border-blue-100 bg-white shadow-sm ${
        large ? "p-5" : "p-3"
      }`}
    >
      <div className={`${large ? "mb-4" : "mb-3"} flex items-center gap-3`}>
        <IconBox Icon={item.Icon} tone={item.tone} />
        <h3 className={`${large ? "text-lg" : "text-sm"} font-black text-slate-950`}>
          {large ? t(item.title) : t(item.shortTitle)}
        </h3>
      </div>
      <div
        className={`${large ? "h-28" : "h-20"} rounded-md border border-blue-50`}
        style={{ background: item.visual }}
      />
      <p
        className={`${large ? "mt-4 text-sm leading-6" : "mt-3 text-xs leading-5"} text-slate-600`}
      >
        {t(item.description)}
      </p>
      {large ? (
        <ul className="mt-4 space-y-2">
          {item.bullets.map((bullet) => (
            <li
              key={bullet}
              className="font700 flex items-center gap-2 text-sm text-slate-700"
            >
              <Check className="h-4 w-4 rounded-full bg-blue-600 p-0.5 text-white" />
              {t(bullet)}
            </li>
          ))}
        </ul>
      ) : null}
      <Link
        href="/#pos-types"
        className="font900 mt-3 inline-flex items-center gap-2 text-xs text-blue-600"
      >
        {t("Learn more")}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

export function HomePosTypeCard({ item }: { item: PosType }) {
  const { t } = useI18n();

  return (
    <div className="flex h-full min-h-[300px] flex-col rounded-lg border border-blue-100 bg-white p-3 text-center shadow-sm">
      <div className="mb-3 flex flex-col items-center gap-2">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ring-1 ${iconToneClass(item.tone)}`}
        >
          <item.Icon className="h-[18px] w-[18px]" />
        </span>
        <h3 className="text-base font-black text-slate-950">{t(item.shortTitle)}</h3>
      </div>
      <div
        className="h-[64px] rounded-md border border-blue-50"
        style={{ background: item.visual }}
      />
      <p className="mt-3 min-h-12 text-xs leading-5 text-slate-600">
        {t(item.description)}
      </p>
      <ul className="mt-3 flex-1 space-y-1.5 text-left">
        {item.bullets.map((bullet) => (
          <li key={bullet} className="font700 flex gap-2 text-[11px] text-slate-700">
            <Check className="mt-0.5 h-3 w-3 shrink-0 text-blue-600" />
            <span>{t(bullet)}</span>
          </li>
        ))}
      </ul>
      <Link
        href="/#pos-types"
        className="font900 mt-4 inline-flex items-center justify-center gap-1 text-xs text-blue-600"
      >
        {t("Learn more")}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
