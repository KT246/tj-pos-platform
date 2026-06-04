"use client";

import { CircleHelp, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";

import { PageShell } from "../../../components/layout/page-shell";
import { Badge } from "../../../components/ui/badge";
import { PrimaryButton, SecondaryButton } from "../../../components/ui/buttons";
import { CTASection } from "../../../components/ui/cta-section";
import { Field } from "../../../components/ui/field";
import { SelectField } from "../../../components/ui/select-field";
import { useI18n } from "../../../lib/i18n";
import { ContactCards } from "../components/contact-cards";

export function ContactPage() {
  const { t } = useI18n();

  return (
    <PageShell active="Contact">
      <section className="border-b border-blue-100 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)]">
        <div className="mx-auto max-w-[1320px] px-6 py-12 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <Badge>We're Here to Help</Badge>
              <h1 className="mt-6 text-5xl leading-tight font-black text-slate-950">
                {t("Get in Touch with")} <span className="text-blue-600">TJ POS</span>{" "}
                {t("Experts")}
              </h1>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                {t(
                  "Have questions or need advice? Our team is ready to help you find the perfect POS solution for your business."
                )}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <PrimaryButton href="/request-demo">Request Demo</PrimaryButton>
                <SecondaryButton
                  href="/faq-help"
                  icon={<CircleHelp className="h-4 w-4" />}
                >
                  View FAQ/Help
                </SecondaryButton>
              </div>
            </div>
            <ContactCards />
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-[1320px] gap-6 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <div className="rounded-lg border border-blue-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">
            {t("Send Us a Message")}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {t("Fill out the form and our team will get back to you shortly.")}
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <Field label="Full Name" placeholder="Enter your full name" />
            <Field label="Email Address" placeholder="Enter your email address" />
            <Field label="Phone Number" placeholder="Enter your phone number" />
            <SelectField label="Business Type" value="Select business type" />
            <Field label="Subject" placeholder="How can we help you?" wide />
            <Field
              label="Message"
              placeholder="Please tell us more about your business needs..."
              wide
              textarea
            />
          </div>
          <div className="mt-6 flex items-center gap-4">
            <PrimaryButton href="#">Send Message</PrimaryButton>
            <p className="font700 flex items-center gap-2 text-sm text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              {t("Your information is secure and never shared.")}
            </p>
          </div>
        </div>
        <div className="space-y-5">
          <div className="rounded-lg border border-blue-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">{t("Our Office")}</h2>
            <p className="mt-2 text-sm text-slate-600">
              {t("Visit us at our headquarters in Vientiane Capital.")}
            </p>
            <div className="mt-5 grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
              <div className="font800 space-y-3 text-sm text-slate-700">
                <p className="flex gap-2">
                  <MapPin className="h-4 w-4" /> Unit 45, Saysettha District
                </p>
                <p className="flex gap-2">
                  <Phone className="h-4 w-4" /> +856 20 55 888 999
                </p>
                <p className="flex gap-2">
                  <Mail className="h-4 w-4" /> info@tjpos.la
                </p>
              </div>
              <div className="relative h-56 overflow-hidden rounded-md border border-blue-100 bg-[linear-gradient(135deg,#eef5ff,#ffffff)]">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24%,#dbeafe_25%,transparent_26%,transparent_49%,#dbeafe_50%,transparent_51%,transparent_74%,#dbeafe_75%,transparent_76%),linear-gradient(0deg,transparent_24%,#dbeafe_25%,transparent_26%,transparent_49%,#dbeafe_50%,transparent_51%,transparent_74%,#dbeafe_75%,transparent_76%)]" />
                <div className="absolute top-1/2 left-1/2 rounded-lg bg-white p-4 shadow-lg">
                  <p className="font900 text-slate-950">TJ POS Co., Ltd.</p>
                  <p className="text-xs text-slate-500">
                    {t("Vientiane Capital, Laos")}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <CTASection title="Let's Find the Right Solution for Your Business" />
        </div>
      </section>
    </PageShell>
  );
}
