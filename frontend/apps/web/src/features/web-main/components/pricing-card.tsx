"use client";

import Link from "next/link";
import { Check } from "lucide-react";

import { useI18n } from "../../../lib/i18n";
import type { BillingCycle, PricingPlan } from "../types";

const YEARLY_PRICE_MULTIPLIER = 12 * 0.8;

function getNumericPrice(price: string) {
  const value = Number(price.replace(/[^\d]/g, ""));

  return Number.isFinite(value) && value > 0 ? value : null;
}

function formatKipPrice(value: number) {
  return `K ${new Intl.NumberFormat("en-US").format(value)}`;
}

function getDisplayPrice(plan: PricingPlan, billingCycle: BillingCycle) {
  if (plan.price === "Custom" || billingCycle === "monthly") {
    return plan.price;
  }

  const monthlyPrice = getNumericPrice(plan.price);

  return monthlyPrice
    ? formatKipPrice(Math.round(monthlyPrice * YEARLY_PRICE_MULTIPLIER))
    : plan.price;
}

export function PricingCard({
  plan,
  billingCycle
}: {
  plan: PricingPlan;
  billingCycle: BillingCycle;
}) {
  const { t } = useI18n();
  const displayPrice = getDisplayPrice(plan, billingCycle);
  const unitLabel = billingCycle === "yearly" ? "/year" : "/month";
  const billingLabel = billingCycle === "yearly" ? "Billed yearly" : "Billed monthly";

  return (
    <div
      className={`group relative flex h-full min-h-[330px] flex-col rounded-lg border bg-white p-5 pt-7 text-center shadow-sm transition-all duration-300 focus-within:border-blue-500 focus-within:shadow-xl focus-within:shadow-blue-100/70 hover:-translate-y-1 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-100/70 motion-reduce:hover:translate-y-0 ${
        plan.featured ? "border-blue-500 shadow-blue-100" : "border-blue-100"
      }`}
    >
      {plan.featured ? (
        <div className="font900 absolute -top-4 left-1/2 -translate-x-1/2 rounded-md bg-blue-600 px-5 py-2 text-xs whitespace-nowrap text-white">
          {t("Most Popular")}
        </div>
      ) : null}
      <h3 className="text-lg font-black text-slate-950">{t(plan.name)}</h3>
      <p className="mt-2 min-h-12 text-xs leading-5 text-slate-600">
        {t(plan.subtitle)}
      </p>
      <p className="mt-4 text-2xl font-black whitespace-nowrap text-blue-600">
        {displayPrice}
        {plan.price !== "Custom" ? (
          <span className="font700 text-sm text-slate-500"> {t(unitLabel)}</span>
        ) : null}
      </p>
      <p className="mt-2 text-xs text-slate-500">
        {plan.price === "Custom" ? t("Tailored to your needs") : t(billingLabel)}
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
        href="/#contact"
        className={`font900 mt-5 flex h-9 items-center justify-center rounded-md border text-xs transition-all duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:hover:translate-y-0 ${
          plan.featured
            ? "border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md hover:shadow-blue-100"
            : "border-blue-300 bg-white text-blue-600 hover:border-blue-600 hover:bg-blue-600 hover:text-white"
        }`}
      >
        {t(plan.cta)}
      </Link>
    </div>
  );
}
