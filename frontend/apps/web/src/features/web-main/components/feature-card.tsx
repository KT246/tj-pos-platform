"use client";

import { IconBox } from "../../../components/ui/icon-box";
import { iconToneClass } from "../../../components/ui/icon-box";
import { useI18n } from "../../../lib/i18n";
import type { IconCard } from "../types";

export function FeatureCard({ feature }: { feature: IconCard }) {
  const { t } = useI18n();

  return (
    <div className="rounded-lg border border-blue-100 bg-white p-4 shadow-sm">
      <div className="flex gap-3">
        <IconBox Icon={feature.Icon} tone={feature.tone} />
        <div>
          <h3 className="font900 text-sm text-slate-950">{t(feature.title)}</h3>
          <p className="mt-1.5 text-xs leading-5 text-slate-600">
            {t(feature.description)}
          </p>
        </div>
      </div>
    </div>
  );
}

export function HomeFeatureItem({ feature }: { feature: IconCard }) {
  const { t } = useI18n();

  return (
    <div className="flex h-full flex-col items-center rounded-lg border border-blue-100 bg-white p-4 text-center shadow-sm">
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-md ring-1 ${iconToneClass(feature.tone)}`}
      >
        <feature.Icon className="h-5 w-5" />
      </span>
      <h3 className="font900 mt-3 text-sm text-slate-950">{t(feature.title)}</h3>
      <p className="mt-2 min-h-10 text-xs leading-5 text-slate-600">
        {t(feature.description)}
      </p>
    </div>
  );
}
