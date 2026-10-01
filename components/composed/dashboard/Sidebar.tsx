"use client";

import Link from "next/link";

import { SidebarAccount } from "@/components/composed/dashboard/SidebarAccount";
import { ChevronIcon } from "@/components/ui/Icons";
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
    <button
      type="button"
      onClick={onToggle}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      className="flex items-center justify-center rounded-full p-1.5 text-text-secondary transition-colors hover:bg-surface-raised hover:text-signal-teal"
    >
      <ChevronIcon isFlipped={collapsed} />
    </button>
  );
}

export function Sidebar({
  collapsed,
  onToggle,
  variant = "desktop",
  onNavigate,
}: {
  collapsed: boolean;
  onToggle: () => void;
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
}) {
  const mobile = variant === "mobile";
  // Mobile always reads as expanded - it's a full-width off-canvas panel,
  // there is no icon-only state for it.
  const effectiveCollapsed = mobile ? false : collapsed;

  const navList = <SidebarNav collapsed={effectiveCollapsed} onNavigate={onNavigate} />;

  if (mobile) {
    return (
      <div className="flex h-full flex-col bg-surface">
        <div className="flex h-16 items-center border-b border-line px-3">
          <Logo variant="full" />
        </div>
        <nav className="flex-1 px-2 pt-4">{navList}</nav>
        <div className="border-t border-line p-2">
          <SidebarAccount collapsed={false} />
        </div>
      </div>
    );
  }

  return (
    <aside
      className={`sidebar-desktop sticky top-0 flex h-screen shrink-0 flex-col border-r border-line bg-surface transition-[width] duration-200 ${
        collapsed ? "w-16" : "w-16 lg:w-56"
      }`}
    >
      <div
        className={`flex h-16 items-center border-b border-line px-3 ${
          collapsed ? "justify-center" : "justify-center lg:justify-between"
        }`}
      >
        <Link href={DASHBOARD_HOME} aria-label="Inroad">
          {collapsed ? (
            <Logo variant="mark" />
          ) : (
            <>
              <span className="lg:hidden">
                <Logo variant="mark" />
              </span>
              <span className="hidden lg:inline-block">
                <Logo variant="full" />
              </span>
            </>
          )}
        </Link>
        {collapsed ? null : (
          <span className="hidden lg:inline-flex">
            <CollapseToggleButton collapsed={collapsed} onToggle={onToggle} />
          </span>
        )}
      </div>

      {collapsed ? (
        <div className="hidden justify-center pt-3 lg:flex">
          <CollapseToggleButton collapsed={collapsed} onToggle={onToggle} />
        </div>
      ) : null}

      <nav className={`flex-1 px-2 pb-4 ${collapsed ? "pt-2" : "pt-2 lg:pt-4"}`}>{navList}</nav>

      <div className="border-t border-line p-2">
        <SidebarAccount collapsed={collapsed} />
      </div>
    </aside>
  );
}
