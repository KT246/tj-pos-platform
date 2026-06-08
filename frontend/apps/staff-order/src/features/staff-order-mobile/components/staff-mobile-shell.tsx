import type { ReactNode } from "react";

export function StaffMobileShell({
  children,
  fixedAction,
  bottomNav
}: {
  children: ReactNode;
  fixedAction?: ReactNode;
  bottomNav?: ReactNode;
}) {
  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[#eef5ff] text-slate-950">
      <section className="mx-auto flex h-full w-full max-w-[390px] flex-col overflow-hidden bg-white shadow-[0_0_0_1px_rgba(191,219,254,0.85)]">
        {children}
        {fixedAction ? (
          <div className="shrink-0 border-t border-blue-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
            {fixedAction}
          </div>
        ) : null}
        {bottomNav ? (
          <div className="shrink-0 border-t border-blue-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
            {bottomNav}
          </div>
        ) : null}
      </section>
    </div>
  );
}

export function StaffScrollArea({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`min-h-0 flex-1 [scrollbar-width:none] overflow-y-auto px-3 pb-4 [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {children}
    </div>
  );
}
