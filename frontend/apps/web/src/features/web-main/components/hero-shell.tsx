"use client";

import type { ReactNode } from "react";

import { HeroTitleReveal } from "../../../components/animations/hero-title-reveal";
import { Badge } from "../../../components/ui/badge";
import { PrimaryButton, SecondaryButton } from "../../../components/ui/buttons";
import { useI18n } from "../../../lib/i18n";

export function HeroShell({
  badge,
  title,
  accent,
  description,
  primaryHref = "/#contact",
  primaryLabel = "Request Demo",
  secondaryHref,
  secondaryLabel,
  secondaryIcon,
  animateTitle = false,
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
  animateTitle?: boolean;
  hideActions?: boolean;
  children: ReactNode;
}) {
  const { t } = useI18n();
  const titleClassName =
    "mt-5 max-w-2xl text-4xl leading-tight font-black tracking-normal text-slate-950 lg:text-[46px]";

  return (
    <section className="border-y border-blue-100 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)]">
      <div className="mx-auto grid max-w-[1320px] gap-8 px-6 py-6 lg:grid-cols-[0.38fr_0.62fr] lg:items-center lg:px-8">
        <div className="flex flex-col justify-center">
          <Badge>{badge}</Badge>
          {animateTitle ? (
            <HeroTitleReveal
              title={t(title)}
              accent={t(accent)}
              className={titleClassName}
              accentClassName="text-blue-600"
            />
          ) : (
            <h1 className={titleClassName}>
              {t(title)} <span className="text-blue-600">{t(accent)}</span>
            </h1>
          )}
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
            {t(description)}
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
        </div>
        {children}
      </div>
    </section>
  );
}
