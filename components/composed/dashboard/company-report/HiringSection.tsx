import { describeHiring } from "@/lib/companies";
import { safeHref } from "@/lib/safe-href";
import type { CompanyDetail } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { DataField } from "@/components/ui/DataField";
import { EmptyState } from "@/components/ui/EmptyState";
import { Section } from "@/components/ui/Section";

export function HiringSection({ detail }: { detail: CompanyDetail }) {
  const hiring = describeHiring(detail);
  const additionalSources = detail.latest_research?.hiring?.additional_sources ?? [];
  // Board postings come with the sourcing backend, each with its availability.
  const sourced = detail.latest_research?.research_backend === "sourcing";
  const postings = sourced ? (detail.latest_research?.hiring?.role_postings ?? []) : [];
  const careersHref = safeHref(detail.careers_url);

  return (
    <Section title="Hiring">
      <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <DataField label="Status">
          {detail.is_hiring === null ? (
            <span className="text-text-secondary">
              Could not tell
              {detail.latest_research?.not_collected?.hiring ? (
                <span className="mt-1 block text-xs">
                  {detail.latest_research.not_collected.hiring}
                </span>
              ) : null}
            </span>
          ) : detail.is_hiring ? (
            "Hiring"
          ) : (
            <span className="text-text-secondary">Not hiring</span>
          )}
        </DataField>
        {/* null ("could not count") and 0 ("counted, none open") read
            differently here, the same way they do in the table. */}
        <DataField label="Open roles">
          <span className={hiring.muted ? "text-text-secondary" : ""}>{hiring.label}</span>
        </DataField>
        <DataField label="Board">
          {detail.hiring_source ?? <span className="text-text-secondary">Unknown</span>}
        </DataField>
        <DataField label="Careers page">
          {careersHref ? (
            <a
              href={careersHref}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-signal-teal underline decoration-signal-teal/30 underline-offset-4"
            >
              {detail.careers_url}
            </a>
          ) : (
            <span className="text-text-secondary">None found</span>
          )}
        </DataField>
      </dl>

      {postings.length > 0 ? (
        <div className="mt-6">
          <p className="utility-label font-sans-semibold text-text-secondary">
            Open roles on the company&apos;s job board
          </p>
          <ul className="mt-2 space-y-2">
            {postings.map((posting, index) => (
              <li key={`${posting.title}-${index}`} className="text-sm text-ink">
                {safeHref(posting.url) ? (
                  <a
                    href={safeHref(posting.url) ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-signal-teal underline decoration-signal-teal/30 underline-offset-4"
                  >
                    {posting.title}
                  </a>
                ) : (
                  posting.title
                )}
                {[posting.department, posting.location].filter(Boolean).length > 0 ? (
                  <span className="text-text-secondary">
                    {" "}
                    {[posting.department, posting.location].filter(Boolean).join(" · ")}
                  </span>
                ) : null}
                {posting.availability !== "not_seen_in_latest_scan" ? null : (
                  <span className="ml-2 text-xs text-text-secondary">
                    not in the board&apos;s latest listing
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-6">
          <p className="utility-label font-sans-semibold text-text-secondary">Open roles</p>
          {detail.sample_roles.length === 0 ? (
            <EmptyState className="mt-2">No role titles came back with the last run.</EmptyState>
          ) : (
            <ul className="mt-2 space-y-1.5">
              {detail.sample_roles.map((role) => (
                <li key={role} className="text-sm text-ink">
                  {role}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {additionalSources.length > 0 ? (
        <div className="mt-6">
          <p className="utility-label font-sans-semibold text-text-secondary">Also listed on</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {additionalSources.map((source) => (
              <Badge key={source} tone="neutral">
                {source}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}
    </Section>
  );
}
