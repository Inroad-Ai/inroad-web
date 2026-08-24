"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SidebarAccount } from "@/components/composed/dashboard/SidebarAccount";
import { SidebarFlyout } from "@/components/composed/dashboard/SidebarFlyout";
import {
  BoardIcon,
  BuildingIcon,
  ChevronIcon,
  GridIcon,
  SearchIcon,
  SlidersIcon,
  UserIcon,
} from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";

interface NavLink {
  href: string;
  label: string;
  icon: () => JSX.Element;
}

interface NavGroup {
  label: string;
  icon: () => JSX.Element;
  items: NavLink[];
}

type NavEntry = NavLink | NavGroup;

const NAV: NavEntry[] = [
  { href: "/overview", label: "Overview", icon: GridIcon },
  { href: "/research", label: "Research", icon: SearchIcon },
  { href: "/companies", label: "Companies", icon: BuildingIcon },
  {
    label: "Pipeline",
    icon: BoardIcon,
    items: [
      { href: "/companies/pipeline", label: "Companies", icon: BuildingIcon },
      { href: "/contacts", label: "Contacts", icon: UserIcon },
    ],
  },
  { href: "/settings", label: "Settings", icon: SlidersIcon },
];

function isGroup(entry: NavEntry): entry is NavGroup {
  return "items" in entry;
}

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return pathname.startsWith(href);
}

/** Label only renders past the `lg` breakpoint when not collapsed - below
 * `lg` the rail is always icon-only regardless of the stored preference,
 * same reasoning as the `.sidebar-desktop .sidebar-row` override in
 * globals.css. Both branches are full literal strings on purpose: Tailwind
 * scans source text for class names, so a dynamically-glued "lg:" prefix
 * would never make it into the generated CSS. */
function RowLabel({ collapsed, children }: { collapsed: boolean; children: string }) {
  if (collapsed) return null;
  return <span className="hidden lg:inline">{children}</span>;
}

function NavItem({
  link,
  active,
  collapsed,
  onNavigate,
}: {
  link: NavLink;
  active: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const Icon = link.icon;
  return (
    <Link
      href={link.href}
      title={link.label}
      onClick={onNavigate}
      className={`utility-label sidebar-row ${
        active
          ? "bg-signal-teal-subtle text-signal-teal"
          : "text-text-secondary hover:bg-surface-raised hover:text-signal-teal"
      }`}
    >
      <Icon />
      <RowLabel collapsed={collapsed}>{link.label}</RowLabel>
    </Link>
  );
}

/** The rail row that opens a SidebarFlyout - reveals on hover (desktop
 * pointer) or click (touch/keyboard), same relationship Hunter's
 * "Sequences" rail icon has to its own sub-nav column. Stays open once
 * shown; it's the flyout's own backdrop/link clicks that close it, not a
 * mouse-leave off this one row, so moving the pointer across the gap to
 * reach the flyout doesn't dismiss it mid-move. */
function NavGroupTrigger({
  group,
  active,
  open,
  collapsed,
  onOpen,
  onToggle,
}: {
  group: NavGroup;
  active: boolean;
  open: boolean;
  collapsed: boolean;
  onOpen: () => void;
  onToggle: () => void;
}) {
  const Icon = group.icon;
  return (
    <button
      type="button"
      aria-haspopup="true"
      aria-expanded={open}
      onMouseEnter={onOpen}
      onClick={onToggle}
      title={group.label}
      className={`utility-label sidebar-row w-full text-left ${
        active || open
          ? "bg-signal-teal-subtle text-signal-teal"
          : "text-text-secondary hover:bg-surface-raised hover:text-signal-teal"
      }`}
    >
      <Icon />
      <RowLabel collapsed={collapsed}>{group.label}</RowLabel>
    </button>
  );
}

function CollapseToggleButton({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
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
  const pathname = usePathname();
  const [openGroupLabel, setOpenGroupLabel] = useState<string | null>(null);
  const mobile = variant === "mobile";
  // Mobile always reads as expanded - it's a full-width off-canvas panel,
  // there is no icon-only state for it.
  const effectiveCollapsed = mobile ? false : collapsed;
  const openGroup = NAV.find(
    (entry): entry is NavGroup => isGroup(entry) && entry.label === openGroupLabel,
  );

  const navList = (
    <ul className="flex flex-col gap-1">
      {NAV.map((entry) => {
        if (isGroup(entry)) {
          const active = entry.items.some((item) => isActive(pathname, item.href));
          const open = openGroupLabel === entry.label;
          return (
            <li key={entry.label}>
              <NavGroupTrigger
                group={entry}
                active={active}
                open={open}
                collapsed={effectiveCollapsed}
                onOpen={() => setOpenGroupLabel(entry.label)}
                onToggle={() => setOpenGroupLabel(open ? null : entry.label)}
              />
            </li>
          );
        }
        return (
          <li key={entry.href}>
            <NavItem
              link={entry}
              active={isActive(pathname, entry.href)}
              collapsed={effectiveCollapsed}
              onNavigate={onNavigate}
            />
          </li>
        );
      })}
    </ul>
  );

  const flyout = openGroup ? (
    <SidebarFlyout
      open
      onClose={() => setOpenGroupLabel(null)}
      title={openGroup.label}
      leftOffsetClassName={
        mobile ? "left-0" : collapsed ? "left-16" : "left-16 lg:left-56"
      }
      onNavigate={onNavigate}
      items={openGroup.items.map((item) => ({
        ...item,
        active: isActive(pathname, item.href),
      }))}
    />
  ) : null;

  if (mobile) {
    return (
      <>
        <div className="flex h-full flex-col bg-surface">
          <div className="flex h-16 items-center border-b border-line px-3">
            <Logo variant="full" />
          </div>
          <nav className="flex-1 px-2 pt-4">{navList}</nav>
          <div className="border-t border-line p-2">
            <SidebarAccount collapsed={false} />
          </div>
        </div>
        {flyout}
      </>
    );
  }

  return (
    <>
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
          <Link href="/" aria-label="Inroad">
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
      {flyout}
    </>
  );
}
