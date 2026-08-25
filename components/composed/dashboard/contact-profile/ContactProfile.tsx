"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { ApiError, enrichPersonWithApollo, fetchPerson, updatePersonStage } from "@/lib/api-client/client";
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

const SESSION_EXPIRED = "Your session expired. Sign in again to see this contact.";

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

  async function enrichWithApollo() {
    if (!detail) return;
    setEnriching(true);
    setEnrichMessage(null);
    try {
      const before = detail;
      const updated = await enrichPersonWithApollo(detail.id, await accessToken());
      setDetail((current) => (current === null ? current : { ...current, ...updated }));
      const foundSomething =
        (!before.email && updated.email) || (!before.linkedin_url && updated.linkedin_url);
      setEnrichMessage({
        text: foundSomething ? "Found new info from Apollo." : "Apollo had nothing new for this person.",
        isError: false,
      });
    } catch (err) {
      const text =
        err instanceof ApiError && err.code === "apollo_not_connected"
          ? "Connect your Apollo account on the Integrations page first."
          : err instanceof Error
            ? err.message
            : "Could not reach Apollo.";
      setEnrichMessage({ text, isError: true });
    } finally {
      setEnriching(false);
    }
  }

  if (loadState === "loading") {
    return (
      <div className="mt-6 rounded-md border border-line bg-surface">
        <EmptyState className="px-6 py-16 text-center">Loading...</EmptyState>
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

  return (
    <div className="mt-6 flex flex-col gap-6">
      <Section
        title="Person"
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
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg text-ink">{detail.name}</h2>
          <Badge tone="neutral">{PERSON_ROLE_LABEL[detail.role_category]}</Badge>
          <PersonStageBadge stage={detail.stage} />
        </div>
        {moveError ? (
          <p className="mt-2 text-sm text-error" role="alert">
            {moveError}
          </p>
        ) : null}

        <dl className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <DataField label="Title">
            {detail.title ?? <span className="text-text-secondary/70">No title listed</span>}
          </DataField>
          <DataField label="Company">
            <Link
              href={`/companies/${detail.company_id}`}
              className="text-signal-teal underline decoration-signal-teal/30 underline-offset-4"
            >
              {detail.company_homepage_title ?? detail.company_domain}
            </Link>
          </DataField>
          <DataField label="Found via">
            {detail.source ?? <span className="text-text-secondary/70">Unknown</span>}
          </DataField>
          <DataField label="Email">
            {detail.email ? (
              <a
                href={`mailto:${detail.email}`}
                className="text-signal-teal underline decoration-signal-teal/30 underline-offset-4"
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
          <DataField label="Contacted">
            {detail.contacted_at ? (
              formatTimestamp(detail.contacted_at)
            ) : (
              <span className="text-text-secondary/70">Not yet</span>
            )}
          </DataField>
        </dl>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            disabled
            title="Outreach isn't built yet - what this does is still being decided."
          >
            Outreach
          </Button>
          <span className="text-xs text-text-secondary/70">
            Not wired up yet - what this button does is still being decided.
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button
            variant="quiet"
            size="sm"
            type="button"
            onClick={enrichWithApollo}
            disabled={enriching || (Boolean(detail.email) && Boolean(detail.linkedin_url))}
          >
            {enriching ? "Looking up..." : "Find with Apollo"}
          </Button>
          {enrichMessage ? (
            <p
              className={`text-xs ${enrichMessage.isError ? "text-muted-rose" : "text-text-secondary"}`}
              role={enrichMessage.isError ? "alert" : undefined}
            >
              {enrichMessage.text}
            </p>
          ) : Boolean(detail.email) && Boolean(detail.linkedin_url) ? (
            <span className="text-xs text-text-secondary/70">
              Already has both an email and a LinkedIn profile.
            </span>
          ) : null}
        </div>
      </Section>
    </div>
  );
}
