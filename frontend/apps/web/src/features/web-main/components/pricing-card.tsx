"use client";

import Link from "next/link";
import { Check } from "lucide-react";

import { IconBox } from "../../../components/ui/icon-box";
import { useI18n } from "../../../lib/i18n";
import type { HomePricingPlan, PricingPlan } from "../types";

export function PricingCard({ plan }: { plan: PricingPlan }) {
  const { t } = useI18n();

  return (
    <div
      className={`relative rounded-lg border bg-white p-5 shadow-sm ${
        plan.featured ? "border-blue-500 shadow-blue-100" : "border-blue-100"
      }`}
    >
      {plan.featured ? (
        <div className="font900 absolute -top-4 left-1/2 -translate-x-1/2 rounded-md bg-blue-600 px-6 py-2 text-xs text-white">
          {t("Most Popular")}
        </div>
      ) : null}
      <IconBox Icon={plan.Icon} tone={plan.featured ? "teal" : "blue"} />
      <h3 className="mt-3 text-lg font-black text-slate-950">{t(plan.name)}</h3>
      <p className="mt-2 min-h-10 text-xs leading-5 text-slate-600">
        {t(plan.subtitle)}
      </p>
      <p className="mt-4 text-2xl font-black whitespace-nowrap text-blue-600">
        {plan.price}
        {plan.price !== "Custom" ? (
          <span className="font700 text-sm text-slate-500"> /month</span>
        ) : null}
      </p>
      <p className="mt-2 text-xs text-slate-500">
        {plan.price === "Custom" ? t("Tailored to your needs") : t("Billed monthly")}
      </p>
      <ul className="mt-4 space-y-2">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="font800 flex items-center gap-2 text-xs text-slate-700"
          >
            <Check className="h-3.5 w-3.5 text-blue-600" />
            {t(feature)}
          </li>
        ))}
      </ul>
      <Link
        href={plan.name === "Enterprise" ? "/contact" : "/request-demo"}
        className={`font900 mt-5 flex h-9 items-center justify-center rounded-md border text-xs ${
          plan.featured
            ? "border-blue-600 bg-blue-600 text-white"
            : "border-blue-300 bg-white text-blue-600"
        }`}
      >
        {t(plan.cta)}
      </Link>
    </div>
  );
}

export function HomePricingCard({ plan }: { plan: HomePricingPlan }) {
  const { t } = useI18n();

  return (
    <div
      className={`relative rounded-md border bg-white p-2.5 shadow-sm ${
        plan.featured ? "border-emerald-400 shadow-emerald-50" : "border-blue-100"
      }`}
    >
      {plan.featured ? (
        <div className="font900 absolute -top-2.5 right-3 rounded-md bg-emerald-500 px-3 py-1 text-[9px] text-white">
          {plan.badge ? t(plan.badge) : null}
        </div>
      ) : null}
      <h3
        className={`text-sm font-black ${
          plan.featured ? "text-emerald-600" : "text-blue-600"
        }`}
      >
        {t(plan.name)}
      </h3>
      <p className="mt-0.5 text-[9px] leading-3 text-slate-500">{t(plan.subtitle)}</p>
      <p
        className={`mt-2 text-base font-black whitespace-nowrap ${
          plan.featured ? "text-emerald-600" : "text-blue-600"
        }`}
      >
        {plan.price}
        {plan.period ? (
          <span className="font700 text-[10px] text-slate-500"> {plan.period}</span>
        ) : null}
      </p>
      <ul className="mt-2 space-y-1">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="font800 flex items-center gap-1.5 text-[9px] text-slate-700"
          >
            <Check
              className={`h-2.5 w-2.5 ${plan.featured ? "text-emerald-500" : "text-blue-600"}`}
            />
            {t(feature)}
          </li>
        ))}
      </ul>
      <Link
        href={plan.name === "Enterprise" ? "/contact" : "/request-demo"}
        className={`font900 mt-2.5 flex h-6 items-center justify-center rounded-md border text-[9px] ${
          plan.featured
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-blue-300 bg-white text-blue-600"
        }`}
      >
        {t(plan.cta)}
      </Link>
    </div>
  );
}
