"use client";

import { useI18n } from "../../lib/i18n";

export function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  const { t } = useI18n();

  return (
    <div className="mx-auto mb-6 max-w-3xl text-center">
      {eyebrow ? (
        <p className="font900 mb-2 text-sm text-blue-600">{t(eyebrow)}</p>
      ) : null}
      <h2 className="text-2xl font-black tracking-normal text-slate-950">{t(title)}</h2>
      {description ? (
        <p className="mt-3 text-sm leading-6 text-slate-600">{t(description)}</p>
      ) : null}
    </div>
  );
}
