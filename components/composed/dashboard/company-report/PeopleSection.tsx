"use client";

import { useState } from "react";

import { setPrimaryContact, updatePersonStage } from "@/lib/api-client/client";
import type { Company, CompanyDetail, Person } from "@/lib/types";
import { EmptyState } from "@/components/ui/EmptyState";
import type { PersonStage } from "@/components/ui/PersonStageBadge";
import { Notice } from "@/components/ui/Notice";

import { Section } from "../v2/kit";
import { PersonRow } from "./PersonRow";

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
    <Section
      id="people"
      title="People"
      right={people.length > 0 ? `${people.length} found` : undefined}
    >
      {people.length === 0 ? (
        <EmptyState>No named people came back with the last run.</EmptyState>
      ) : (
        <div className="tablewrap">
          <table className="t">
            <thead>
              <tr>
                <th style={{ width: 230 }}>Name</th>
                <th>Role</th>
                <th>Warmth</th>
                <th>Contact</th>
                <th>Stage</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {people.map((person) => (
                <PersonRow
                  key={person.id}
                  person={person}
                  isPrimary={primaryContactId === person.id}
                  pending={pendingId === person.id}
                  onStageChange={(stage) => changeStage(person, stage)}
                  onToggleContact={() => toggleContact(person)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
      {actionError ? <Notice className="mt-3">{actionError}</Notice> : null}
    </Section>
  );
}
