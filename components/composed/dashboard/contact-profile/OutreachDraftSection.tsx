"use client";

import { useEffect, useRef, useState } from "react";

import { saveOutreachDraft, type OutreachDraft } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Section } from "@/components/ui/Section";
import { Textarea } from "@/components/ui/Textarea";
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
      const token = await ensureValidAccessToken();
      if (!token) throw new Error("Your session expired. Sign in again.");
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
    <Section
      title={title}
      meta={
        <Button variant="quiet" size="sm" type="button" onClick={copy}>
          Copy
        </Button>
      }
    >
      <p className="text-xs text-text-secondary/70">{hint}</p>

      {draft.channel === "email" ? (
        <label className="mt-4 block">
          <span className="utility-label text-text-secondary">Subject</span>
          <Input
            className="mt-2"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            readOnly={readOnly}
          />
        </label>
      ) : null}

      <label className="mt-4 block">
        <span className="utility-label text-text-secondary">Message</span>
        <Textarea
          className="mt-2"
          rows={BODY_ROWS}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          readOnly={readOnly}
        />
      </label>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {readOnly ? null : (
          <Button
            variant="quiet"
            size="sm"
            type="button"
            onClick={persist}
            disabled={saving || !edited || body.trim().length === 0}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        )}
        {!readOnly && draft.channel === "email" ? (
          <>
            <SendOutreachButton
              personId={personId}
              draft={draft}
              recipientEmail={recipientEmail}
              subject={subject}
              onEnsureSaved={persist}
            />
            <GmailDraftButton
              personId={personId}
              sequenceIndex={draft.sequence_index}
              recipientEmail={recipientEmail}
              onEnsureSaved={persist}
            />
          </>
        ) : null}
        <span className="text-xs text-text-secondary/70">{body.length} characters</span>
        {status ? (
          <p
            className={`text-xs ${status.isError ? "text-muted-rose" : "text-text-secondary"}`}
            role={status.isError ? "alert" : undefined}
          >
            {status.text}
          </p>
        ) : null}
      </div>
    </Section>
  );
}
