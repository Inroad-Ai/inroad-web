"use client";

import { useEffect, useState } from "react";

import { ApiError, sendOutreachEmail, type OutreachDraft } from "@/lib/api-client/client";
import { requireAccessToken } from "@/lib/auth-native/browser";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SendIcon } from "@/components/ui/Icons";
import { Modal } from "@/components/ui/Modal";
import { Notice } from "@/components/ui/Notice";
import { TextLink } from "@/components/ui/TextLink";

export function SendOutreachButton({
  personId,
  draft,
  recipientEmail,
  subject,
  onEnsureSaved,
}: {
  personId: string;
  draft: OutreachDraft;
  recipientEmail: string | null;
  subject: string;
  /** Gmail sends the saved row, not what's in the textarea, so an unsaved
   * edit is written first. False means that save failed and the section is
   * already showing why. */
  onEnsureSaved: () => Promise<boolean>;
}) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  // Local state covers this session; draft.sent_at is what survives a
  // reload, and the backend refuses a second send regardless.
  const [justSent, setJustSent] = useState(false);
  const sent = justSent || Boolean(draft.sent_at);

  // An edit or a redraft clears sent_at server-side, which re-arms Send.
  // Without this the in-session flag would keep it disabled on a draft the
  // backend would now accept.
  useEffect(() => {
    if (!draft.sent_at) setJustSent(false);
  }, [draft.updated_at, draft.sent_at]);
  const [error, setError] = useState<string | null>(null);
  const [notConnected, setNotConnected] = useState(false);

  async function send() {
    setBusy(true);
    setError(null);
    setNotConnected(false);
    try {
      if (!(await onEnsureSaved())) return;
      const token = await requireAccessToken();
      await sendOutreachEmail(personId, draft.sequence_index, token);
      setJustSent(true);
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
        icon={<SendIcon />}
        onClick={() => setConfirming(true)}
        disabled={busy || sent || !recipientEmail}
        title={recipientEmail ? undefined : "No email address for this person yet."}
      >
        {sent ? "Sent" : "Send"}
      </Button>

      {sent ? (
        <span className="order-last basis-full text-xs text-ink-muted">
          Sent from your Gmail. It is in your Sent folder.
        </span>
      ) : null}

      {notConnected ? (
        <span className="order-last basis-full text-xs text-ink-muted" role="alert">
          Connect Gmail on the <TextLink href="/integrations">Integrations page</TextLink> first.
        </span>
      ) : null}

      {error && !confirming ? (
        <Notice size="xs" className="order-last basis-full">
          {error}
        </Notice>
      ) : null}

      <Modal open={confirming} onClose={() => setConfirming(false)} title="Send this email?">
        <Card variant="nested" padding="sm" className="space-y-2">
          <p className="text-sm text-ink-muted">
            Goes to <span className="break-all text-ink">{recipientEmail}</span> from your Gmail,
            now.
          </p>
          <p className="text-sm text-ink-muted">
            Subject: <span className="text-ink">{subject || "(none)"}</span>
          </p>
        </Card>
        <p className="mt-4 text-sm text-ink-muted">
          It sends the draft shown on this page. There is no undo once Gmail accepts it.
        </p>

        {error ? <Notice className="mt-3">{error}</Notice> : null}

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button
            variant="quiet"
            size="sm"
            type="button"
            onClick={() => setConfirming(false)}
            disabled={busy}
          >
            Cancel
          </Button>
          <Button size="sm" type="button" onClick={send} loading={busy}>
            {busy ? "Sending..." : "Send it"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
