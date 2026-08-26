"use client";

import { useState } from "react";
import Link from "next/link";

import { ApiError, sendOutreachEmail } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export function SendOutreachButton({
  personId,
  recipientEmail,
  subject,
  onEnsureSaved,
}: {
  personId: string;
  recipientEmail: string | null;
  subject: string;
  /** Gmail sends the saved row, not what's in the textarea, so an unsaved
   * edit is written first. False means that save failed and the section is
   * already showing why. */
  onEnsureSaved: () => Promise<boolean>;
}) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notConnected, setNotConnected] = useState(false);

  async function send() {
    setBusy(true);
    setError(null);
    setNotConnected(false);
    try {
      if (!(await onEnsureSaved())) return;
      const token = await ensureValidAccessToken();
      if (!token) throw new Error("Your session expired. Sign in again.");
      await sendOutreachEmail(personId, token);
      setSent(true);
      setConfirming(false);
    } catch (caught) {
      if (caught instanceof ApiError && caught.code === "gmail_not_connected") {
        setNotConnected(true);
        setConfirming(false);
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
        size="sm"
        type="button"
        onClick={() => setConfirming(true)}
        disabled={busy || sent || !recipientEmail}
        title={recipientEmail ? undefined : "No email address for this person yet."}
      >
        {sent ? "Sent" : "Send"}
      </Button>

      {sent ? (
        <span className="text-xs text-text-secondary">
          Sent from your Gmail. It is in your Sent folder.
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

      {error && !confirming ? (
        <p className="text-xs text-muted-rose" role="alert">
          {error}
        </p>
      ) : null}

      <Modal open={confirming} onClose={() => setConfirming(false)} title="Send this email?">
        <p className="text-sm text-text-secondary">
          Goes to <span className="text-ink">{recipientEmail}</span> from your Gmail, now.
        </p>
        <p className="mt-3 text-sm text-text-secondary">
          Subject: <span className="text-ink">{subject || "(none)"}</span>
        </p>
        <p className="mt-3 text-sm text-text-secondary">
          It sends the draft shown on this page. There is no undo once Gmail accepts it.
        </p>

        {error ? <p className="mt-3 text-sm text-muted-rose">{error}</p> : null}

        <div className="mt-5 flex justify-end gap-3">
          <Button
            variant="quiet"
            size="sm"
            type="button"
            onClick={() => setConfirming(false)}
            disabled={busy}
          >
            Cancel
          </Button>
          <Button size="sm" type="button" onClick={send} disabled={busy}>
            {busy ? "Sending..." : "Send it"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
