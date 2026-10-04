import Link from "next/link";

import type { NavLink } from "./nav.types";
import { RowLabel } from "./RowLabel";

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
      title={link.label}
      onClick={onNavigate}
      className={`utility-label sidebar-row ${collapsed ? "sidebar-row-collapsed" : ""} ${
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
