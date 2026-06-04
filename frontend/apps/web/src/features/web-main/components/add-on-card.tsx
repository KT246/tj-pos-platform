import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { IconBox, iconToneClass } from "../../../components/ui/icon-box";
import type { AddOn } from "../types";

export function AddOnCard({ item }: { item: AddOn }) {
  return (
    <div className="rounded-lg border border-blue-100 bg-white p-4 shadow-sm">
      <IconBox Icon={item.Icon} tone={item.tone} />
      <h3 className="mt-3 text-sm font-black text-slate-950">{item.title}</h3>
      <p className="mt-2 min-h-10 text-xs leading-5 text-slate-600">
        {item.description}
      </p>
      <p className="mt-3 text-lg font-black whitespace-nowrap text-slate-950">
        {item.price}
        <span className="font700 text-xs text-slate-500"> /month</span>
      </p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <button className="font900 h-8 rounded-md border border-blue-300 px-3 text-xs text-blue-600">
          Add
        </button>
        <Link
          href="/add-ons"
          className="font900 inline-flex items-center gap-1 text-xs text-blue-600"
        >
          More
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

export function HomeAddOnCard({ item }: { item: AddOn }) {
  return (
    <div className="rounded-lg border border-blue-100 bg-white p-3 shadow-sm">
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ring-1 ${iconToneClass(item.tone)}`}
      >
        <item.Icon className="h-4 w-4" />
      </span>
      <h3 className="mt-2 min-h-8 text-xs font-black text-slate-950">{item.title}</h3>
      <p className="mt-1 min-h-7 text-[10px] leading-4 text-slate-600">
        {item.description}
      </p>
      <p className="mt-2 text-sm font-black whitespace-nowrap text-slate-950">
        {item.price}
        <span className="font700 text-[10px] text-slate-500"> /month</span>
      </p>
      <button className="font900 mt-2 h-7 w-full rounded-md border border-blue-300 text-[11px] text-blue-600">
        Add
      </button>
    </div>
  );
}
