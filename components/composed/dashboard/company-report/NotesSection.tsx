"use client";

import { useState } from "react";

import { updateCompanyNotes } from "@/lib/api-client/client";
import type { Company } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { Textarea } from "@/components/ui/Textarea";

export function NotesSection({
  detail,
  accessToken,
  onSaved,
}: {
  detail: Company;
  accessToken: () => Promise<string>;
  onSaved: (company: Company) => void;
}) {
  const [text, setText] = useState(detail.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);

  const dirty = text !== (detail.notes ?? "");

  async function save() {
    setSaving(true);
    setSaveError("");
    setSaved(false);
    try {
      // Empty box means "no notes", not an empty string sitting in the column.
      const trimmed = text.trim();
      const updated = await updateCompanyNotes(
        detail.id,
        trimmed === "" ? null : trimmed,
        await accessToken(),
      );
      onSaved(updated);
      setText(updated.notes ?? "");
      setSaved(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Could not save these notes.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Section
      title="Notes"
      meta={
        <span className="utility-label text-text-secondary/70">
          {saving ? "Saving..." : dirty ? "Unsaved changes" : saved ? "Saved" : ""}
        </span>
      }
    >
      <label htmlFor="company-notes" className="sr-only">
        Notes about {detail.domain}
      </label>
      <Textarea
        id="company-notes"
        rows={6}
        value={text}
        onChange={(event) => {
          setText(event.target.value);
          setSaved(false);
        }}
        placeholder="Who you spoke to, what you sent, what to follow up on."
      />
      <div className="mt-3 flex items-center gap-4">
        <Button variant="quiet" onClick={save} disabled={saving || !dirty} className="px-5 py-2.5">
          {saving ? "Saving..." : "Save notes"}
        </Button>
        <span className="text-xs text-text-secondary/70">
          Notes save when you press the button, not as you type.
        </span>
      </div>
      {saveError ? (
        <p className="mt-3 text-sm text-error" role="alert">
          {saveError}
        </p>
      ) : null}
    </Section>
  );
}
