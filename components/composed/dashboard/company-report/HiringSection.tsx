import { describeHiring } from "@/lib/companies";
import type { CompanyDetail } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { DataField } from "@/components/ui/DataField";
import { Eyebrow } from "@/components/ui/Eyebrow";

import { DashboardPanel } from "../DashboardPanel";
import { ExternalLink } from "./ExternalLink";
import { HiringRoles } from "./HiringRoles";

export function HiringSection({ detail }: { detail: CompanyDetail }) {
  const hiring = describeHiring(detail);
  const additionalSources = detail.latest_research?.hiring?.additional_sources ?? [];
  // Board postings come with the sourcing backend, each with its availability.
  const sourced = detail.latest_research?.research_backend === "sourcing";
  const postings = sourced ? (detail.latest_research?.hiring?.role_postings ?? []) : [];
  const notCollectedReason = detail.latest_research?.not_collected?.hiring;

  return (
    <DashboardPanel
      title="Hiring"
      meta={
        <Badge tone={hiring.muted ? "neutral" : "teal"} dot>
          {hiring.label}
        </Badge>
      }
    >
      <dl className="grid gap-5 sm:grid-cols-3">
        <DataField label="Status">
          {detail.is_hiring === null ? (
            <span className="text-ink-muted">
              Could not tell
              {notCollectedReason ? (
                <span className="mt-1 block text-xs">{notCollectedReason}</span>
              ) : null}
            </span>
          ) : detail.is_hiring ? (
            "Hiring"
          ) : (
            <span className="text-ink-muted">Not hiring</span>
          )}
        </DataField>
        <DataField label="Board">
          {detail.hiring_source ?? <span className="text-ink-muted">Unknown</span>}
        </DataField>
        <DataField label="Careers page">
          {detail.careers_url ? (
            <ExternalLink href={detail.careers_url} className="break-all">
              {detail.careers_url}
            </ExternalLink>
          ) : (
            <span className="text-ink-muted">None found</span>
          )}
        </DataField>
      </dl>

      {detail.matched_role_title ? (
        <p className="mt-6 rounded-nest bg-signal-teal-subtle px-3 py-2.5 text-sm text-ink">
          <span className="font-sans-bold text-signal-teal">Matched role</span>{" "}
          <ExternalLink href={detail.matched_role_url}>{detail.matched_role_title}</ExternalLink>
          {detail.matched_posted_text ? (
            <span className="text-ink-muted">, {detail.matched_posted_text}</span>
          ) : null}
        </p>
      ) : null}

      <HiringRoles postings={postings} sampleRoles={detail.sample_roles} />

      {additionalSources.length > 0 ? (
        <div className="mt-6">
          <Eyebrow as="h3">Also listed on</Eyebrow>
          <div className="mt-2 flex flex-wrap gap-2">
            {additionalSources.map((source) => (
              <Badge key={source} tone="neutral">
                {source}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}
    </DashboardPanel>
  );
}
