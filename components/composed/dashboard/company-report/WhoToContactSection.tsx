"use client";

import Link from "next/link";
import { useState } from "react";

import { searchMoreContacts } from "@/lib/api-client/client";
import { contactPicks, contactSourceLabel, linkedInSearchUrl } from "@/lib/contacts";
import type { CompanyDetail } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Notice } from "@/components/ui/Notice";
import { TextLink } from "@/components/ui/TextLink";

import { DashboardPanel } from "../DashboardPanel";
import { ExternalLink } from "./ExternalLink";

export function WhoToContactSection({
  detail,
  accessToken,
  onDetailChange,
}: {
  detail: CompanyDetail;
  accessToken: () => Promise<string>;
  onDetailChange: (detail: CompanyDetail) => void;
}) {
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const picks = contactPicks(detail.people ?? []);
  const companyName = detail.homepage_title ?? detail.domain;

  async function searchMore() {
    setSearching(true);
    setError("");
    try {
      onDetailChange(await searchMoreContacts(detail.id, await accessToken()));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not search for more people.");
    } finally {
      setSearching(false);
    }
  }

  return (
    <DashboardPanel title="Who to contact">
      {picks.length === 0 ? (
        <EmptyState>Nobody listed here looks right for this role yet.</EmptyState>
      ) : (
        <ol className="flex flex-col gap-4">
          {picks.map((person) => (
            <li key={person.id} className="flex flex-col gap-1">
              <p className="text-sm text-ink">
                <span className="font-sans-semibold">{person.name}</span>
                {person.title ? <span className="text-ink-muted">, {person.title}</span> : null}
              </p>
              {person.contact_reason ? (
                <p className="text-sm text-ink-muted">{person.contact_reason}</p>
              ) : null}
              <p className="text-xs text-ink-faint">Found on {contactSourceLabel(person.source)}</p>
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                {person.email ? (
                  <TextLink href={`mailto:${person.email}`} className="break-all">
                    {person.email}
                  </TextLink>
                ) : null}
                {person.linkedin_url ? (
                  <ExternalLink href={person.linkedin_url}>LinkedIn</ExternalLink>
                ) : null}
                <Link
                  href={`/contacts/${person.id}`}
                  className="text-ink underline underline-offset-4"
                >
                  Draft outreach
                </Link>
              </div>
            </li>
          ))}
        </ol>
      )}

      <div className="mt-4 flex flex-col gap-2 text-xs">
        {detail.contact_search_title ? (
          <ExternalLink href={linkedInSearchUrl(detail.contact_search_title, companyName)}>
            Search LinkedIn for {detail.contact_search_title} at {companyName}
          </ExternalLink>
        ) : null}
        <div>
          <Button variant="quiet" size="sm" disabled={searching} onClick={searchMore}>
            {searching ? "Searching..." : "Find more people with Hunter"}
          </Button>
          <p className="mt-1 text-ink-faint">Uses one search from your own Hunter credits.</p>
        </div>
      </div>
      {error ? <Notice className="mt-3">{error}</Notice> : null}
    </DashboardPanel>
  );
}
