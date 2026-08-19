import { describeHiring } from "@/lib/companies";
import type { CompanyDetail } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { DataField } from "@/components/ui/DataField";
import { EmptyState } from "@/components/ui/EmptyState";
import { Section } from "@/components/ui/Section";

export function HiringSection({ detail }: { detail: CompanyDetail }) {
  const hiring = describeHiring(detail);
  const additionalSources = detail.latest_research?.hiring?.additional_sources ?? [];

  return (
    <Section title="Hiring">
      <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <DataField label="Status">
          {detail.is_hiring === null ? (
            <span className="text-text-secondary">Could not tell</span>
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
          {detail.careers_url ? (
            <a
              href={detail.careers_url}
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

      <div className="mt-6">
        <p className="utility-label text-text-secondary/70">Open roles</p>
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

      {additionalSources.length > 0 ? (
        <div className="mt-6">
          <p className="utility-label text-text-secondary/70">Also listed on</p>
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
