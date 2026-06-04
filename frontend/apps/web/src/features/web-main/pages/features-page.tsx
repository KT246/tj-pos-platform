"use client";

import { Gift } from "lucide-react";

import { PageShell } from "../../../components/layout/page-shell";
import { CTASection } from "../../../components/ui/cta-section";
import { IconBox } from "../../../components/ui/icon-box";
import { useI18n } from "../../../lib/i18n";
import { addOns, coreFeatures } from "../data";
import { DashboardMockup } from "../components/dashboard-mockup";
import { FeatureCard } from "../components/feature-card";
import { HeroShell } from "../components/hero-shell";

export function FeaturesPage() {
  const { t } = useI18n();

  return (
    <PageShell active="Features">
      <HeroShell
        badge="#1 POS Solution in Laos"
        title="Everything You Need, Built Into"
        accent="TJ POS"
        description="Powerful core features to run your business smoothly. Simple to use. Easy to manage. Built to help you grow."
        secondaryHref="/pricing"
        secondaryLabel="Explore Pricing"
        secondaryIcon={<Gift className="h-4 w-4" />}
      >
        <DashboardMockup />
      </HeroShell>
      <section className="mx-auto max-w-[1320px] px-6 py-6 lg:px-10">
        <div className="grid gap-4 md:grid-cols-4 xl:grid-cols-8">
          {coreFeatures.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-[1320px] px-6 py-10 lg:px-10">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {coreFeatures.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </section>
      <section className="border-y border-blue-100 bg-slate-50/50 py-10">
        <div className="mx-auto grid max-w-[1320px] gap-5 px-6 lg:grid-cols-[1fr_1fr] lg:px-10">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-7">
            <h2 className="text-xl font-black text-emerald-700">
              {t("Core Features Included in Every Plan")}
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-4">
              {coreFeatures.slice(0, 8).map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className="mx-auto w-fit">
                    <IconBox Icon={feature.Icon} tone={feature.tone} />
                  </div>
                  <p className="font900 mt-2 text-xs text-slate-800">
                    {t(feature.title)}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-violet-200 bg-violet-50 p-7">
            <h2 className="text-xl font-black text-violet-700">
              {t("Optional Add-ons Extend Your System")}
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-4">
              {addOns.slice(0, 8).map((item) => (
                <div key={item.title} className="text-center">
                  <div className="mx-auto w-fit">
                    <IconBox Icon={item.Icon} tone={item.tone} />
                  </div>
                  <p className="font900 mt-2 text-xs text-slate-800">{t(item.title)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <CTASection />
    </PageShell>
  );
}
