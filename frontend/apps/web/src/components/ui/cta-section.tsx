import { Headphones } from "lucide-react";

import { PrimaryButton, SecondaryButton } from "./buttons";

export function CTASection({
  title = "Need help choosing the right setup?",
  description = "Our experts are ready to understand your needs and recommend the best POS solution.",
  primaryLabel = "Request Demo",
  primaryHref = "/request-demo",
  secondaryLabel = "Contact TJ POS",
  secondaryHref = "/contact"
}: {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="mx-auto my-6 max-w-[1320px] px-6 lg:px-8">
      <div className="flex flex-col gap-5 rounded-lg border border-blue-200 bg-blue-50/70 p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <Headphones className="h-7 w-7" />
          </span>
          <div>
            <h2 className="text-xl font-black text-slate-950">{title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              {description}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <PrimaryButton href={primaryHref}>{primaryLabel}</PrimaryButton>
          <SecondaryButton href={secondaryHref}>{secondaryLabel}</SecondaryButton>
        </div>
      </div>
    </section>
  );
}
