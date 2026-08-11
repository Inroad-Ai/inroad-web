import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";

import "./globals.css";

// Loaded here via next/font, self-hosted at build time. No CDN link tag.
// Plus Jakarta Sans, not Geist: Geist isn't in this Next.js version's
// bundled Google Fonts data yet. Same rounded-geometric feel.
const displayFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Inroad",
  description:
    "Type a company domain, get its homepage, recent news and hiring signal in one pass.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${inter.variable}`}
    >
      <body className="min-h-screen bg-paper text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
