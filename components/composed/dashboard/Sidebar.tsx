"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SidebarAccount } from "@/components/composed/dashboard/SidebarAccount";
import {
  BoardIcon,
  BuildingIcon,
  ChevronDownIcon,
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
    // Labelled distinctly from the top-level "Companies" link above -
    // that's the plain list, these are the two stage boards.
    items: [
      { href: "/companies/pipeline", label: "Stages", icon: BoardIcon },
      { href: "/contacts", label: "People", icon: UserIcon },
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

/**
 * An inline accordion, not an overlay - clicking "Pipeline" expands its
 * pages directly underneath it in the same list, the same way the rest of
 * the rail already works. Starts open if the caller is already on one of
 * its pages, so landing on /contacts directly doesn't hide where you are.
 * Reusable: the next multi-page section renders one of these with its own
 * items, not a bespoke expander.
 */
function NavGroupAccordion({
  group,
  pathname,
  collapsed,
  onNavigate,
}: {
  group: NavGroup;
  pathname: string | null;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const active = group.items.some((item) => isActive(pathname, item.href));
  const [open, setOpen] = useState(active);
  const Icon = group.icon;

  return (
    <li>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        title={group.label}
        className={`utility-label sidebar-row w-full text-left ${
          active
            ? "bg-signal-teal-subtle text-signal-teal"
            : "text-text-secondary hover:bg-surface-raised hover:text-signal-teal"
        }`}
      >
        <Icon />
        <RowLabel collapsed={collapsed}>{group.label}</RowLabel>
        {collapsed ? null : (
          <span className="ml-auto hidden lg:inline-flex">
            <ChevronDownIcon open={open} />
          </span>
        )}
      </button>

      {open ? (
        <ul className="mt-1 flex flex-col gap-1 pl-4">
          {group.items.map((item) => (
            <li key={item.href}>
              <NavItem
                link={item}
                active={isActive(pathname, item.href)}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            </li>
          ))}
        </ul>
      ) : null}
    </li>
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
  const mobile = variant === "mobile";
  // Mobile always reads as expanded - it's a full-width off-canvas panel,
  // there is no icon-only state for it.
  const effectiveCollapsed = mobile ? false : collapsed;

  const navList = (
    <ul className="flex flex-col gap-1">
      {NAV.map((entry) => {
        if (isGroup(entry)) {
          return (
            <NavGroupAccordion
              key={entry.label}
              group={entry}
              pathname={pathname}
              collapsed={effectiveCollapsed}
              onNavigate={onNavigate}
            />
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
  );
}
