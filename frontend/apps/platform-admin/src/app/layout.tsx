import type { Metadata } from "next";
import { Inter, Noto_Sans_Lao } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

const inter = Inter({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-inter"
});

const notoSansLao = Noto_Sans_Lao({
  display: "swap",
  subsets: ["lao"],
  variable: "--font-noto-sans-lao"
});

export const metadata: Metadata = {
  title: "TJ POS Platform Admin",
  description: "Platform administration workspace for TJ POS."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${notoSansLao.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
