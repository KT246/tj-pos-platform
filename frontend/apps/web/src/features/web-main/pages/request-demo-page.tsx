"use client";

import { Headphones, LayoutDashboard, ShieldCheck } from "lucide-react";

import { PageShell } from "../../../components/layout/page-shell";
import { PrimaryButton, SecondaryButton } from "../../../components/ui/buttons";
import { CTASection } from "../../../components/ui/cta-section";
import { Field } from "../../../components/ui/field";
import { IconBox } from "../../../components/ui/icon-box";
import { SelectField } from "../../../components/ui/select-field";
import { useI18n } from "../../../lib/i18n";
import { demoTrustItems, posTypes } from "../data";
import { DashboardMockup } from "../components/dashboard-mockup";
import { HeroShell } from "../components/hero-shell";

export function RequestDemoPage() {
  const { t } = useI18n();

  return (
    <PageShell active="Contact">
      <HeroShell
        badge="See TJ POS in Action"
        title="Request a Personalized"
        accent="TJ POS Demo"
        description="See how TJ POS can simplify operations, boost efficiency and help your business grow. Our experts will walk you through a live demo tailored to your needs."
        showTrust
        trustItems={demoTrustItems}
        hideActions
      >
        <DashboardMockup />
      </HeroShell>
      <section className="mx-auto grid max-w-[1320px] gap-6 px-6 py-10 lg:grid-cols-[1.35fr_0.65fr] lg:px-10">
        <div className="rounded-lg border border-blue-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">
            {t("Tell Us About Your Business")}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {t(
              "Fill in the details below and our team will contact you to confirm your demo."
            )}
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <Field label="Full Name" placeholder="Somchai Phomsavanh" />
            <Field label="Business Name" placeholder="Vientiane Cafe" />
            <SelectField label="Business Type" value="Cafe" />
            <Field label="Phone Number" placeholder="+856 20 55 888 999" />
            <Field label="Email Address" placeholder="somchai@vientianecafe.la" />
            <SelectField label="Number of Branches" value="3 Branches" />
            <SelectField label="Current Setup / System" value="Manual / Paper-based" />
            <SelectField
              label="Interested Modules"
              value="Sales & Billing, Inventory"
            />
            <SelectField label="Country / City" value="Laos, Vientiane Capital" />
            <Field label="Preferred Demo Date" placeholder="May 22, 2025" />
            <SelectField label="Preferred Time" value="10:00 AM" />
            <Field
              label="Notes / Requirements"
              placeholder="Tell us about your needs"
            />
          </div>
          <label className="font700 mt-6 flex items-start gap-3 text-sm text-slate-600">
            <input
              type="checkbox"
              defaultChecked
              className="mt-1 h-4 w-4 rounded border-blue-200"
            />
            {t(
              "I agree to the Terms of Service and Privacy Policy and consent to be contacted by TJ POS."
            )}
          </label>
          <div className="mt-6 flex gap-4">
            <PrimaryButton href="#">Submit Demo Request</PrimaryButton>
            <SecondaryButton href="#">Reset Form</SecondaryButton>
          </div>
        </div>
        <div className="space-y-5">
          <div className="rounded-lg border border-blue-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">{t("What to Expect")}</h2>
            <div className="mt-5 space-y-5">
              {[
                [
                  "Live Product Demo",
                  "Explore key features and real-time system in action."
                ],
                [
                  "Tailored to Your Needs",
                  "See how TJ POS works for your setup and industry."
                ],
                ["Q&A with Experts", "Get answers to your questions on the spot."]
              ].map(([title, body], index) => (
                <div key={title} className="flex gap-3">
                  <IconBox
                    Icon={[LayoutDashboard, ShieldCheck, Headphones][index]}
                    tone="blue"
                  />
                  <div>
                    <p className="font900 text-slate-950">{t(title)}</p>
                    <p className="text-sm leading-6 text-slate-600">{t(body)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-blue-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">
              {t("Our 3-Step Demo Process")}
            </h2>
            <div className="mt-5 space-y-4">
              {[
                "Submit Your Request",
                "We Confirm & Prepare",
                "Live Demo & Consultation"
              ].map((step, index) => (
                <div key={step} className="flex gap-3">
                  <span className="font900 flex h-8 w-8 items-center justify-center rounded-full border border-blue-300 text-sm text-blue-600">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font900 text-slate-950">{t(step)}</p>
                    <p className="text-sm text-slate-600">
                      {t("Our team guides you through the right solution.")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-[1320px] gap-5 px-6 pb-4 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-slate-950">
            {t("TJ POS Supports Businesses Like Yours")}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {t("Choose your business type to see how we can help you grow.")}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-5">
            {posTypes.map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-2 rounded-md border border-blue-100 px-3 py-2"
              >
                <IconBox Icon={item.Icon} tone={item.tone} />
                <span className="font900 text-sm text-slate-900">
                  {t(item.shortTitle)}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <Headphones className="h-7 w-7" />
            </span>
            <div>
              <h2 className="text-lg font-black text-slate-950">
                {t("Need help choosing the right setup?")}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {t("Our specialists are ready to help you find the best solution.")}
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <PrimaryButton href="/#contact">Contact TJ POS</PrimaryButton>
            <SecondaryButton href="#">Call Us</SecondaryButton>
          </div>
        </div>
      </section>
      <CTASection
        title="Ready to see TJ POS in action?"
        primaryLabel="Submit Demo Request"
      />
    </PageShell>
  );
}
