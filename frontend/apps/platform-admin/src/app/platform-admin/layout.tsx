import type { ReactNode } from "react";

import { AdminShell } from "../../features/platform-admin/layouts/admin-shell";

export default function Layout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
