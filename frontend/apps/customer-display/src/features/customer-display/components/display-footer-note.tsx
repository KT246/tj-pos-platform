import type { LucideIcon } from "lucide-react";

import { FooterLineArt } from "./display-illustrations";

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
    <section className="relative flex h-full shrink-0 items-center overflow-hidden rounded-[20px] border border-blue-200 bg-gradient-to-r from-blue-50 via-white to-blue-50 px-[clamp(24px,4vw,64px)] shadow-[0_12px_30px_rgba(13,91,255,0.06)]">
      <div className="flex h-[clamp(64px,8.6vh,88px)] w-[clamp(64px,8.6vh,88px)] shrink-0 items-center justify-center rounded-full bg-white text-blue-600 shadow-[0_12px_28px_rgba(13,91,255,0.18)]">
        <Icon className="h-[clamp(36px,5vh,52px)] w-[clamp(36px,5vh,52px)]" strokeWidth={2.4} />
      </div>
      <div className="ml-[clamp(22px,3vw,48px)] min-w-0">
        <h3 className="text-[clamp(24px,2.7vw,35px)] font-black leading-tight text-blue-600">
          {title}
        </h3>
        <p className="mt-[clamp(6px,1vh,12px)] text-[clamp(17px,1.75vw,23px)] font-medium text-slate-600">
          {subtitle}
        </p>
      </div>
      <div className="pointer-events-none absolute right-10 bottom-[-12px] h-[clamp(98px,14vh,150px)] w-[clamp(220px,24vw,340px)] opacity-70 max-[1440px]:opacity-40">
        <FooterLineArt />
      </div>
    </section>
  );
}
