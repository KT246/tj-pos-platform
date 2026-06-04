import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "TJ POS - Smart POS for Every Business",
  description:
    "Cloud-based POS platform for retail, cafe, restaurant, beauty and hospitality businesses in Laos."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
