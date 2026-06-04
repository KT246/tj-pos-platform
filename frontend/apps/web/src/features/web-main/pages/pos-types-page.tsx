"use client";

import { Info } from "lucide-react";

import { PageShell } from "../../../components/layout/page-shell";
import { CTASection } from "../../../components/ui/cta-section";
import { SectionHeading } from "../../../components/ui/section-heading";
import { coreFeatures, posTypes } from "../data";
import { DashboardMockup } from "../components/dashboard-mockup";
import { FeatureCard } from "../components/feature-card";
import { HeroShell } from "../components/hero-shell";
import { PosTypeCard } from "../components/pos-type-card";
import { IconBox } from "../../../components/ui/icon-box";
import { useI18n } from "../../../lib/i18n";

export function PosTypesPage() {
  const { t } = useI18n();

  return (
    <PageShell active="POS Types">
      <HeroShell
        badge="#1 POS Solution in Laos"
        title="POS Types for"
        accent="Every Business"
        description="TJ POS supports multiple business models across Laos. Choose the right POS type that fits your operations and helps you grow."
        secondaryHref="/features"
        secondaryLabel="Explore Features"
        secondaryIcon={<Info className="h-4 w-4" />}
      >
        <div>
          <div className="mb-4 grid grid-cols-5 gap-3 rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
            {posTypes.map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-blue-100 p-4 text-center"
              >
                <div className="mx-auto w-fit">
                  <IconBox Icon={item.Icon} tone={item.tone} />
                </div>
                <p className="font900 mt-3 text-sm text-slate-950">
                  {t(item.shortTitle)}
                </p>
              </div>
            ))}
          </div>
          <DashboardMockup compact />
        </div>
      </HeroShell>
      <section className="mx-auto max-w-[1320px] px-6 py-12 lg:px-10">
        <SectionHeading
          title="Choose the Right POS Type for Your Business"
          description="Designed to match the way you sell, serve, and manage."
        />
        <div className="grid gap-5 lg:grid-cols-5">
          {posTypes.map((item) => (
            <PosTypeCard key={item.title} item={item} large />
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-[1320px] px-6 pb-12 lg:px-10">
        <SectionHeading
          title="Powerful Capabilities Shared Across All POS Types"
          description="One platform. All the essentials you need."
        />
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {coreFeatures.slice(0, 6).map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </section>
      <CTASection title="Not sure which POS type fits you best?" />
    </PageShell>
  );
}
