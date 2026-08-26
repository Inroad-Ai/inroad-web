"use client";

import { useState } from "react";
import Link from "next/link";

import { ApiError, createGmailDraft, type GmailDraft } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import { Button } from "@/components/ui/Button";

export function GmailDraftButton({
  personId,
  recipientEmail,
  onEnsureSaved,
}: {
  personId: string;
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
      const token = await ensureValidAccessToken();
      if (!token) throw new Error("Your session expired. Sign in again.");
      setCreated(await createGmailDraft(personId, token));
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
        onClick={create}
        disabled={busy || !recipientEmail}
        title={recipientEmail ? undefined : "No email address for this person yet."}
      >
        {busy ? "Creating..." : "Create Gmail draft"}
      </Button>

      {created ? (
        <span className="text-xs text-text-secondary">
          Saved to your Gmail drafts.{" "}
          <a
            href={created.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-signal-teal underline decoration-signal-teal/30 underline-offset-4"
          >
            Open in Gmail
          </a>
        </span>
      ) : null}

      {notConnected ? (
        <span className="text-xs text-text-secondary" role="alert">
          Connect Gmail on the{" "}
          <Link
            href="/integrations"
            className="text-signal-teal underline decoration-signal-teal/30 underline-offset-4"
          >
            Integrations page
          </Link>{" "}
          first.
        </span>
      ) : null}

      {error ? (
        <p className="text-xs text-muted-rose" role="alert">
          {error}
        </p>
      ) : null}
    </>
  );
}
