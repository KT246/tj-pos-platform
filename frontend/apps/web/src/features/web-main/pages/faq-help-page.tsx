import Link from "next/link";
import { ArrowRight, ChevronDown, Headphones, Search } from "lucide-react";

import { PageShell } from "../../../components/layout/page-shell";
import { Badge } from "../../../components/ui/badge";
import { CTASection } from "../../../components/ui/cta-section";
import { IconBox } from "../../../components/ui/icon-box";
import { faqGroups } from "../data";

export function FaqHelpPage() {
  return (
    <PageShell active="FAQ/Help">
      <section className="border-b border-blue-100 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)]">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-6 py-12 lg:grid-cols-[0.85fr_1.15fr] lg:px-10">
          <div>
            <Badge Icon={Headphones}>Get Help, Fast</Badge>
            <h1 className="mt-6 text-5xl leading-tight font-black text-slate-950">
              Frequently Asked <span className="text-blue-600">Questions</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Find answers to common questions about TJ POS. Everything you need to know
              to run your business with confidence.
            </p>
          </div>
          <div className="flex items-center">
            <div className="w-full rounded-lg border border-blue-100 bg-white p-7 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">
                How can we help you today?
              </h2>
              <div className="mt-5 flex h-14 items-center gap-3 rounded-md border border-blue-100 px-4">
                <span className="text-sm text-slate-500">Search for answers...</span>
                <Search className="ml-auto h-5 w-5 text-slate-500" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Setup guide", "Pricing", "Add-ons", "Payments", "Reports"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="font900 rounded-md bg-blue-50 px-4 py-2 text-xs text-blue-600"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-[1320px] px-6 py-10 lg:px-10">
        <div className="grid gap-5 md:grid-cols-3 xl:grid-cols-6">
          {faqGroups.map((group) => (
            <div
              key={group.title}
              className="rounded-lg border border-blue-100 bg-white p-6 shadow-sm"
            >
              <IconBox Icon={group.Icon} tone={group.tone} />
              <h3 className="mt-4 text-lg font-black text-slate-950">{group.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                View questions and support topics.
              </p>
              <Link
                href="#"
                className="font900 mt-4 inline-flex items-center gap-2 text-sm text-blue-600"
              >
                View questions
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {faqGroups.map((group) => (
            <div
              key={group.title}
              className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex items-center gap-3">
                <IconBox Icon={group.Icon} tone={group.tone} />
                <h2 className="text-xl font-black text-slate-950">{group.title}</h2>
              </div>
              <div className="space-y-3">
                {group.questions.map((question) => (
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
          ))}
        </div>
      </section>
      <CTASection title="Still need help?" secondaryLabel="Contact TJ POS" />
    </PageShell>
  );
}
