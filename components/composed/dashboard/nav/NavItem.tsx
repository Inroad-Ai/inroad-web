import Link from "next/link";

import type { NavLink } from "./nav.types";

const ROW_BASE =
  "relative flex h-10 items-center gap-3 rounded-nest text-sm font-sans-semibold transition duration-fast ease-standard";

const ACTIVE =
  "bg-surface text-ink shadow-card before:absolute before:-left-3 before:inset-y-2.5 before:w-1 before:rounded-r-full before:bg-signal-amber";

const IDLE = "text-ink-muted hover:bg-ink/5 hover:text-ink";

export function NavItem({
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
      title={collapsed ? link.label : undefined}
      aria-label={collapsed ? link.label : undefined}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      className={`${ROW_BASE} ${collapsed ? "justify-center" : "px-3"} ${active ? ACTIVE : IDLE}`}
    >
      <Icon />
      {collapsed ? null : <span className="truncate">{link.label}</span>}
    </Link>
  );
}
