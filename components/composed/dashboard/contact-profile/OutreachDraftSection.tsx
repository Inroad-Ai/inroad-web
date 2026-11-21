"use client";

import { useEffect, useRef, useState } from "react";

import { saveOutreachDraft, type OutreachDraft } from "@/lib/api-client/client";
import { requireAccessToken } from "@/lib/auth-native/browser";
import { Button } from "@/components/ui/Button";
import { LinkedinIcon, MailIcon } from "@/components/ui/Icons";
import { Notice } from "@/components/ui/Notice";
import { GmailDraftButton } from "./GmailDraftButton";
import { SendOutreachButton } from "./SendOutreachButton";

const BODY_ROWS = 10;

export function OutreachDraftSection({
  draft,
  personId,
  recipientEmail,
  title,
  hint,
  readOnly = false,
  onSaved,
}: {
  draft: OutreachDraft;
  personId: string;
  recipientEmail: string | null;
  title: string;
  hint: string;
  readOnly?: boolean;
  onSaved: (draft: OutreachDraft) => void;
}) {
  const [subject, setSubject] = useState(draft.subject ?? "");
  const [body, setBody] = useState(draft.body);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ text: string; isError: boolean } | null>(null);

  // A save is the other reason this row changes, and it must not wipe the
  // confirmation it just produced.
  const savedItself = useRef(false);

  // Re-drafting replaces the row underneath these fields, so they follow it
  // rather than holding the superseded text the user asked to replace.
  useEffect(() => {
    setSubject(draft.subject ?? "");
    setBody(draft.body);
    if (savedItself.current) {
      savedItself.current = false;
      return;
    }
    setStatus(null);
  }, [draft.updated_at, draft.subject, draft.body]);

  const edited = subject !== (draft.subject ?? "") || body !== draft.body;

  /** True when the server row matches what's on screen, either because it
   * already did or because this call just made it so. */
  async function persist(): Promise<boolean> {
    if (!edited) return true;
    // Save is disabled for a blank body, but Send and Create Gmail draft
    // both come through here too, and neither should put an empty email in
    // front of a real recipient.
    if (!body.trim()) {
      setStatus({ text: "Write something before saving this draft.", isError: true });
      return false;
    }
    setSaving(true);
    setStatus(null);
    try {
      const token = await requireAccessToken();
      savedItself.current = true;
      onSaved(
        await saveOutreachDraft(
          personId,
          draft.channel,
          draft.sequence_index,
          { subject: draft.channel === "email" ? subject : null, body },
          token,
        ),
      );
      setStatus({ text: "Saved.", isError: false });
      return true;
    } catch (caught) {
      setStatus({
        text: caught instanceof Error ? caught.message : "Could not save this draft.",
        isError: true,
      });
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function copy() {
    const text = draft.channel === "email" && subject ? `${subject}\n\n${body}` : body;
    try {
      await navigator.clipboard.writeText(text);
      setStatus({ text: "Copied.", isError: false });
    } catch {
      // Clipboard access is refusable by the browser and there is no
      // fallback worth building here - the text is already selectable.
      setStatus({ text: "Could not copy. Select the text instead.", isError: true });
    }
  }

  return (
    <section aria-label={title} style={{ marginTop: 26 }}>
      <div
        className="row"
        style={{ paddingBottom: 10, borderBottom: "1px solid rgb(var(--color-line))" }}
      >
        <span className="muted">{draft.channel === "email" ? <MailIcon /> : <LinkedinIcon />}</span>
        <h3 className="m">{title}</h3>
        <span className="xs faint" style={{ minWidth: 0 }}>
          {hint}
        </span>
        <span className="sp" />
        <Button variant="ghost" size="sm" type="button" onClick={copy}>
          Copy
        </Button>
      </div>

      {draft.channel === "email" ? (
        <label
          className="row"
          style={{ gap: 12, padding: "12px 0", borderBottom: "1px solid rgb(var(--color-line))" }}
        >
          <span className="faint sm" style={{ width: 56 }}>
            Subject
          </span>
          <input
            className="m"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            readOnly={readOnly}
            style={{
              flex: 1,
              minWidth: 0,
              background: "none",
              border: 0,
              outline: 0,
              color: "inherit",
              font: "inherit",
            }}
          />
        </label>
      ) : null}

      <label className="block">
        <span className="sr-only">Message</span>
        <textarea
          rows={BODY_ROWS}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          readOnly={readOnly}
          style={{
            width: "100%",
            minHeight: 260,
            marginTop: 16,
            background: "none",
            border: 0,
            outline: 0,
            resize: "vertical",
            color: "inherit",
            font: "inherit",
            fontSize: 16.5,
            lineHeight: 1.85,
          }}
        />
      </label>

      <div className="row wrap" style={{ gap: 10, margin: "4px 0 14px" }}>
        <span className="xs faint">{body.length} characters</span>
        {status ? (
          <Notice tone={status.isError ? "error" : "neutral"} size="xs">
            {status.text}
          </Notice>
        ) : null}
      </div>

      {readOnly ? null : (
        <div className="row wrap" style={{ gap: 12 }}>
          {draft.channel === "email" ? (
            <SendOutreachButton
              personId={personId}
              draft={draft}
              recipientEmail={recipientEmail}
              subject={subject}
              onEnsureSaved={persist}
            />
          ) : null}
          <Button
            variant="quiet"
            size="sm"
            type="button"
            onClick={persist}
            disabled={saving || !edited || body.trim().length === 0}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
          {draft.channel === "email" ? (
            <GmailDraftButton
              personId={personId}
              sequenceIndex={draft.sequence_index}
              recipientEmail={recipientEmail}
              onEnsureSaved={persist}
            />
          ) : null}
          <span className="sp" />
          <span className="xs faint">Nothing sends without you.</span>
        </div>
      )}
    </section>
  );
}
