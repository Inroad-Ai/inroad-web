"use client";

import { useState } from "react";

import { setPrimaryContact, updatePersonStage } from "@/lib/api-client/client";
import { PERSON_ROLE_LABEL } from "@/lib/types";
import type { Company, CompanyDetail, Person } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { PERSON_STAGES, PERSON_STAGE_LABEL } from "@/components/ui/PersonStageBadge";
import type { PersonStage } from "@/components/ui/PersonStageBadge";
import { Section } from "@/components/ui/Section";

// Founders/co-founders/execs are the roles worth a second glance first;
// everyone else still shows, just without the highlight.
const HIGHLIGHTED_ROLES = new Set(["founder", "co_founder", "executive"]);

export function PeopleSection({
  detail,
  accessToken,
  onCompanyChange,
}: {
  detail: CompanyDetail;
  accessToken: () => Promise<string>;
  onCompanyChange: (company: Company) => void;
}) {
  const [people, setPeople] = useState<Person[]>(detail.people);
  const [primaryContactId, setPrimaryContactId] = useState(detail.primary_contact_id);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  async function changeStage(person: Person, stage: PersonStage) {
    setPendingId(person.id);
    setActionError("");
    try {
      const updated = await updatePersonStage(person.id, stage, await accessToken());
      setPeople((current) => current.map((p) => (p.id === updated.id ? updated : p)));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not update that person's stage.");
    } finally {
      setPendingId(null);
    }
  }

  async function toggleContact(person: Person) {
    const nextId = primaryContactId === person.id ? null : person.id;
    setPendingId(person.id);
    setActionError("");
    try {
      const company = await setPrimaryContact(detail.id, nextId, await accessToken());
      setPrimaryContactId(company.primary_contact_id);
      onCompanyChange(company);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not set the primary contact.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <Section title="People">
      {people.length === 0 ? (
        <EmptyState>No named people came back with the last run.</EmptyState>
      ) : (
        <ul className="divide-y divide-line">
          {people.map((person) => (
            <li key={person.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-ink">{person.name}</span>
                  <Badge tone={HIGHLIGHTED_ROLES.has(person.role_category) ? "teal" : "neutral"}>
                    {PERSON_ROLE_LABEL[person.role_category]}
                  </Badge>
                  {primaryContactId === person.id ? (
                    <Badge tone="amber">Primary contact</Badge>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-text-secondary">
                  {person.title ?? <span className="text-text-secondary/70">No title listed</span>}
                </p>
                <div className="mt-1 flex flex-wrap gap-3 text-xs">
                  {person.linkedin_url ? (
                    <a
                      href={person.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-signal-teal underline decoration-signal-teal/30 underline-offset-4"
                    >
                      LinkedIn
                    </a>
                  ) : null}
                  {person.email ? (
                    <a
                      href={`mailto:${person.email}`}
                      className="text-signal-teal underline decoration-signal-teal/30 underline-offset-4"
                    >
                      {person.email}
                    </a>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="sr-only" htmlFor={`stage-${person.id}`}>
                  Stage for {person.name}
                </label>
                <select
                  id={`stage-${person.id}`}
                  value={person.stage}
                  disabled={pendingId === person.id}
                  onChange={(event) => changeStage(person, event.target.value as PersonStage)}
                  className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-ink disabled:opacity-50"
                >
                  {PERSON_STAGES.map((stage) => (
                    <option key={stage} value={stage}>
                      {PERSON_STAGE_LABEL[stage]}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={pendingId === person.id}
                  onClick={() => toggleContact(person)}
                  className="utility-label text-signal-teal hover:underline disabled:opacity-50"
                >
                  {primaryContactId === person.id ? "Unset contact" : "Set as contact"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {actionError ? (
        <p className="mt-3 text-sm text-error" role="alert">
          {actionError}
        </p>
      ) : null}
    </Section>
  );
}
