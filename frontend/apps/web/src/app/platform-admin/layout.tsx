import { AdminShell } from "@/features/platform-admin/components/admin-shell"

export default function PlatformAdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AdminShell>{children}</AdminShell>
}
