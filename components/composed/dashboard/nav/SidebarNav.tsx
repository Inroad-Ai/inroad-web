"use client";

import { usePathname } from "next/navigation";

import { NAV } from "./nav.constants";
import { findActiveHref, isGroup, navHrefs } from "./nav-utils";
import { NavGroupAccordion } from "./NavGroupAccordion";
import { NavItem } from "./NavItem";

const NAV_HREFS = navHrefs(NAV);

export function SidebarNav({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const activeHref = findActiveHref(usePathname(), NAV_HREFS);

  return (
    <ul className="flex flex-col gap-1">
      {NAV.map((entry) =>
        isGroup(entry) ? (
          <NavGroupAccordion
            key={entry.label}
            group={entry}
            activeHref={activeHref}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ) : (
          <li key={entry.href}>
            <NavItem
              link={entry}
              active={entry.href === activeHref}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          </li>
        ),
      )}
    </ul>
  );
}
