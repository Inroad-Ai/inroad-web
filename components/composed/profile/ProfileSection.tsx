import type { ReactNode } from "react";

import { DashboardPanel } from "@/components/composed/dashboard/DashboardPanel";

import type { ProfileNavItem } from "./ProfileSectionNav";

/** A profile card the section nav can jump to. */
export function ProfileSection({
  section: { id, label },
  meta,
  children,
}: {
  section: ProfileNavItem;
  meta?: ReactNode;
  children: ReactNode;
}) {
  return (
    <DashboardPanel
      id={id}
      title={label}
      meta={meta ? <span className="utility-label text-ink-muted">{meta}</span> : undefined}
    >
      {children}
    </DashboardPanel>
  );
}
