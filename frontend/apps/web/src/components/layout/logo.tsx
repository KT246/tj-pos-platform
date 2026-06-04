import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="TJ POS Home">
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-sm font-black text-white italic shadow-sm">
        TJ
      </span>
      <span className="leading-none">
        <span className="block text-xl font-black tracking-normal text-blue-600">
          TJ <span className="text-slate-950">POS</span>
        </span>
        <span className="block text-[9px] font-semibold text-slate-500">
          Smart POS for Every Business
        </span>
      </span>
    </Link>
  );
}
