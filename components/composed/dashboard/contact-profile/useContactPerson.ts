"use client";

import { useCallback, useEffect, useState } from "react";

import { ApiError, enrichPerson, fetchPerson, updatePersonStage } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import type { PersonDetail, PersonStage } from "@/lib/types";

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

export interface StatusMessage {
  text: string;
  isError: boolean;
}

type LoadState = "loading" | "error" | "ready";

export function useContactPerson(personId: string) {
  const [detail, setDetail] = useState<PersonDetail | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [loadError, setLoadError] = useState("");
  const [moving, setMoving] = useState(false);
  const [moveError, setMoveError] = useState("");
  const [enriching, setEnriching] = useState(false);
  const [enrichMessage, setEnrichMessage] = useState<StatusMessage | null>(null);

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

  async function moveStage(stage: PersonStage) {
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

  return {
    detail,
    loadState,
    loadError,
    moving,
    moveError,
    enriching,
    enrichMessage,
    moveStage,
    enrichContact,
  };
}
