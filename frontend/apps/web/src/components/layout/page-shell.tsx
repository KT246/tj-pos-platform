import type { PageShellProps } from "../../lib/routes";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function PageShell({ active, children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <SiteHeader active={active} />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
