"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/research", label: "Research", icon: ResearchIcon },
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
        <Link href="/research" className="font-display text-sm font-semibold text-ink">
          {collapsed ? "IR" : "Inroad"}
        </Link>
      </div>

      <nav className="flex-1 px-2 py-4">
        <ul className="flex flex-col gap-1">
          {LINKS.map((link) => {
            const active = pathname?.startsWith(link.href);
            const Icon = link.icon;
            return (
              <li key={link.href}>
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
