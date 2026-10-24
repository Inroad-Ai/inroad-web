"use client";

import Link from "next/link";

import { ChevronIcon } from "@/components/ui/Icons";
import { IconButton } from "@/components/ui/IconButton";
import { Logo } from "@/components/ui/Logo";
import type { Profile } from "@/lib/api-client/client";

import { DASHBOARD_HOME } from "./nav/nav.constants";
import { SidebarNav } from "./nav/SidebarNav";
import { SidebarProfileCard } from "./shell/SidebarProfileCard";

/** Desktop rail. Below `lg` navigation lives in MobileNav instead. */
export function Sidebar({
  collapsed,
  onToggle,
  profile,
  profileLoading,
}: {
  collapsed: boolean;
  onToggle: () => void;
  profile: Profile | null;
  profileLoading: boolean;
}) {
  const toggle = (
    <IconButton label={collapsed ? "Expand sidebar" : "Collapse sidebar"} onClick={onToggle}>
      <ChevronIcon isFlipped={collapsed} />
    </IconButton>
  );

  return (
    <aside
      className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-line bg-paper transition-width duration-base ease-standard lg:flex ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div
        className={`flex px-3 pb-4 pt-5 ${
          collapsed ? "flex-col items-center gap-3" : "items-center justify-between pl-4"
        }`}
      >
        <Link href={DASHBOARD_HOME} aria-label="Inroad, overview">
          <Logo variant={collapsed ? "mark" : "full"} />
        </Link>
        {toggle}
      </div>

      <nav aria-label="Main" className="flex-1 overflow-y-auto overflow-x-hidden px-3 pb-4">
        <SidebarNav collapsed={collapsed} />
      </nav>

      <div className="px-3 pb-4">
        <SidebarProfileCard profile={profile} loading={profileLoading} collapsed={collapsed} />
      </div>
    </aside>
  );
}
