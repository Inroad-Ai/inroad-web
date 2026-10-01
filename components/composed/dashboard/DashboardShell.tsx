"use client";

import type { ReactNode } from "react";

import { DashboardHeader } from "@/components/composed/dashboard/DashboardHeader";
import { MobileNav } from "@/components/composed/dashboard/MobileNav";
import { Sidebar } from "@/components/composed/dashboard/Sidebar";
import { ThemeSync } from "@/components/composed/dashboard/ThemeSync";
import { useMobileNav } from "@/hooks/useMobileNav";
import { useSidebarCollapsed } from "@/hooks/useSidebarCollapsed";
import { ResearchRunsProvider } from "@/lib/research-runs";

export function DashboardShell({ children }: { children: ReactNode }) {
  const { collapsed, toggle } = useSidebarCollapsed();
  const mobileNav = useMobileNav();

  return (
    <ResearchRunsProvider>
      <ThemeSync />
      <div className="flex min-h-screen">
        <Sidebar collapsed={collapsed} onToggle={toggle} />
        <MobileNav open={mobileNav.open} onClose={mobileNav.closeNav} />
        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardHeader onOpenNav={mobileNav.openNav} />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </ResearchRunsProvider>
  );
}
