import { IconBox } from "../../../components/ui/icon-box";
import { iconToneClass } from "../../../components/ui/icon-box";
import type { IconCard } from "../types";

export function FeatureCard({ feature }: { feature: IconCard }) {
  return (
    <div className="rounded-lg border border-blue-100 bg-white p-4 shadow-sm">
      <div className="flex gap-3">
        <IconBox Icon={feature.Icon} tone={feature.tone} />
        <div>
          <h3 className="font900 text-sm text-slate-950">{feature.title}</h3>
          <p className="mt-1.5 text-xs leading-5 text-slate-600">
            {feature.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export function HomeFeatureItem({ feature }: { feature: IconCard }) {
  return (
    <div className="grid grid-cols-[38px_1fr] gap-3">
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-md ring-1 ${iconToneClass(feature.tone)}`}
      >
        <feature.Icon className="h-3.5 w-3.5" />
      </span>
      <div>
        <h3 className="font900 text-xs text-slate-950">{feature.title}</h3>
        <p className="mt-1 text-[10px] leading-4 text-slate-600">
          {feature.description}
        </p>
      </div>
    </div>
  );
}
