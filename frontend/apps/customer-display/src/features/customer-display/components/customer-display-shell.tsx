import type { ReactNode } from "react";

export function CustomerDisplayShell({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen overflow-hidden bg-white text-[#071633]">
      <main className="grid h-full grid-rows-[76px_minmax(0,1fr)_142px] gap-5 overflow-hidden p-8">
        {children}
      </main>
    </div>
  );
}
