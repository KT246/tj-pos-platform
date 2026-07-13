import { Outlet } from "react-router-dom"

import { PosSidebar } from "@/features/pos/components/pos-sidebar"
import { cafePosConfig } from "@/features/pos/pos-types/cafe/config"

export function PosLayout() {
  return (
    <div className="flex h-screen min-w-[1024px] overflow-hidden bg-[#f3efe7]">
      <PosSidebar config={cafePosConfig} />
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  )
}
