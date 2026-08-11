"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
      <circle cx="7" cy="7" r="4.5" />
      <path d="M13 13l-2.7-2.7" strokeLinecap="round" />
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
      <path d="M3 14.25V2.75a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v11.5" strokeLinejoin="round" />
      <path d="M9 6.75h3.5a.5.5 0 0 1 .5.5v7" strokeLinejoin="round" />
      <path d="M5 5h1.2M5 7.5h1.2M5 10h1.2" strokeLinecap="round" />
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
      <rect x="1.75" y="2.5" width="3.5" height="11" rx="1" />
      <rect x="6.25" y="2.5" width="3.5" height="7.5" rx="1" />
      <rect x="10.75" y="2.5" width="3.5" height="4.5" rx="1" />
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
      <circle cx="8" cy="8" r="2.25" />
      <path
        d="M8 1.5v1.6M8 12.9v1.6M14.5 8h-1.6M3.1 8H1.5M12.5 3.5l-1.1 1.1M4.6 11.4l-1.1 1.1M12.5 12.5l-1.1-1.1M4.6 4.6 3.5 3.5"
        strokeLinecap="round"
      />
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
      className={`utility-label flex items-center gap-3 rounded-full px-3 py-2 transition-colors ${
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
      <div className="flex h-16 items-center border-b border-line px-4">
        <Link href="/overview" aria-label="Inroad">
          <Logo variant={collapsed ? "mark" : "full"} />
        </Link>
      </div>

      <nav className="flex-1 px-2 py-4">
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
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex w-full items-center justify-center gap-2 rounded-full px-3 py-2 text-text-secondary transition-colors hover:bg-surface-raised hover:text-signal-teal"
        >
          <ChevronIcon collapsed={collapsed} />
          {collapsed ? null : <span className="utility-label">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
