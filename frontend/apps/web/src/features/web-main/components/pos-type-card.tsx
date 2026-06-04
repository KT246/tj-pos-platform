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
    <div className="rounded-lg border border-blue-100 bg-white p-2 shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ring-1 ${iconToneClass(item.tone)}`}
        >
          <item.Icon className="h-3.5 w-3.5" />
        </span>
        <h3 className="text-sm font-black text-slate-950">{t(item.shortTitle)}</h3>
      </div>
      <div
        className="h-[52px] rounded-md border border-blue-50"
        style={{ background: item.visual }}
      />
      <p className="mt-2 min-h-8 text-[10px] leading-4 text-slate-600">
        {t(item.bullets[0])}.
      </p>
      <Link
        href="/#pos-types"
        className="font900 mt-1.5 inline-flex items-center gap-1 text-[10px] text-blue-600"
      >
        {t("Learn more")}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
