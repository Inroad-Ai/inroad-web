"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SidebarAccount } from "@/components/composed/dashboard/SidebarAccount";
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

function isGroup(entry: NavEntry): entry is NavGroup {
  return "items" in entry;
}

const NAV: NavEntry[] = [
  { href: "/overview", label: "Overview", icon: OverviewIcon },
  { href: "/research", label: "Research", icon: ResearchIcon },
  {
    label: "Companies",
    items: [
      { href: "/companies", label: "All companies", icon: CompaniesIcon },
      { href: "/companies/pipeline", label: "Pipeline", icon: PipelineIcon },
    ],
  },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

/** Chevron pointing the direction the collapse toggle will move things. */
function ChevronIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path d="M10 3.5 5.5 8l4.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function OverviewIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <rect x="1.75" y="1.75" width="5.5" height="5.5" rx="1.25" />
      <rect x="8.75" y="1.75" width="5.5" height="5.5" rx="1.25" />
      <rect x="1.75" y="8.75" width="5.5" height="5.5" rx="1.25" />
      <rect x="8.75" y="8.75" width="5.5" height="5.5" rx="1.25" />
    </svg>
  );
}

function ResearchIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <circle cx="7.25" cy="7.25" r="4.5" />
      <path d="M10.6 10.6 13.75 13.75" strokeLinecap="round" />
    </svg>
  );
}

function CompaniesIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path d="M1.75 13.75h12.5" strokeLinecap="round" />
      <path d="M3.5 13.75V3a.75.75 0 0 1 .75-.75h4.5A.75.75 0 0 1 9.5 3v10.75" strokeLinejoin="round" />
      <path d="M9.5 6.75h2.25a.75.75 0 0 1 .75.75v6.25" strokeLinejoin="round" />
      <path d="M5.25 5h2M5.25 7.75h2" strokeLinecap="round" />
      <path d="M5.75 13.75v-2.5h1.5v2.5" strokeLinejoin="round" />
    </svg>
  );
}

function PipelineIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <rect x="1.75" y="2.5" width="5.5" height="11" rx="1.25" />
      <rect x="8.75" y="2.5" width="5.5" height="11" rx="1.25" />
      <path d="M3.25 5.75h2.5M10.25 5.75h2.5" strokeLinecap="round" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path d="M2 4.25h2.25M7.75 4.25H14M2 11.75h6.75M12.25 11.75H14" strokeLinecap="round" />
      <circle cx="6" cy="4.25" r="1.75" />
      <circle cx="10.5" cy="11.75" r="1.75" />
    </svg>
  );
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

/** The pale teal pill, same treatment for every item at every nesting level. */
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
      className={`utility-label flex items-center rounded-full py-2 transition-colors ${
        collapsed ? "justify-center" : "gap-3 px-3"
      } ${
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
      <ChevronIcon collapsed={collapsed} />
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
