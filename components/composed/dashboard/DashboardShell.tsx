"use client";

import type { ReactNode } from "react";

import { DashboardFooter } from "@/components/composed/dashboard/DashboardFooter";
import { DashboardHeader } from "@/components/composed/dashboard/DashboardHeader";
import { MobileNav } from "@/components/composed/dashboard/MobileNav";
import { Sidebar } from "@/components/composed/dashboard/Sidebar";
import { useMobileNav } from "@/hooks/useMobileNav";
import { useProfile } from "@/hooks/useProfile";
import { useSidebarCollapsed } from "@/hooks/useSidebarCollapsed";
import { ResearchRunsProvider } from "@/lib/research-runs";

import { CommandPalette } from "./command-palette/CommandPalette";
import { useCommandPalette } from "./command-palette/useCommandPalette";

export function DashboardShell({ children }: { children: ReactNode }) {
  const { collapsed, toggle } = useSidebarCollapsed();
  const mobileNav = useMobileNav();
  const palette = useCommandPalette();
  // Loaded once for the whole shell: the rail card, the drawer and the
  // account menu all show the same person.
  const { profile, loading: profileLoading } = useProfile();

  return (
    <ResearchRunsProvider>
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-1/4 -top-1/3 h-2/3 w-2/3 bg-glow-teal blur-3xl" />
        <div className="absolute -bottom-1/3 left-0 h-1/2 w-1/2 bg-glow-ember blur-3xl" />
      </div>
      <div className="relative flex min-h-screen">
        <Sidebar
          collapsed={collapsed}
          onToggle={toggle}
          profile={profile}
          profileLoading={profileLoading}
        />
        <MobileNav
          open={mobileNav.open}
          onClose={mobileNav.closeNav}
          profile={profile}
          profileLoading={profileLoading}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardHeader
            onOpenNav={mobileNav.openNav}
            onOpenPalette={palette.openPalette}
            profile={profile}
          />
          <main className="flex-1">{children}</main>
          <DashboardFooter />
        </div>
      </div>
      <CommandPalette open={palette.open} onClose={palette.closePalette} />
    </ResearchRunsProvider>
  );
}
