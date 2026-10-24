import type { Company, CompanyProfile } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Eyebrow } from "@/components/ui/Eyebrow";

import { DashboardPanel } from "../DashboardPanel";

/** Narrative fields in reading order: what they do, then why that matters
 * to whoever is about to write to them, then the factual footnotes. The
 * outreach hook is pulled out on top, so it isn't listed here. */
const NARRATIVE_FIELDS: { key: keyof CompanyProfile; label: string }[] = [
  { key: "what_it_does", label: "What they do" },
  { key: "problem_solved", label: "Problem they solve" },
  { key: "introduction", label: "Introduction" },
  { key: "biggest_challenge", label: "Biggest challenge right now" },
  { key: "company_size", label: "Company size" },
  { key: "funding", label: "Funding" },
];

export function ProfileSection({ detail }: { detail: Company }) {
  const profile = detail.profile;

  if (profile === null) {
    return (
      <DashboardPanel title="Profile">
        <EmptyState>
          Not enough was found on the last run to write a profile. Run research again to try.
        </EmptyState>
      </DashboardPanel>
    );
  }

  const written = NARRATIVE_FIELDS.filter(({ key }) => profile[key]);
  const whyNow = profile.why_reach_out_now;

  if (written.length === 0 && profile.tech_stack.length === 0 && !whyNow) {
    return (
      <DashboardPanel title="Profile">
        <EmptyState>Nothing came back that was substantial enough to write down.</EmptyState>
      </DashboardPanel>
    );
  }

  return (
    <DashboardPanel title="Profile">
      {whyNow ? (
        <Card variant="nested" padding="sm" className="mb-6">
          <Eyebrow as="h3" dot="static">
            Why reach out now
          </Eyebrow>
          <p className="mt-2 font-display text-lg font-sans-semibold leading-snug tracking-heading text-ink">
            {whyNow}
          </p>
        </Card>
      ) : null}

      <dl className="divide-y divide-line">
        {written.map(({ key, label }) => (
          <div key={key} className="grid gap-1 py-3 first:pt-0 sm:grid-cols-3 sm:gap-4">
            <dt className="utility-label pt-0.5 text-ink-muted">{label}</dt>
            <dd className="text-sm leading-relaxed text-ink sm:col-span-2">{profile[key]}</dd>
          </div>
        ))}
        {profile.tech_stack.length > 0 ? (
          <div className="grid gap-2 py-3 sm:grid-cols-3 sm:gap-4">
            <dt className="utility-label pt-1 text-ink-muted">Tech stack</dt>
            <dd className="flex flex-wrap gap-2 sm:col-span-2">
              {profile.tech_stack.map((tech) => (
                <Badge key={tech} tone="neutral">
                  {tech}
                </Badge>
              ))}
            </dd>
          </div>
        ) : null}
      </dl>
    </DashboardPanel>
  );
}
