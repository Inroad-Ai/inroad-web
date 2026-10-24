"use client";

import { useState } from "react";

import { ApiError, createGmailDraft, type GmailDraft } from "@/lib/api-client/client";
import { requireAccessToken } from "@/lib/auth-native/browser";
import { Button } from "@/components/ui/Button";
import { MailIcon } from "@/components/ui/Icons";
import { Notice } from "@/components/ui/Notice";
import { TextLink } from "@/components/ui/TextLink";

export function GmailDraftButton({
  personId,
  sequenceIndex,
  recipientEmail,
  onEnsureSaved,
}: {
  personId: string;
  sequenceIndex: number;
  recipientEmail: string | null;
  /** Gmail gets the saved row, not what's in the textarea, so an unsaved
   * edit is written first. False means that save failed and the section is
   * already showing why. */
  onEnsureSaved: () => Promise<boolean>;
}) {
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState<GmailDraft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notConnected, setNotConnected] = useState(false);

  async function create() {
    setBusy(true);
    setError(null);
    setNotConnected(false);
    try {
      if (!(await onEnsureSaved())) return;
      const token = await requireAccessToken();
      setCreated(await createGmailDraft(personId, sequenceIndex, token));
    } catch (caught) {
      if (caught instanceof ApiError && caught.code === "gmail_not_connected") {
        setNotConnected(true);
      } else {
        setError(caught instanceof Error ? caught.message : "Could not reach Gmail.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Button
        variant="quiet"
        size="sm"
        type="button"
        icon={<MailIcon />}
        onClick={create}
        loading={busy}
        disabled={!recipientEmail}
        title={recipientEmail ? undefined : "No email address for this person yet."}
      >
        {busy ? "Creating..." : "Create Gmail draft"}
      </Button>

      {created ? (
        <span className="order-last basis-full text-xs text-ink-muted">
          Saved to your Gmail drafts.{" "}
          <TextLink href={created.url} external>
            Open in Gmail
          </TextLink>
        </span>
      ) : null}

      {notConnected ? (
        <span className="order-last basis-full text-xs text-ink-muted" role="alert">
          Connect Gmail on the <TextLink href="/integrations">Integrations page</TextLink> first.
        </span>
      ) : null}

      {error ? (
        <Notice size="xs" className="order-last basis-full">
          {error}
        </Notice>
      ) : null}
    </>
  );
}
