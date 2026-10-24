"use client";

import { useEffect, useRef, useState } from "react";

import { saveOutreachDraft, type OutreachDraft } from "@/lib/api-client/client";
import { requireAccessToken } from "@/lib/auth-native/browser";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LinkedinIcon, MailIcon } from "@/components/ui/Icons";
import { Input } from "@/components/ui/Input";
import { Notice } from "@/components/ui/Notice";
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
    <Card as="section" variant="nested" aria-label={title} padding="none">
      <header className="flex items-start justify-between gap-3 px-5 pt-4">
        <div className="min-w-0">
          <Eyebrow as="h3">
            {draft.channel === "email" ? (
              <MailIcon className="h-3.5 w-3.5" />
            ) : (
              <LinkedinIcon className="h-3.5 w-3.5" />
            )}
            {title}
          </Eyebrow>
          <p className="mt-1.5 text-xs text-ink-muted">{hint}</p>
        </div>
        <Button variant="ghost" size="sm" type="button" onClick={copy}>
          Copy
        </Button>
      </header>

      <div className="space-y-4 px-5 py-4">
        {draft.channel === "email" ? (
          <label className="block">
            <span className="utility-label text-ink-muted">Subject</span>
            <Input
              className="mt-2"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              readOnly={readOnly}
            />
          </label>
        ) : null}

        <label className="block">
          <span className="utility-label text-ink-muted">Message</span>
          <Textarea
            className="mt-2 leading-relaxed"
            rows={BODY_ROWS}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            readOnly={readOnly}
          />
        </label>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs text-ink-faint">{body.length} characters</span>
          {status ? (
            <Notice tone={status.isError ? "error" : "neutral"} size="xs">
              {status.text}
            </Notice>
          ) : null}
        </div>
      </div>

      {readOnly ? null : (
        <footer className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-line px-5 py-4">
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
            <>
              <GmailDraftButton
                personId={personId}
                sequenceIndex={draft.sequence_index}
                recipientEmail={recipientEmail}
                onEnsureSaved={persist}
              />
              <SendOutreachButton
                personId={personId}
                draft={draft}
                recipientEmail={recipientEmail}
                subject={subject}
                onEnsureSaved={persist}
              />
            </>
          ) : null}
        </footer>
      )}
    </Card>
  );
}
