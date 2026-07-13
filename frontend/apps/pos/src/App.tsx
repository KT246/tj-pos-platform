import { QueryClientProvider } from "@tanstack/react-query"

import { AppRouter } from "@/routes/app-router"
import { PosToastViewport } from "@/features/pos/components/notifications/pos-notification-ui"
import { queryClient } from "@/lib/query-client"

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
      <PosToastViewport />
    </QueryClientProvider>
  )
}
