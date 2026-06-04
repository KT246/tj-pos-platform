import Link from "next/link";
import { Check } from "lucide-react";

import { IconBox, iconToneClass } from "../../../components/ui/icon-box";
import type { PricingPlan } from "../types";

export function PricingCard({ plan }: { plan: PricingPlan }) {
  return (
    <div
      className={`relative rounded-lg border bg-white p-5 shadow-sm ${
        plan.featured ? "border-blue-500 shadow-blue-100" : "border-blue-100"
      }`}
    >
      {plan.featured ? (
        <div className="font900 absolute -top-4 left-1/2 -translate-x-1/2 rounded-md bg-blue-600 px-6 py-2 text-xs text-white">
          Most Popular
        </div>
      ) : null}
      <IconBox Icon={plan.Icon} tone={plan.featured ? "teal" : "blue"} />
      <h3 className="mt-3 text-lg font-black text-slate-950">{plan.name}</h3>
      <p className="mt-2 min-h-10 text-xs leading-5 text-slate-600">{plan.subtitle}</p>
      <p className="mt-4 text-2xl font-black whitespace-nowrap text-blue-600">
        {plan.price}
        {plan.price !== "Custom" ? (
          <span className="font700 text-sm text-slate-500"> /month</span>
        ) : null}
      </p>
      <p className="mt-2 text-xs text-slate-500">
        {plan.price === "Custom" ? "Tailored to your needs" : "Billed monthly"}
      </p>
      <ul className="mt-4 space-y-2">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="font800 flex items-center gap-2 text-xs text-slate-700"
          >
            <Check className="h-3.5 w-3.5 text-blue-600" />
            {feature}
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
        {plan.cta}
      </Link>
    </div>
  );
}

export function HomePricingCard({ plan }: { plan: PricingPlan }) {
  return (
    <div
      className={`relative rounded-lg border bg-white p-3 shadow-sm ${
        plan.featured ? "border-blue-500" : "border-blue-100"
      }`}
    >
      {plan.featured ? (
        <div className="font900 absolute -top-3 right-3 rounded-md bg-blue-600 px-3 py-1 text-[10px] text-white">
          Most Popular
        </div>
      ) : null}
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ring-1 ${iconToneClass(
          plan.featured ? "teal" : "blue"
        )}`}
      >
        <plan.Icon className="h-4 w-4" />
      </span>
      <h3 className="mt-2 text-sm font-black text-slate-950">{plan.name}</h3>
      <p className="mt-1 min-h-6 text-[10px] leading-4 text-slate-600">
        {plan.subtitle}
      </p>
      <p className="mt-2 text-lg font-black whitespace-nowrap text-blue-600">
        {plan.price}
        {plan.price !== "Custom" ? (
          <span className="font700 text-[10px] text-slate-500"> /month</span>
        ) : null}
      </p>
      <ul className="mt-2 space-y-1">
        {plan.features.slice(0, 3).map((feature) => (
          <li
            key={feature}
            className="font800 flex items-center gap-1.5 text-[10px] text-slate-700"
          >
            <Check className="h-3 w-3 text-blue-600" />
            {feature}
          </li>
        ))}
      </ul>
      <Link
        href={plan.name === "Enterprise" ? "/contact" : "/request-demo"}
        className={`font900 mt-3 flex h-7 items-center justify-center rounded-md border text-[11px] ${
          plan.featured
            ? "border-blue-600 bg-blue-600 text-white"
            : "border-blue-300 bg-white text-blue-600"
        }`}
      >
        {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
      </Link>
    </div>
  );
}
