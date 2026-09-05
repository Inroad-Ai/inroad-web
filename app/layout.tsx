import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";

import "./globals.css";

// Loaded here via next/font, self-hosted at build time. No CDN link tag.
// DM Sans is the working face: practical in dense research, controls and
// messages. DM Serif Display appears only in marketing headlines, adding a
// human, editorial note without making the product UI feel decorative.
const productFont = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-product",
});

const marketingFont = DM_Serif_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-marketing",
  weight: "400",
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
      className={`${productFont.variable} ${marketingFont.variable}`}
    >
      <body className="min-h-screen bg-paper text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
