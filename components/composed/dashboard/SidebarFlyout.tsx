"use client";

import Link from "next/link";

export interface FlyoutItem {
  href: string;
  label: string;
  icon: () => JSX.Element;
  active: boolean;
}

/**
 * A second, full-height sidebar column that docks flush against the rail
 * and overlays the page (backdrop-blurred, not reflowed) - not a floating
 * dropdown. This is the reusable piece: any rail item that groups more
 * than one page renders one of these with its own items, rather than each
 * one growing its own bespoke panel.
 *
 * `leftOffsetClassName` positions it flush against whatever the rail's
 * current rendered width is - passed in rather than computed here, since
 * that width itself depends on the collapsed/responsive state the rail
 * already owns.
 */
export function SidebarFlyout({
  open,
  onClose,
  title,
  items,
  leftOffsetClassName,
  onNavigate,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  items: FlyoutItem[];
  leftOffsetClassName: string;
  onNavigate?: () => void;
}) {
  if (!open) return null;

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 z-30 bg-ink/10 backdrop-blur-sm"
      />
      <div
        role="menu"
        aria-label={title}
        className={`fixed inset-y-0 z-30 flex w-56 flex-col border-r border-line bg-surface shadow-overlay ${leftOffsetClassName}`}
      >
        <div className="flex h-16 shrink-0 items-center border-b border-line px-4">
          <span className="utility-label text-text-secondary">{title}</span>
        </div>
        <ul className="flex flex-col gap-1 p-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  role="menuitem"
                  onClick={() => {
                    onClose();
                    onNavigate?.();
                  }}
                  className={`utility-label sidebar-row ${
                    item.active
                      ? "bg-signal-teal-subtle text-signal-teal"
                      : "text-text-secondary hover:bg-surface-raised hover:text-signal-teal"
                  }`}
                >
                  <Icon />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
