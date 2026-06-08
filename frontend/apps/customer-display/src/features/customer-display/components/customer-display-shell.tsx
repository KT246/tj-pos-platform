import type { ReactNode } from "react";

export function CustomerDisplayShell({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen overflow-hidden bg-white text-[#071633]">
      <main className="grid h-full grid-rows-[clamp(58px,8vh,76px)_minmax(0,1fr)_clamp(96px,13vh,142px)] gap-[clamp(12px,2vh,20px)] overflow-hidden p-[clamp(16px,2.1vw,32px)]">
        {children}
      </main>
    </div>
  );
}
