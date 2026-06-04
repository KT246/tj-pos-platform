import type { ReactNode } from "react";

import { Badge } from "../../../components/ui/badge";
import { PrimaryButton, SecondaryButton } from "../../../components/ui/buttons";
import type { TrustPill } from "../types";
import { TrustPills } from "./trust-pills";

export function HeroShell({
  badge,
  title,
  accent,
  description,
  primaryHref = "/request-demo",
  primaryLabel = "Request Demo",
  secondaryHref,
  secondaryLabel,
  secondaryIcon,
  showTrust = false,
  trustItems,
  hideActions = false,
  children
}: {
  badge: string;
  title: string;
  accent: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  secondaryIcon?: ReactNode;
  showTrust?: boolean;
  trustItems?: readonly TrustPill[];
  hideActions?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-blue-100 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)]">
      <div className="mx-auto grid max-w-[1320px] gap-8 px-6 py-7 lg:grid-cols-[0.42fr_0.58fr] lg:items-center lg:px-8">
        <div className="flex flex-col justify-center">
          <Badge>{badge}</Badge>
          <h1 className="mt-5 max-w-2xl text-4xl leading-tight font-black tracking-normal text-slate-950 lg:text-5xl">
            {title} <span className="text-blue-600">{accent}</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
            {description}
          </p>
          {!hideActions ? (
            <div className="mt-7 flex flex-wrap gap-4">
              <PrimaryButton href={primaryHref}>{primaryLabel}</PrimaryButton>
              {secondaryHref && secondaryLabel ? (
                <SecondaryButton href={secondaryHref} icon={secondaryIcon}>
                  {secondaryLabel}
                </SecondaryButton>
              ) : null}
            </div>
          ) : null}
          {showTrust ? <TrustPills items={trustItems} /> : null}
        </div>
        {children}
      </div>
    </section>
  );
}
