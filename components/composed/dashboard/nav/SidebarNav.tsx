"use client";

import { usePathname } from "next/navigation";

import { NAV_SECTIONS } from "./nav.constants";
import { findActiveHref, navLinks } from "./nav-utils";
import { NavItem } from "./NavItem";

const NAV_HREFS = navLinks(NAV_SECTIONS).map((link) => link.href);

export function SidebarNav({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const activeHref = findActiveHref(usePathname(), NAV_HREFS);

  return (
    <div className="flex flex-col gap-1">
      {NAV_SECTIONS.map((section, index) => (
        <div key={section.label} role="group" aria-label={section.label}>
          {collapsed ? (
            index > 0 ? (
              <hr className="mx-2 my-3 border-line" />
            ) : null
          ) : (
            <p
              aria-hidden
              className={`utility-label px-3 pb-2 text-ink-faint ${index === 0 ? "pt-1" : "pt-5"}`}
            >
              {section.label}
            </p>
          )}
          <ul className="flex flex-col gap-1">
            {section.items.map((link) => (
              <li key={link.href}>
                <NavItem
                  link={link}
                  active={link.href === activeHref}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
