import { IconBox } from "../../../components/ui/icon-box";
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
