import { motion } from "framer-motion"
import { useLocation } from "react-router-dom"

import { OrdersTopbar } from "@/features/pos/components/orders/orders-topbar"
import { cafePosConfig } from "@/features/pos/pos-types/cafe/config"

export function PosPlaceholderPage() {
  const config = cafePosConfig
  const location = useLocation()
  const item = config.sidebarItems.find((sidebarItem) => sidebarItem.href === location.pathname)
  const title = item?.label ?? "Coffee Time POS"

  return (
    <main className="h-screen overflow-hidden bg-[#efe7dc] text-[#3b2511]">
      <div className="flex h-full min-w-[1180px]">
        <section className="flex min-w-0 flex-1 flex-col">
          <OrdersTopbar />

          <div className="min-h-0 flex-1 p-3">
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex h-full flex-col items-center justify-center rounded-2xl border border-[#eadfce] bg-white text-center shadow-[0_18px_40px_rgba(80,54,27,0.1)]"
            >
              <div className="rounded-full bg-[#fbf4ea] px-5 py-2 text-sm font-black text-[#8a5f36]">
                Coffee Time POS
              </div>
              <h1 className="mt-5 text-[34px] font-black tracking-tight text-[#3b2511]">
                {title}
              </h1>
              <p className="mt-3 max-w-[520px] text-base font-semibold text-[#7c6448]">
                Trang này đã có trong menu chính. Phần giao diện chi tiết sẽ được
                phát triển theo luồng cafe POS tiếp theo.
              </p>
            </motion.section>
          </div>
        </section>
      </div>
    </main>
  )
}
