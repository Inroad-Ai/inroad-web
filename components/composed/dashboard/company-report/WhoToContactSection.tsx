"use client";

import Link from "next/link";
import { useState } from "react";

import { searchMoreContacts } from "@/lib/api-client/client";
import { contactPicks, contactSourceLabel, linkedInSearchUrl } from "@/lib/contacts";
import type { CompanyDetail, Person } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Notice } from "@/components/ui/Notice";

import { DashboardPanel } from "../DashboardPanel";
import { ExternalLink } from "./ExternalLink";

export function WhoToContactSection({
  detail,
  companyName,
  accessToken,
  onDetailChange,
}: {
  detail: CompanyDetail;
  companyName: string;
  accessToken: () => Promise<string>;
  onDetailChange: (detail: CompanyDetail) => void;
}) {
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const picks = contactPicks(detail.people ?? []);

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
        <p className="text-sm text-ink-muted">
          Nobody listed on their site looks right for this role yet.
        </p>
      ) : (
        <ol className="flex flex-col gap-3">
          {picks.map((person) => (
            <ContactCard key={person.id} person={person} />
          ))}
        </ol>
      )}

      <div className="mt-5 flex flex-col gap-3 border-t border-line pt-4">
        {detail.contact_search_title ? (
          <ExternalLink
            href={linkedInSearchUrl(detail.contact_search_title, companyName)}
            className="text-sm"
          >
            Search LinkedIn: {detail.contact_search_title} at {companyName}
          </ExternalLink>
        ) : null}
        <div>
          <Button variant="quiet" size="sm" disabled={searching} onClick={searchMore}>
            {searching ? "Searching..." : "Find more people with Hunter"}
          </Button>
          <p className="mt-1.5 text-xs text-ink-faint">Uses one search from your Hunter credits.</p>
        </div>
      </div>
      {error ? <Notice className="mt-3">{error}</Notice> : null}
    </DashboardPanel>
  );
}

function ContactCard({ person }: { person: Person }) {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    if (!person.email) return;
    try {
      await navigator.clipboard.writeText(person.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be blocked by the browser; the address is still shown to select.
    }
  }

  return (
    <Card as="li" variant="nested" padding="sm" className="flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <Avatar name={person.name} size="md" />
        <div className="min-w-0">
          <p className="text-sm font-sans-semibold text-ink">{person.name}</p>
          {person.title ? <p className="text-sm text-ink-muted">{person.title}</p> : null}
        </div>
      </div>
      {person.contact_reason ? (
        <p className="text-sm leading-relaxed text-ink">{person.contact_reason}</p>
      ) : null}
      <p className="text-xs text-ink-faint">Found on {contactSourceLabel(person.source)}</p>
      {person.email ? <p className="break-all text-xs text-ink-muted">{person.email}</p> : null}
      <div className="flex flex-wrap items-center gap-2">
        <Button href={`/contacts/${person.id}`} size="sm">
          Draft outreach
        </Button>
        {person.email ? (
          <Button variant="quiet" size="sm" onClick={copyEmail}>
            {copied ? "Copied" : "Copy email"}
          </Button>
        ) : null}
        {person.linkedin_url ? (
          <ExternalLink href={person.linkedin_url} className="text-sm">
            LinkedIn
          </ExternalLink>
        ) : null}
      </div>
    </Card>
  );
}
