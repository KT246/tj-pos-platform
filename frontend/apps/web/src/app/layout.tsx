import type { Metadata } from "next";
import { Inter, Noto_Sans_Lao } from "next/font/google";
import type { ReactNode } from "react";

import { LanguageProvider } from "../lib/i18n";
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
  title: "TJ POS - Smart POS for Every Business",
  description:
    "Cloud-based POS platform for retail, cafe, restaurant, beauty and hospitality businesses in Laos."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${notoSansLao.variable}`}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
