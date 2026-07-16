import type { Metadata } from "next"
import { Noto_Sans_Lao } from "next/font/google"

import "./globals.css"

const notoSansLao = Noto_Sans_Lao({
  subsets: ["lao"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "TJ POS Admin",
  description: "TJ POS platform administration",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="lo">
      <body className={notoSansLao.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
