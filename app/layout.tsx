import type { Metadata } from "next";
import { Fragment_Mono, Public_Sans } from "next/font/google";

import "./globals.css";

// Loaded here via next/font, self-hosted at build time. No CDN link tag.
const fragmentMono = Fragment_Mono({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fragment-mono",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-public-sans",
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
      className={`${fragmentMono.variable} ${publicSans.variable}`}
    >
      <body className="min-h-screen bg-paper text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
