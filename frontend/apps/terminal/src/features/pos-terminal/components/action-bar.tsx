import { Link } from "react-router-dom";

import type { QuickAction } from "../types";
import { getBusinessPath } from "../utils";
import { lo } from "../utils/lao-labels";

const toneClasses: Record<QuickAction["tone"], string> = {
  blue: "border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100",
  orange: "border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100",
  violet: "border-violet-200 bg-violet-50 text-violet-600 hover:bg-violet-100",
  slate: "border-blue-100 bg-white text-slate-600 hover:bg-blue-50"
};

export function ActionBar({
  businessSlug,
  actions,
  onAction
}: {
  businessSlug: string;
  actions: QuickAction[];
  onAction: (label: string) => void;
}) {
  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_0.55fr]">
      {actions.map((action) => {
        const Icon = action.icon;
        const body = (
          <>
            <Icon className="h-4 w-4" />
            <span className="truncate">{lo(action.label)}</span>
          </>
        );
        const className = `flex h-11 items-center justify-center gap-2 rounded-lg border px-3 text-[12px] font-black shadow-[0_8px_18px_rgba(15,23,42,0.03)] transition hover:-translate-y-0.5 ${toneClasses[action.tone]}`;

        if (action.href) {
          return (
            <Link
              key={action.label}
              to={getBusinessPath(businessSlug, action.href)}
              className={className}
            >
              {body}
            </Link>
          );
        }

        return (
          <button
            key={action.label}
            type="button"
            onClick={() => onAction(action.label)}
            className={className}
          >
            {body}
          </button>
        );
      })}
    </div>
  );
}
