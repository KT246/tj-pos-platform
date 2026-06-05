"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { useI18n } from "../../../lib/i18n";
import type { PosType } from "../types";

function PosTypeImage({ item, large = false }: { item: PosType; large?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden rounded-md border border-blue-50 bg-slate-100 ${
        large ? "aspect-[16/8]" : "aspect-[16/7]"
      }`}
    >
      <Image
        src={item.imageUrl}
        alt={item.imageAlt}
        fill
        sizes={
          large
            ? "(min-width: 1024px) 420px, 100vw"
            : "(min-width: 1280px) 260px, (min-width: 640px) 50vw, 100vw"
        }
        className="object-cover transition duration-500 group-hover:scale-[1.05] motion-reduce:group-hover:scale-100"
      />
    </div>
  );
}

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
      className={`group rounded-lg border border-blue-100 bg-white shadow-sm transition-all duration-300 focus-within:border-blue-400 focus-within:shadow-lg focus-within:shadow-blue-100/70 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/70 motion-reduce:hover:translate-y-0 ${
        large ? "p-5" : "p-3"
      }`}
    >
      <div className={`${large ? "mb-4" : "mb-3"}`}>
        <h3 className={`${large ? "text-lg" : "text-sm"} font-black text-slate-950`}>
          {large ? t(item.title) : t(item.shortTitle)}
        </h3>
      </div>
      <PosTypeImage item={item} large={large} />
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
        className="font900 group/link mt-3 inline-flex items-center gap-2 text-xs text-blue-600 transition-colors duration-200 hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {t("Learn more")}
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-0.5 motion-reduce:group-hover/link:translate-x-0" />
      </Link>
    </div>
  );
}

export function HomePosTypeCard({ item }: { item: PosType }) {
  const { t } = useI18n();

  return (
    <div className="group flex h-full min-h-[300px] flex-col rounded-lg border border-blue-100 bg-white p-3 text-center shadow-sm transition-all duration-300 focus-within:border-blue-400 focus-within:shadow-lg focus-within:shadow-blue-100/70 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/70 motion-reduce:hover:translate-y-0">
      <div className="mb-3">
        <h3 className="text-base font-black text-slate-950">{t(item.shortTitle)}</h3>
      </div>
      <PosTypeImage item={item} />
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
        className="font900 group/link mt-4 inline-flex items-center justify-center gap-1 text-xs text-blue-600 transition-colors duration-200 hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {t("Learn more")}
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5 motion-reduce:group-hover/link:translate-x-0" />
      </Link>
    </div>
  );
}
