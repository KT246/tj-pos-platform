import type { LucideIcon } from "lucide-react";

import { FooterLineArt } from "./display-illustrations";
import { lo } from "../utils/lao-labels";

export function DisplayFooterNote({
  title,
  subtitle,
  icon: Icon
}: {
  title: string;
  subtitle: string;
  icon: LucideIcon;
}) {
  return (
    <section className="relative flex h-[142px] shrink-0 items-center overflow-hidden rounded-[20px] border border-blue-200 bg-gradient-to-r from-blue-50 via-white to-blue-50 px-16 shadow-[0_12px_30px_rgba(13,91,255,0.06)]">
      <div className="flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-full bg-white text-blue-600 shadow-[0_12px_28px_rgba(13,91,255,0.18)]">
        <Icon className="h-[52px] w-[52px]" strokeWidth={2.4} />
      </div>
      <div className="ml-12 min-w-0">
        <h3 className="text-[35px] font-black leading-tight text-blue-600">
          {lo(title)}
        </h3>
        <p className="mt-3 text-[23px] font-medium text-slate-600">
          {lo(subtitle)}
        </p>
      </div>
      <div className="pointer-events-none absolute right-10 bottom-[-12px] h-[150px] w-[340px] opacity-70">
        <FooterLineArt />
      </div>
    </section>
  );
}
