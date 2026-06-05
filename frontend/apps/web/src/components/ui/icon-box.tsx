import type { LucideIcon } from "lucide-react";

export function iconToneClass(tone: string) {
  const tones: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 ring-blue-100",
    teal: "bg-teal-50 text-teal-600 ring-teal-100",
    green: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    orange: "bg-orange-50 text-orange-600 ring-orange-100",
    purple: "bg-violet-50 text-violet-600 ring-violet-100",
    pink: "bg-fuchsia-50 text-fuchsia-600 ring-fuchsia-100",
    cyan: "bg-cyan-50 text-cyan-600 ring-cyan-100"
  };

  return tones[tone] ?? tones.blue;
}

export function IconBox({ Icon, tone }: { Icon: LucideIcon; tone: string }) {
  return (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ring-1 transition duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:scale-100 ${iconToneClass(tone)}`}
    >
      <Icon className="h-5 w-5" />
    </span>
  );
}
