"use client";

import { usePathname } from "next/navigation";

const TITLES: Record<string, string> = {
  "/overview": "Overview",
  "/profile": "Profile",
  "/research": "Research",
  "/companies/pipeline": "Pipeline",
  "/companies": "Companies",
  "/settings": "Settings",
};

function pageTitle(pathname: string | null): string {
  if (!pathname) return "";
  // Longest prefix first, so "/companies/pipeline" wins over "/companies".
  const match = Object.keys(TITLES)
    .sort((a, b) => b.length - a.length)
    .find((prefix) => pathname.startsWith(prefix));
  return match ? TITLES[match] : "";
}

export function DashboardHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center border-b border-line bg-surface px-6">
      <span className="font-display text-lg text-ink">{pageTitle(pathname)}</span>
    </header>
  );
}
