"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown, Info, Quote, Star } from "lucide-react";
import { useEffect } from "react";

import {
  AnimatedContent,
  revealSection,
  scrollToSection
} from "../../../components/animations/animated-content";
import { PageShell } from "../../../components/layout/page-shell";
import { PrimaryButton } from "../../../components/ui/buttons";
import { useI18n } from "../../../lib/i18n";
import { addOns, homeCoreFeatures, posTypes, pricingPlans } from "../data";
import { AddOnCard } from "../components/add-on-card";
import { DashboardMockup } from "../components/dashboard-mockup";
import { HomeFeatureItem } from "../components/feature-card";
import { HeroShell } from "../components/hero-shell";
import { HomePosTypeCard } from "../components/pos-type-card";
import { PricingCard } from "../components/pricing-card";

const trustedBrands = [
  { name: "Joma", initials: "JO", tone: "from-sky-500 to-blue-700" },
  { name: "Vientiane Center", initials: "VC", tone: "from-emerald-400 to-teal-700" },
  { name: "BCEL", initials: "BC", tone: "from-blue-500 to-indigo-700" },
  { name: "Sabaidee Hotel", initials: "SH", tone: "from-amber-400 to-orange-700" },
  { name: "Parkson", initials: "PK", tone: "from-fuchsia-400 to-violet-700" },
  { name: "Paragon", initials: "PG", tone: "from-cyan-400 to-blue-700" }
] as const;

const customerStories = [
  {
    name: "Khampheng L.",
    quote: "TJ POS helped us manage our cafe more efficiently.",
    initials: "KL",
    tone: "from-sky-100 to-blue-300"
  },
  {
    name: "Vilayphone S.",
    quote: "Reports and inventory features save us hours every day.",
    initials: "VS",
    tone: "from-emerald-100 to-teal-300"
  }
] as const;

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

          if (sectionId === "home") {
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
          animateTitle
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
              href="/#pos-types"
              className="font900 group inline-flex h-8 w-fit items-center justify-center gap-1 rounded-md border border-blue-300 bg-white px-5 text-xs text-blue-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-sm focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:hover:translate-y-0"
            >
              {t("View All POS Types")}
              <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0" />
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
          <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.name} plan={plan} />
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
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {addOns.map((item) => (
              <AddOnCard key={item.title} item={item} />
            ))}
          </div>
        </section>
      </AnimatedContent>

      <AnimatedContent
        className="border-y border-blue-100 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] py-10"
        distance={30}
      >
        <section className="mx-auto grid max-w-[1320px] gap-8 px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
          <div>
            <h2 className="text-2xl font-black text-slate-950">
              {t("Trusted by Businesses Across Laos")}
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {trustedBrands.map((brand) => (
                <div
                  key={brand.name}
                  className="group flex min-h-[76px] items-center gap-3 rounded-lg border border-blue-100 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/70 motion-reduce:hover:translate-y-0"
                >
                  <span
                    className={`font900 flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-gradient-to-br text-xs text-white shadow-sm ${brand.tone}`}
                  >
                    {brand.initials}
                  </span>
                  <span className="font900 text-sm leading-5 text-slate-700 transition-colors group-hover:text-slate-950">
                    {brand.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-950">
              {t("What Our Customers Say")}
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {customerStories.map((story) => (
                <div
                  key={story.name}
                  className="group relative min-h-[190px] overflow-hidden rounded-lg border border-blue-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/70 motion-reduce:hover:translate-y-0"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-sky-400 to-emerald-400" />
                  <Quote className="absolute top-5 right-5 h-8 w-8 text-blue-100 transition-colors group-hover:text-blue-200" />
                  <div className="flex items-center gap-3">
                    <div
                      className={`font900 flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm text-blue-900 ${story.tone}`}
                    >
                      {story.initials}
                    </div>
                    <div>
                      <p className="font900 text-slate-950">{story.name}</p>
                      <p className="text-xs text-slate-500">
                        {t("Owner, Local Business")}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-1 text-amber-400">
                    {[0, 1, 2, 3, 4].map((item) => (
                      <Star key={item} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {t(story.quote)}
                  </p>
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
