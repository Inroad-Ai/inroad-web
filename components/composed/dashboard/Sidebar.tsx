"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SidebarAccount } from "@/components/composed/dashboard/SidebarAccount";
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
  items: NavLink[];
}

type NavEntry = NavLink | NavGroup;

const NAV: NavEntry[] = [
  { href: "/overview", label: "Overview", icon: GridIcon },
  { href: "/research", label: "Research", icon: SearchIcon },
  {
    label: "Companies",
    items: [
      { href: "/companies", label: "All companies", icon: BuildingIcon },
      { href: "/companies/pipeline", label: "Pipeline", icon: BoardIcon },
    ],
  },
  { href: "/contacts", label: "Contacts", icon: UserIcon },
  { href: "/settings", label: "Settings", icon: SlidersIcon },
];

function isGroup(entry: NavEntry): entry is NavGroup {
  return "items" in entry;
}

/**
 * Top-level items match on prefix, so a future subroute (e.g. a settings
 * tab) still highlights its parent. Group children match exactly — without
 * that, "/companies/pipeline" would also light up "All companies", since it
 * starts with "/companies".
 */
function isActive(pathname: string | null, href: string, exact: boolean): boolean {
  if (!pathname) return false;
  return exact ? pathname === href : pathname.startsWith(href);
}

function NavItem({
  link,
  active,
  collapsed,
}: {
  link: NavLink;
  active: boolean;
  collapsed: boolean;
}) {
  const Icon = link.icon;
  return (
    <Link
      href={link.href}
      title={collapsed ? link.label : undefined}
      className={`utility-label sidebar-row ${collapsed ? "sidebar-row-collapsed" : ""} ${
        active
          ? "bg-signal-teal-subtle text-signal-teal"
          : "text-text-secondary hover:bg-surface-raised hover:text-signal-teal"
      }`}
    >
      <Icon />
      {collapsed ? null : link.label}
    </Link>
  );
}

/** Sits beside the logo when expanded and on its own row when collapsed,
 * where a 32px mark and a button will not both fit the 64px header. */
function CollapseToggle({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
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
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={`sticky top-0 flex h-screen shrink-0 flex-col border-r border-line bg-surface transition-[width] duration-200 ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      <div
        className={`flex h-16 items-center border-b border-line px-3 ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        <Link href="/" aria-label="Inroad">
          <Logo variant={collapsed ? "mark" : "full"} />
        </Link>
        {collapsed ? null : <CollapseToggle collapsed={collapsed} onToggle={onToggle} />}
      </div>

      {collapsed ? (
        <div className="flex justify-center pt-3">
          <CollapseToggle collapsed={collapsed} onToggle={onToggle} />
        </div>
      ) : null}

      <nav className={`flex-1 px-2 pb-4 ${collapsed ? "pt-2" : "pt-4"}`}>
        <ul className="flex flex-col gap-1">
          {NAV.map((entry) => {
            if (!isGroup(entry)) {
              return (
                <li key={entry.href}>
                  <NavItem
                    link={entry}
                    active={isActive(pathname, entry.href, false)}
                    collapsed={collapsed}
                  />
                </li>
              );
            }

            return (
              <li key={entry.label} className={collapsed ? "" : "mt-3"}>
                {collapsed ? null : (
                  <p className="utility-label px-3 pb-1 text-text-secondary/60">
                    {entry.label}
                  </p>
                )}
                <ul className="flex flex-col gap-1">
                  {entry.items.map((link) => (
                    <li key={link.href}>
                      <NavItem
                        link={link}
                        active={isActive(pathname, link.href, true)}
                        collapsed={collapsed}
                      />
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-line p-2">
        <SidebarAccount collapsed={collapsed} />
      </div>
    </aside>
  );
}
