"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { ApiError, enrichPerson, fetchPerson, updatePersonStage } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import { formatTimestamp } from "@/lib/format";
import { PERSON_ROLE_LABEL, type PersonDetail } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DataField } from "@/components/ui/DataField";
import { EmptyState } from "@/components/ui/EmptyState";
import { Menu } from "@/components/ui/Menu";
import { PERSON_STAGES, PersonStageBadge } from "@/components/ui/PersonStageBadge";
import { Section } from "@/components/ui/Section";
import { Skeleton } from "@/components/ui/Skeleton";
import { useOutreachDrafts } from "@/hooks/useOutreachDrafts";
import { OutreachDrafts } from "./OutreachDrafts";

const SESSION_EXPIRED = "Your session expired. Sign in again to see this contact.";

const PROVIDER_LABEL: Record<string, string> = {
  apollo: "Apollo.io",
  hunter: "Hunter.io",
};

/** enrich_person tags `source` with "+<provider>" for whichever connector
 * actually found the match (see people_records.enrich_person) - this reads
 * that back out for display rather than the backend returning it as a
 * separate field. */
function providerLabelFromSource(source: string | null | undefined): string | null {
  const tag = source?.split("+").pop();
  return tag ? (PROVIDER_LABEL[tag] ?? null) : null;
}

type LoadState = "loading" | "error" | "ready";

export function ContactProfile({ personId }: { personId: string }) {
  const [detail, setDetail] = useState<PersonDetail | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [loadError, setLoadError] = useState("");
  const [moving, setMoving] = useState(false);
  const [moveError, setMoveError] = useState("");
  const [enriching, setEnriching] = useState(false);
  const [enrichMessage, setEnrichMessage] = useState<{ text: string; isError: boolean } | null>(
    null,
  );

  const outreach = useOutreachDrafts(personId);

  const accessToken = useCallback(async () => {
    const token = await ensureValidAccessToken();
    if (!token) throw new Error(SESSION_EXPIRED);
    return token;
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const token = await accessToken();
        setDetail(await fetchPerson(personId, token, controller.signal));
        setLoadState("ready");
      } catch (err) {
        if (controller.signal.aborted) return;
        setLoadError(err instanceof Error ? err.message : "Could not load this contact.");
        setLoadState("error");
      }
    }

    load();
    return () => controller.abort();
  }, [personId, accessToken]);

  async function moveStage(stage: (typeof PERSON_STAGES)[number]) {
    if (!detail || stage === detail.stage) return;
    setMoving(true);
    setMoveError("");
    try {
      const updated = await updatePersonStage(detail.id, stage, await accessToken());
      setDetail((current) => (current === null ? current : { ...current, ...updated }));
    } catch (err) {
      setMoveError(err instanceof Error ? err.message : "Could not update this contact's stage.");
    } finally {
      setMoving(false);
    }
  }

  async function enrichContact() {
    if (!detail) return;
    setEnriching(true);
    setEnrichMessage(null);
    try {
      const before = detail;
      const updated = await enrichPerson(detail.id, await accessToken());
      setDetail((current) => (current === null ? current : { ...current, ...updated }));
      const foundSomething =
        (!before.email && updated.email) || (!before.linkedin_url && updated.linkedin_url);
      const providerLabel = foundSomething ? providerLabelFromSource(updated.source) : null;
      setEnrichMessage({
        text: foundSomething
          ? `Found new info${providerLabel ? ` via ${providerLabel}` : ""}.`
          : "No connected provider had anything new for this person.",
        isError: false,
      });
    } catch (err) {
      const text =
        err instanceof ApiError && err.code === "no_enrichment_provider_connected"
          ? "Connect an enrichment connector on the Integrations page first."
          : err instanceof Error
            ? err.message
            : "Could not reach any connected provider.";
      setEnrichMessage({ text, isError: true });
    } finally {
      setEnriching(false);
    }
  }

  if (loadState === "loading") {
    return (
      <div className="mt-6 space-y-6" role="status" aria-label="Loading contact profile">
        <Skeleton className="h-44 w-full rounded-md" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-80 w-full rounded-md lg:col-span-2" />
          <Skeleton className="h-80 w-full rounded-md" />
        </div>
        <Skeleton className="h-64 w-full rounded-md" />
        <span className="sr-only">Loading this contact...</span>
      </div>
    );
  }

  if (loadState === "error" || detail === null) {
    return (
      <div className="mt-6 rounded-md border border-line bg-surface">
        <EmptyState className="px-6 py-16 text-center">{loadError}</EmptyState>
      </div>
    );
  }

  const initials = detail.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
  const sentDrafts = outreach.drafts.filter((draft) => draft.sent_at).length;
  const isClosed = detail.stage === "closed";
  const latestDraft = [...outreach.drafts].sort(
    (first, second) => Date.parse(second.updated_at) - Date.parse(first.updated_at),
  )[0];

  return (
    <div className="mt-6 flex flex-col gap-6">
      <Section
        title="Contact"
        meta={
          <Menu
            label={`Move ${detail.name} to another stage`}
            trigger={moving ? "Moving..." : "Move stage"}
            disabled={moving}
            items={PERSON_STAGES.map((stage) => ({
              key: stage,
              label: <PersonStageBadge stage={stage} />,
              disabled: stage === detail.stage,
              onSelect: () => moveStage(stage),
            }))}
          />
        }
      >
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-signal-teal/30 bg-signal-teal-subtle font-display font-semibold text-signal-teal">
            {initials || "?"}
          </div>
          <div className="min-w-0">
            <h2 className="truncate font-display text-xl font-semibold text-ink">{detail.name}</h2>
            <p className="mt-1 text-sm text-text-secondary">
              {detail.title ?? "Title not listed"} at{" "}
              {detail.company_homepage_title ?? detail.company_domain}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge tone="neutral">{PERSON_ROLE_LABEL[detail.role_category]}</Badge>
              <PersonStageBadge stage={detail.stage} />
            </div>
          </div>
        </div>

        <dl className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <DataField label="Company">
            <Link
              href={`/companies/${detail.company_id}`}
              className="text-signal-teal underline decoration-signal-teal/30 underline-offset-4"
            >
              {detail.company_homepage_title ?? detail.company_domain}
            </Link>
          </DataField>
          <DataField label="Email">
            {detail.email ? (
              <a
                href={`mailto:${detail.email}`}
                className="break-all text-signal-teal underline decoration-signal-teal/30 underline-offset-4"
              >
                {detail.email}
              </a>
            ) : (
              <span className="text-text-secondary/70">No public email found</span>
            )}
          </DataField>
          <DataField label="LinkedIn">
            {detail.linkedin_url ? (
              <a
                href={detail.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-signal-teal underline decoration-signal-teal/30 underline-offset-4"
              >
                View profile
              </a>
            ) : (
              <span className="text-text-secondary/70">Not found</span>
            )}
          </DataField>
          <DataField label="Found via">
            {detail.source ?? <span className="text-text-secondary/70">Unknown</span>}
          </DataField>
          <DataField label="Contacted">
            {detail.contacted_at ? (
              formatTimestamp(detail.contacted_at)
            ) : (
              <span className="text-text-secondary/70">Not yet</span>
            )}
          </DataField>
        </dl>

        <div className="mt-6 border-t border-line pt-5">
          <Button
            variant="quiet"
            size="sm"
            type="button"
            onClick={enrichContact}
            disabled={enriching || (Boolean(detail.email) && Boolean(detail.linkedin_url))}
          >
            {enriching ? "Looking up..." : "Find contact info"}
          </Button>
          {enrichMessage ? (
            <p
              className={`mt-3 text-xs ${enrichMessage.isError ? "text-muted-rose" : "text-text-secondary"}`}
              role={enrichMessage.isError ? "alert" : undefined}
            >
              {enrichMessage.text}
            </p>
          ) : Boolean(detail.email) && Boolean(detail.linkedin_url) ? (
            <p className="mt-3 text-xs text-text-secondary/70">
              This contact already has an email and LinkedIn profile.
            </p>
          ) : null}
        </div>
      </Section>

      {moveError ? (
        <p className="text-sm text-error" role="alert">
          {moveError}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <Section title="Outreach">
            {outreach.error ? (
              <p className="mb-4 text-sm text-error" role="alert">
                {outreach.error}
              </p>
            ) : null}
            {isClosed ? (
              <>
                <p className="text-sm leading-6 text-text-secondary">
                  Outreach is closed for this contact. Saved messages remain available as a record,
                  but cannot be drafted, edited, or sent.
                </p>
                {outreach.drafts.length > 0 ? (
                  <div className="mt-5">
                    <OutreachDrafts
                      drafts={outreach.drafts}
                      personId={detail.id}
                      personEmail={detail.email}
                      personLinkedinUrl={detail.linkedin_url}
                      drafting={false}
                      readOnly
                      onDraftFollowUp={outreach.draft}
                      onSaved={outreach.replaceDraft}
                    />
                  </div>
                ) : null}
              </>
            ) : outreach.drafts.length === 0 ? (
              <div className="rounded-md border border-dashed border-line bg-surface-raised px-5 py-8">
                <p className="font-display text-lg text-ink">Ready to start a conversation</p>
                <p className="mt-2 max-w-xl text-sm leading-6 text-text-secondary">
                  Create a personalized email and LinkedIn message from this company&apos;s research
                  and your profile.
                </p>
                <Button
                  className="mt-5"
                  size="sm"
                  type="button"
                  onClick={() => outreach.draft(0)}
                  disabled={outreach.drafting || outreach.loading}
                >
                  {outreach.drafting ? "Drafting..." : "Draft outreach"}
                </Button>
              </div>
            ) : (
              <>
                <p className="max-w-3xl text-sm leading-6 text-text-secondary">
                  Review each touchpoint in order. Earlier messages provide context for every
                  follow-up.
                </p>
                <div className="mt-5">
                  <OutreachDrafts
                    drafts={outreach.drafts}
                    personId={detail.id}
                    personEmail={detail.email}
                    personLinkedinUrl={detail.linkedin_url}
                    drafting={outreach.drafting}
                    onDraftFollowUp={outreach.draft}
                    onSaved={outreach.replaceDraft}
                  />
                </div>
              </>
            )}
          </Section>
        </div>

        <aside className="min-w-0">
          <Section title="Engagement history" meta={<PersonStageBadge stage={detail.stage} />}>
            <ol className="space-y-5">
              <li className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-signal-teal"
                />
                <div>
                  <p className="font-display font-semibold text-ink">Contact added</p>
                  <p className="mt-1 text-sm text-text-secondary">
                    {formatTimestamp(detail.created_at)}
                  </p>
                </div>
              </li>
              {detail.contacted_at ? (
                <li className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-signal-teal"
                  />
                  <div>
                    <p className="font-display font-semibold text-ink">Marked as contacted</p>
                    <p className="mt-1 text-sm text-text-secondary">
                      {formatTimestamp(detail.contacted_at)}
                    </p>
                  </div>
                </li>
              ) : null}
              {latestDraft ? (
                <li className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-signal-teal"
                  />
                  <div>
                    <p className="font-display font-semibold text-ink">Latest draft updated</p>
                    <p className="mt-1 text-sm text-text-secondary">
                      {formatTimestamp(latestDraft.updated_at)}
                    </p>
                  </div>
                </li>
              ) : null}
            </ol>
            {sentDrafts > 0 ? (
              <p className="mt-5 border-t border-line pt-4 text-sm text-text-secondary">
                {sentDrafts} recorded {sentDrafts === 1 ? "message" : "messages"} sent.
              </p>
            ) : null}
          </Section>
        </aside>
      </div>
    </div>
  );
}
