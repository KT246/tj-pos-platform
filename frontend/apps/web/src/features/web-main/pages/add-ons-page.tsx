"use client";

import { Info } from "lucide-react";

import { PageShell } from "../../../components/layout/page-shell";
import { CTASection } from "../../../components/ui/cta-section";
import { IconBox } from "../../../components/ui/icon-box";
import { addOns, posTypes } from "../data";
import { AddOnCard } from "../components/add-on-card";
import { DashboardMockup } from "../components/dashboard-mockup";
import { HeroShell } from "../components/hero-shell";
import { useI18n } from "../../../lib/i18n";

export function AddOnsPage() {
  const { t } = useI18n();

  return (
    <PageShell active="Add-ons">
      <HeroShell
        badge="Activate Only What You Need"
        title="Power Up Your POS with"
        accent="Smart Add-ons"
        description="TJ POS is built to grow with your business. Enable only the modules you need and extend your system anytime."
        primaryHref="/contact"
        primaryLabel="Contact TJ POS"
        secondaryHref="/features"
        secondaryLabel="Explore Features"
        secondaryIcon={<Info className="h-4 w-4" />}
      >
        <DashboardMockup compact />
      </HeroShell>
      <section className="mx-auto max-w-[1320px] px-6 py-10 lg:px-10">
        <div className="flex items-end justify-between gap-5">
          <div>
            <h2 className="text-2xl font-black text-slate-950">
              {t("Featured Add-ons")}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {t("All add-ons are optional and can be added anytime.")}
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-3 xl:grid-cols-6">
          {addOns.map((item) => (
            <AddOnCard key={item.title} item={item} />
          ))}
        </div>
      </section>
      <section className="mx-auto grid max-w-[1320px] gap-5 px-6 pb-10 lg:grid-cols-[1.3fr_0.7fr] lg:px-10">
        <div className="grid gap-5 rounded-lg border border-blue-100 bg-blue-50/40 p-6 md:grid-cols-4">
          <div>
            <h2 className="text-xl font-black text-slate-950">
              {t("Why Add-ons Matter")}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {t("Add-ons extend TJ POS to fit your unique operations.")}
            </p>
          </div>
          {[
            ["Increase Efficiency", "30%", "with process automation"],
            ["Boost Revenue", "20%", "with better tools and insights"],
            ["Better Experience", "25%", "with faster service"]
          ].map(([title, number, body]) => (
            <div key={title} className="rounded-lg border border-blue-100 bg-white p-5">
              <p className="font900 text-sm text-slate-950">{t(title)}</p>
              <p className="mt-4 text-4xl font-black text-blue-600">{number}</p>
              <p className="mt-2 text-sm text-slate-500">{t(body)}</p>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-blue-100 bg-white p-6">
          <h2 className="text-xl font-black text-slate-950">
            {t("Who Benefits from Add-ons?")}
          </h2>
          <div className="mt-5 space-y-4">
            {posTypes.map((item) => (
              <div key={item.title} className="flex gap-3">
                <IconBox Icon={item.Icon} tone={item.tone} />
                <div>
                  <p className="font900 text-sm text-slate-950">{t(item.title)}</p>
                  <p className="text-sm text-slate-600">{t(item.description)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTASection />
    </PageShell>
  );
}
