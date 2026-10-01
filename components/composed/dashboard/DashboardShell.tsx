"use client";

import type { ReactNode } from "react";

import { DashboardHeader } from "@/components/composed/dashboard/DashboardHeader";
import { Sidebar } from "@/components/composed/dashboard/Sidebar";
import { useSidebarCollapsed } from "@/hooks/useSidebarCollapsed";
import { ResearchRunsProvider } from "@/lib/research-runs";

export function DashboardShell({ children }: { children: ReactNode }) {
  const { collapsed, toggle } = useSidebarCollapsed();

  return (
    <ResearchRunsProvider>
      <div className="flex min-h-screen">
        <Sidebar collapsed={collapsed} onToggle={toggle} />
        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardHeader />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </ResearchRunsProvider>
  );
}
