import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Inroad",
  description:
    "Type a company domain, get its homepage, recent news and hiring signal in one pass.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-paper text-ink antialiased">{children}</body>
    </html>
  );
}
