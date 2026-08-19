import type { Company, CompanyProfile } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { DataField } from "@/components/ui/DataField";
import { EmptyState } from "@/components/ui/EmptyState";
import { Section } from "@/components/ui/Section";

/** Narrative fields in reading order: what they do, then why that matters
 * to whoever is about to write to them, then the factual footnotes. */
const NARRATIVE_FIELDS: { key: keyof CompanyProfile; label: string }[] = [
  { key: "what_it_does", label: "What they do" },
  { key: "problem_solved", label: "Problem they solve" },
  { key: "introduction", label: "Introduction" },
  { key: "biggest_challenge", label: "Biggest challenge right now" },
  { key: "why_reach_out_now", label: "Why reach out now" },
  { key: "company_size", label: "Company size" },
  { key: "funding", label: "Funding" },
];

export function ProfileSection({ detail }: { detail: Company }) {
  const profile = detail.profile;

  if (profile === null) {
    return (
      <Section title="Profile">
        <EmptyState>
          Not enough was found on the last run to write a profile. Run research again to try.
        </EmptyState>
      </Section>
    );
  }

  const written = NARRATIVE_FIELDS.filter(({ key }) => profile[key]);

  if (written.length === 0 && profile.tech_stack.length === 0) {
    return (
      <Section title="Profile">
        <EmptyState>Nothing came back that was substantial enough to write down.</EmptyState>
      </Section>
    );
  }

  return (
    <Section title="Profile">
      <dl className="flex flex-col gap-5">
        {written.map(({ key, label }) => (
          <DataField key={key} label={label}>
            {profile[key]}
          </DataField>
        ))}
        {profile.tech_stack.length > 0 ? (
          <DataField label="Tech stack">
            <div className="flex flex-wrap gap-2">
              {profile.tech_stack.map((tech) => (
                <Badge key={tech} tone="neutral">
                  {tech}
                </Badge>
              ))}
            </div>
          </DataField>
        ) : null}
      </dl>
    </Section>
  );
}
