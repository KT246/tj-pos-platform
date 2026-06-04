import { ChevronDown } from "lucide-react";

import { PageShell } from "../../../components/layout/page-shell";
import { CTASection } from "../../../components/ui/cta-section";
import { addOns, faqGroups, pricingPlans } from "../data";
import { AddOnCard } from "../components/add-on-card";
import { PricingCard } from "../components/pricing-card";

export function PricingPage() {
  return (
    <PageShell active="Pricing">
      <section className="mx-auto max-w-[1320px] px-6 py-14 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <h1 className="text-5xl leading-tight font-black text-slate-950">
              Simple Pricing for{" "}
              <span className="text-blue-600">Growing Businesses</span>
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Flexible plans designed for businesses of all sizes. Start small and scale
              up as you grow.
            </p>
            <div className="mt-8 flex gap-3">
              <button className="font900 h-12 rounded-md border border-blue-400 bg-white px-6 text-sm text-blue-600">
                Monthly billing
              </button>
              <button className="font800 h-12 rounded-md border border-slate-200 bg-white px-6 text-sm text-slate-500">
                Yearly billing
              </button>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.name} plan={plan} />
            ))}
          </div>
        </div>
      </section>
      <section className="border-y border-blue-100 py-10">
        <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
          <h2 className="text-2xl font-black text-slate-950">Add-ons</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3 xl:grid-cols-7">
            {addOns.slice(0, 7).map((item) => (
              <AddOnCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-[1320px] gap-6 px-6 py-10 lg:grid-cols-[0.75fr_1.25fr] lg:px-10">
        <div className="rounded-lg border border-blue-100 p-6">
          <h2 className="text-xl font-black text-slate-950">
            Frequently Asked Questions
          </h2>
          <div className="mt-5 space-y-3">
            {faqGroups[1].questions.map((question) => (
              <div
                key={question}
                className="rounded-md border border-blue-100 px-4 py-3"
              >
                <p className="font800 flex justify-between text-sm text-slate-800">
                  {question}
                  <ChevronDown className="h-4 w-4" />
                </p>
              </div>
            ))}
          </div>
        </div>
        <CTASection title="Not sure which plan fits your business?" />
      </section>
    </PageShell>
  );
}
