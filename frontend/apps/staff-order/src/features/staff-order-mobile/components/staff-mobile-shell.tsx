import type { ReactNode } from "react";

export function StaffMobileShell({
  children,
  bottomNav
}: {
  children: ReactNode;
  bottomNav?: ReactNode;
}) {
  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[#eef5ff] text-slate-950">
      <section className="mx-auto flex h-full w-full max-w-[430px] flex-col overflow-hidden bg-white shadow-[0_0_0_1px_rgba(191,219,254,0.85)] sm:my-4 sm:h-[calc(100dvh-32px)] sm:rounded-lg sm:border sm:border-blue-100 sm:shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
        {children}
        {bottomNav ? (
          <div className="shrink-0 border-t border-blue-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/86">
            {bottomNav}
          </div>
        ) : null}
      </section>
    </div>
  );
}

export function StaffScrollArea({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-0 flex-1 [scrollbar-width:none] overflow-y-auto px-4 pb-5 sm:px-5 [&::-webkit-scrollbar]:hidden">
      {children}
    </div>
  );
}
