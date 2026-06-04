"use client";

import Link from "next/link";
import { Check } from "lucide-react";

import { IconBox } from "../../../components/ui/icon-box";
import { useI18n } from "../../../lib/i18n";
import type { PricingPlan } from "../types";

export function PricingCard({ plan }: { plan: PricingPlan }) {
  const { t } = useI18n();

  return (
    <div
      className={`relative flex h-full min-h-[360px] flex-col rounded-lg border bg-white p-5 text-center shadow-sm ${
        plan.featured ? "border-blue-500 shadow-blue-100" : "border-blue-100"
      }`}
    >
      {plan.featured ? (
        <div className="font900 absolute -top-4 left-1/2 -translate-x-1/2 rounded-md bg-blue-600 px-5 py-2 text-xs whitespace-nowrap text-white">
          {t("Most Popular")}
        </div>
      ) : null}
      <div className="flex justify-center">
        <IconBox Icon={plan.Icon} tone={plan.featured ? "teal" : "blue"} />
      </div>
      <h3 className="mt-3 text-lg font-black text-slate-950">{t(plan.name)}</h3>
      <p className="mt-2 min-h-12 text-xs leading-5 text-slate-600">
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
      <ul className="mt-4 flex-1 space-y-2 text-left">
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
        href={plan.name === "Enterprise" ? "/#contact" : "/request-demo"}
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
