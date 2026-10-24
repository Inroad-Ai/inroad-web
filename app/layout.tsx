import type { Metadata } from "next";
import { DM_Mono, DM_Sans } from "next/font/google";

import { ThemeSync } from "@/components/composed/ThemeSync";
import { THEME_INIT_SCRIPT } from "@/lib/theme/theme-init-script";

import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Inroad",
  description:
    "Type a company domain, get its homepage, recent news and hiring signal in one pass.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the init script sets data-theme before React hydrates.
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-paper text-ink antialiased">
        <ThemeSync />
        {children}
      </body>
    </html>
  );
}
