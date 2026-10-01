"use client";

import { useState } from "react";

import { ChevronDownIcon } from "@/components/ui/Icons";

import type { NavGroup } from "./nav.types";
import { NavItem } from "./NavItem";
import { RowLabel } from "./RowLabel";

/**
 * An inline accordion, not an overlay - clicking "Pipeline" expands its
 * pages directly underneath it in the same list, the same way the rest of
 * the rail already works. Starts open if the caller is already on one of
 * its pages, so landing on /contacts directly doesn't hide where you are.
 * Reusable: the next multi-page section renders one of these with its own
 * items, not a bespoke expander.
 */
export function NavGroupAccordion({
  group,
  activeHref,
  collapsed,
  onNavigate,
}: {
  group: NavGroup;
  activeHref: string | null;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const active = group.items.some((item) => item.href === activeHref);
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
          <span className="ml-auto inline-flex">
            <ChevronDownIcon open={open} />
          </span>
        )}
      </button>

      {open ? (
        // Icon-only rail has no room to indent, so nesting reads instead as
        // a visually distinct, contained cluster (tinted, rounded) directly
        // under the trigger. With labels showing, a left indent carries the
        // hierarchy instead of a background.
        <ul
          className={`mt-1 flex flex-col gap-1 ${
            collapsed ? "rounded-md bg-surface-raised/70 py-1" : "pl-4"
          }`}
        >
          {group.items.map((item) => (
            <li key={item.href}>
              <NavItem
                link={item}
                active={item.href === activeHref}
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
