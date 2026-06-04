import Link from "next/link";
import { ArrowRight, ChevronDown, Info } from "lucide-react";

import { PageShell } from "../../../components/layout/page-shell";
import { PrimaryButton } from "../../../components/ui/buttons";
import { homeAddOns, homeCoreFeatures, homePricingPlans, posTypes } from "../data";
import { HomeAddOnCard } from "../components/add-on-card";
import { DashboardMockup } from "../components/dashboard-mockup";
import { HomeFeatureItem } from "../components/feature-card";
import { HeroShell } from "../components/hero-shell";
import { HomePosTypeCard } from "../components/pos-type-card";
import { HomePricingCard } from "../components/pricing-card";

export function HomePage() {
  return (
    <PageShell active="Home">
      <HeroShell
        badge="#1 POS Solution in Laos"
        title="Run Your Business Smarter with"
        accent="TJ POS"
        description="A complete, cloud-based POS platform for Retail, Cafe, Restaurant, Beauty and Hospitality businesses. Easy to use. Powerful features. Built for Laos."
        secondaryHref="/features"
        secondaryLabel="Explore Features"
        secondaryIcon={<Info className="h-4 w-4" />}
        showTrust
      >
        <DashboardMockup />
      </HeroShell>
      <section className="mx-auto grid max-w-[1320px] gap-0 px-6 py-4 lg:grid-cols-[1fr_1fr] lg:divide-x lg:divide-blue-100 lg:px-8">
        <div className="lg:pr-7">
          <h2 className="text-2xl font-black text-slate-950">
            Built for Every Business Type
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Powerful features tailored to how your business works.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {posTypes.map((item) => (
              <HomePosTypeCard key={item.title} item={item} />
            ))}
          </div>
          <div className="mt-2 flex justify-center">
            <Link
              href="/pos-types"
              className="font900 inline-flex h-6 items-center justify-center gap-1 rounded-md border border-blue-300 bg-white px-9 text-[10px] text-blue-600"
            >
              View All POS Types
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
        <div className="pt-7 lg:pt-0 lg:pl-7">
          <h2 className="text-2xl font-black text-slate-950">
            Powerful Features to Grow Your Business
          </h2>
          <div className="mt-7 grid gap-x-7 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
            {homeCoreFeatures.map((feature) => (
              <HomeFeatureItem key={feature.title} feature={feature} />
            ))}
          </div>
        </div>
      </section>
      <section className="border-y border-blue-100 bg-white py-3">
        <div className="mx-auto grid max-w-[1320px] gap-0 px-6 lg:grid-cols-[1fr_1fr] lg:divide-x lg:divide-blue-100 lg:px-8">
          <div className="lg:pr-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-950">
                  Simple Packages, One Powerful Platform
                </h2>
                <p className="mt-1 text-xs text-slate-600">
                  Choose the plan that fits your business.
                </p>
              </div>
              <div className="font900 hidden items-center rounded-full border border-blue-100 bg-slate-50 p-0.5 text-[10px] md:flex">
                <span className="rounded-full bg-blue-600 px-3 py-1 text-white">
                  Monthly
                </span>
                <span className="px-3 py-1 text-slate-600">Yearly (Save 20%)</span>
              </div>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-4">
              {homePricingPlans.map((plan) => (
                <HomePricingCard key={plan.name} plan={plan} />
              ))}
            </div>
            <p className="mt-3 text-[10px] text-slate-500">
              All plans include cloud access, offline mode, backups and local support in
              Laos.
            </p>
          </div>
          <div className="pt-6 lg:pt-0 lg:pl-7">
            <h2 className="text-lg font-black text-slate-950">Add-ons to Do More</h2>
            <p className="mt-1 text-xs text-slate-600">
              Extend TJ POS with powerful add-ons.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {homeAddOns.map((item) => (
                <HomeAddOnCard key={item.title} item={item} />
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-[1320px] gap-6 px-6 py-5 lg:grid-cols-[0.95fr_1fr_0.85fr_0.85fr] lg:px-8">
        <div>
          <h2 className="text-xl font-black text-slate-950">
            Trusted by Businesses Across Laos
          </h2>
          <div className="font900 mt-5 grid grid-cols-3 gap-3 text-center text-base text-slate-500">
            {[
              "Joma",
              "Vientiane Center",
              "BCEL",
              "Sabaidee Hotel",
              "Parkson",
              "Paragon"
            ].map((brand) => (
              <div
                key={brand}
                className="rounded-lg border border-blue-100 bg-white p-3"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-950">What Our Customers Say</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              "TJ POS helped us manage our cafe more efficiently.",
              "Reports and inventory features save us hours every day."
            ].map((quote, index) => (
              <div
                key={quote}
                className="rounded-lg border border-blue-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-slate-200 to-blue-300" />
                  <div>
                    <p className="font900 text-slate-950">
                      {index === 0 ? "Khampheng L." : "Vilayphone S."}
                    </p>
                    <p className="text-xs text-slate-500">Owner, Local Business</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">{quote}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-950">FAQ</h2>
          <div className="mt-5 space-y-2">
            {[
              "Is TJ POS cloud-based?",
              "Can I use TJ POS offline?",
              "Do you provide support in Laos?"
            ].map((question) => (
              <div
                key={question}
                className="rounded-md border border-blue-100 bg-white px-4 py-3"
              >
                <p className="font800 flex items-center justify-between text-sm text-slate-800">
                  {question}
                  <ChevronDown className="h-4 w-4" />
                </p>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <PrimaryButton href="/request-demo">Request Demo</PrimaryButton>
          </div>
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-5">
          <h2 className="text-xl font-black text-blue-700">
            Ready to Transform Your Business?
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Let us show you how TJ POS can help you sell more and manage easier.
          </p>
          <div className="mt-5">
            <PrimaryButton href="/request-demo">Request Demo</PrimaryButton>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
