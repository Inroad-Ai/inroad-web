import type { CompanyDetail } from "@/lib/types";
import { EmptyState } from "@/components/ui/EmptyState";

import { DashboardPanel } from "../DashboardPanel";
import { ExternalLink } from "./ExternalLink";

export function FittingRolesSection({ detail }: { detail: CompanyDetail }) {
  const postings = detail.latest_research?.hiring?.role_postings ?? [];
  if (postings.length === 0) return null;
  const fitting = detail.fitting_roles ?? [];

  return (
    <DashboardPanel
      title="Jobs here that fit you"
      meta={
        <span className="utility-label text-ink-faint">
          {fitting.length} of {postings.length}
        </span>
      }
    >
      {fitting.length === 0 ? (
        <EmptyState>
          None of the open jobs here fit your roles, location and work preference.
        </EmptyState>
      ) : (
        <ul className="flex flex-col gap-3">
          {fitting.map((role) => (
            <li key={role.url ?? role.title} className="flex flex-col gap-0.5">
              <ExternalLink href={role.url} className="text-sm">
                {role.title}
              </ExternalLink>
              <span className="text-xs text-ink-muted">{role.reason}</span>
            </li>
          ))}
        </ul>
      )}
    </DashboardPanel>
  );
}
