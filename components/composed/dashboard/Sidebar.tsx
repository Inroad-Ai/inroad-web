"use client";

import Link from "next/link";

import { ChevronIcon } from "@/components/ui/Icons";
import { IconButton } from "@/components/ui/IconButton";
import { Logo } from "@/components/ui/Logo";

import { DASHBOARD_HOME } from "./nav/nav.constants";
import { SidebarNav } from "./nav/SidebarNav";

function CollapseToggleButton({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <IconButton label={collapsed ? "Expand sidebar" : "Collapse sidebar"} onClick={onToggle}>
      <ChevronIcon isFlipped={collapsed} />
    </IconButton>
  );
}

/** Desktop rail. Below `lg` navigation lives in MobileNav instead. */
export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return (
    <aside
      className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-line bg-surface transition-[width] duration-200 lg:flex ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      <div
        className={`flex h-16 items-center border-b border-line px-3 ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        <Link href={DASHBOARD_HOME} aria-label="Inroad">
          <Logo variant={collapsed ? "mark" : "full"} />
        </Link>
        {collapsed ? null : <CollapseToggleButton collapsed={collapsed} onToggle={onToggle} />}
      </div>

      {collapsed ? (
        <div className="flex justify-center pt-3">
          <CollapseToggleButton collapsed={collapsed} onToggle={onToggle} />
        </div>
      ) : null}

      <nav className={`flex-1 px-2 pb-4 ${collapsed ? "pt-2" : "pt-4"}`}>
        <SidebarNav collapsed={collapsed} />
      </nav>
    </aside>
  );
}
