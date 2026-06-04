"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown, Info } from "lucide-react";
import { useEffect } from "react";

import {
  AnimatedContent,
  revealSection,
  scrollToSection
} from "../../../components/animations/animated-content";
import { PageShell } from "../../../components/layout/page-shell";
import { PrimaryButton } from "../../../components/ui/buttons";
import { useI18n } from "../../../lib/i18n";
import { homeAddOns, homeCoreFeatures, homePricingPlans, posTypes } from "../data";
import { HomeAddOnCard } from "../components/add-on-card";
import { DashboardMockup } from "../components/dashboard-mockup";
import { HomeFeatureItem } from "../components/feature-card";
import { HeroShell } from "../components/hero-shell";
import { HomePosTypeCard } from "../components/pos-type-card";
import { HomePricingCard } from "../components/pricing-card";

export function HomePage() {
  const { t } = useI18n();

  useEffect(() => {
    const scrollToHash = () => {
      const sectionId = window.location.hash.slice(1);

      if (!sectionId) {
        return;
      }

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          if (!scrollToSection(sectionId)) {
            return;
          }

          revealSection(sectionId, 350);
        });
      });
    };

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);

    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  return (
    <PageShell active="Home">
      <AnimatedContent id="home" className="scroll-mt-20" distance={28}>
        <HeroShell
          badge="#1 POS Solution in Laos"
          title="Run Your Business Smarter with"
          accent="TJ POS"
          description="A complete, cloud-based POS platform for Retail, Cafe, Restaurant, Beauty and Hospitality businesses. Easy to use. Powerful features. Built for Laos."
          secondaryHref="/#features"
          secondaryLabel="Explore Features"
          secondaryIcon={<Info className="h-4 w-4" />}
          showTrust
        >
          <DashboardMockup />
        </HeroShell>
      </AnimatedContent>
      <AnimatedContent
        id="pos-types"
        className="scroll-mt-20 bg-white py-8"
        distance={34}
      >
        <section className="mx-auto max-w-[1320px] px-6 lg:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-950">
                {t("Built for Every Business Type")}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {t("Powerful features tailored to how your business works.")}
              </p>
            </div>
            <Link
              href="/pos-types"
              className="font900 inline-flex h-8 w-fit items-center justify-center gap-1 rounded-md border border-blue-300 bg-white px-5 text-xs text-blue-600"
            >
              {t("View All POS Types")}
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {posTypes.map((item) => (
              <HomePosTypeCard key={item.title} item={item} />
            ))}
          </div>
        </section>
      </AnimatedContent>

      <AnimatedContent
        id="features"
        className="scroll-mt-20 border-y border-blue-100 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] py-8"
        distance={34}
      >
        <section className="mx-auto max-w-[1320px] px-6 lg:px-8">
          <h2 className="text-2xl font-black text-slate-950">
            {t("Powerful Features to Grow Your Business")}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {t(
              "Powerful core features to run your business smoothly. Simple to use. Easy to manage. Built to help you grow."
            )}
          </p>
          <div className="mt-7 grid gap-x-7 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {homeCoreFeatures.map((feature) => (
              <HomeFeatureItem key={feature.title} feature={feature} />
            ))}
          </div>
        </section>
      </AnimatedContent>

      <AnimatedContent
        id="pricing"
        className="scroll-mt-20 bg-white py-8"
        distance={34}
      >
        <section className="mx-auto max-w-[1320px] px-6 lg:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-950">
                {t("Simple Packages, One Powerful Platform")}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {t("Choose the plan that fits your business.")}
              </p>
            </div>
            <div className="font900 hidden items-center rounded-full border border-blue-100 bg-slate-50 p-0.5 text-xs md:flex">
              <span className="rounded-full bg-blue-600 px-4 py-1.5 text-white">
                {t("Monthly")}
              </span>
              <span className="px-4 py-1.5 text-slate-600">
                {t("Yearly (Save 20%)")}
              </span>
            </div>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-4">
            {homePricingPlans.map((plan) => (
              <HomePricingCard key={plan.name} plan={plan} />
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">
            {t(
              "All plans include cloud access, offline mode, backups and local support in Laos."
            )}
          </p>
        </section>
      </AnimatedContent>

      <AnimatedContent
        id="add-ons"
        className="scroll-mt-20 border-y border-blue-100 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] py-8"
        distance={34}
      >
        <section className="mx-auto max-w-[1320px] px-6 lg:px-8">
          <h2 className="text-2xl font-black text-slate-950">
            {t("Add-ons to Do More")}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {t("Extend TJ POS with powerful add-ons.")}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {homeAddOns.map((item) => (
              <HomeAddOnCard key={item.title} item={item} />
            ))}
          </div>
        </section>
      </AnimatedContent>

      <AnimatedContent className="bg-white py-8" distance={30}>
        <section className="mx-auto grid max-w-[1320px] gap-8 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <h2 className="text-xl font-black text-slate-950">
              {t("Trusted by Businesses Across Laos")}
            </h2>
            <div className="font900 mt-5 grid grid-cols-2 gap-3 text-center text-base text-slate-500 sm:grid-cols-3">
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
            <h2 className="text-xl font-black text-slate-950">
              {t("What Our Customers Say")}
            </h2>
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
                      <p className="text-xs text-slate-500">
                        {t("Owner, Local Business")}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600">{t(quote)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedContent>

      <AnimatedContent
        id="faq-help"
        className="scroll-mt-20 border-y border-blue-100 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] py-8"
        distance={30}
      >
        <section className="mx-auto max-w-[1320px] px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.38fr_0.62fr] lg:items-start">
            <div>
              <h2 className="text-2xl font-black text-slate-950">{t("FAQ")}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {t(
                  "Find answers to common questions about TJ POS. Everything you need to know to run your business with confidence."
                )}
              </p>
              <div className="mt-5">
                <PrimaryButton href="/request-demo">Request Demo</PrimaryButton>
              </div>
            </div>
            <div className="space-y-3">
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
                    {t(question)}
                    <ChevronDown className="h-4 w-4" />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedContent>

      <AnimatedContent
        id="contact"
        className="scroll-mt-20 border-y border-blue-200 bg-blue-50 py-8"
        distance={30}
      >
        <section className="mx-auto flex max-w-[1320px] flex-col gap-5 px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <h2 className="text-2xl font-black text-blue-700">
              {t("Ready to Transform Your Business?")}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              {t(
                "Let us show you how TJ POS can help you sell more and manage easier."
              )}
            </p>
          </div>
          <PrimaryButton href="/request-demo">Request Demo</PrimaryButton>
        </section>
      </AnimatedContent>
    </PageShell>
  );
}
