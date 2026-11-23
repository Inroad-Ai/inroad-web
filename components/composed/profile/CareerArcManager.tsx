"use client";

import { useState } from "react";

import { CareerArcReadProgress } from "@/components/composed/career-arc/CareerArcReadProgress";
import { CareerArcReview } from "@/components/composed/career-arc/CareerArcReview";
import { CareerArcTemplate } from "@/components/composed/career-arc/CareerArcTemplate";
import { useCareerArcUpload } from "@/components/composed/career-arc/useCareerArcUpload";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FileUpload } from "@/components/ui/FileUpload";
import { Notice } from "@/components/ui/Notice";
import {
  saveCareerArc,
  type CareerArcDocument,
  type CareerArcWarning,
} from "@/lib/api-client/client";
import { requireAccessToken } from "@/lib/auth-native/browser";
import {
  CAREER_ARC_ACCEPT,
  CAREER_ARC_FORMATS_HINT,
  CAREER_ARC_SCHEMA_VERSION,
  CAREER_ARC_UPLOAD_PHASES,
  EMPTY_CAREER_ARC,
  describeSize,
  hasContent,
  newRole,
  roleLabel,
  incompleteExtras,
  untitledStories,
  wantsTemplate,
} from "@/lib/career-arc";
import { plural } from "@/lib/format";

type Mode = "view" | "template" | "upload" | "edit";

const SHOWN_ROLES = 8;

/** Owns its own save: the arc goes to PUT /api/career-arc, so it never
 * dirties the profile form or waits for its save bar. */
export function CareerArcManager({ initial }: { initial: CareerArcDocument | null }) {
  const [saved, setSaved] = useState<CareerArcDocument | null>(initial);
  const [mode, setMode] = useState<Mode>("view");
  const [draft, setDraft] = useState<CareerArcDocument | null>(null);
  const [warnings, setWarnings] = useState<CareerArcWarning[]>([]);
  const [replacing, setReplacing] = useState(false);
  const [confirmingRemove, setConfirmingRemove] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCareerArcUpload(({ document, warnings: found }) => {
    setDraft(document);
    setWarnings(found);
    setReplacing(hasContent(saved));
    setMode("edit");
  });
  const reading = upload.phase === "reading";

  function startEditing() {
    setDraft(saved);
    setWarnings([]);
    setReplacing(false);
    setMode("edit");
  }

  function startManual() {
    setDraft({ schema_version: CAREER_ARC_SCHEMA_VERSION, roles: [newRole()] });
    setWarnings([]);
    setReplacing(false);
    setMode("edit");
  }

  function close() {
    upload.reset();
    setDraft(null);
    setWarnings([]);
    setError(null);
    setMode("view");
  }

  async function persist(document: CareerArcDocument) {
    setSaving(true);
    setError(null);
    try {
      setSaved(await saveCareerArc(document, await requireAccessToken()));
      close();
      setConfirmingRemove(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save your career arc.");
    } finally {
      setSaving(false);
    }
  }

  if (mode === "edit" && draft) {
    const untitled = untitledStories(draft) + incompleteExtras(draft);
    return (
      <div className="space-y-4">
        {replacing ? (
          <Notice tone="neutral" boxed>
            Saving replaces your current career arc with this one.
          </Notice>
        ) : null}
        <CareerArcReview document={draft} warnings={warnings} onChange={setDraft} />
        {untitled > 0 ? (
          <Notice>Give every story, strength and recognition a title to save.</Notice>
        ) : null}
        {error ? <Notice>{error}</Notice> : null}
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            loading={saving}
            disabled={untitled > 0}
            onClick={() => persist(draft)}
          >
            {replacing ? "Replace my career arc" : "Save career arc"}
          </Button>
          <Button type="button" variant="ghost" disabled={saving} onClick={close}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  if (mode === "template") {
    return (
      <div className="space-y-4">
        <CareerArcTemplate />
        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={() => setMode("upload")}>
            I have filled it in, upload it
          </Button>
          <Button type="button" variant="ghost" onClick={close}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  if (mode === "upload" || reading) {
    return (
      <div className="space-y-4">
        {reading ? (
          <CareerArcReadProgress fileName={upload.fileName} progress={upload.progress} />
        ) : (
          <FileUpload
            accept={CAREER_ARC_ACCEPT}
            fileName={upload.fileName}
            fileSize={upload.fileSize}
            state={upload.phase === "reading" ? "uploading" : upload.phase}
            errorMessage={upload.error}
            onSelect={upload.select}
            onRemove={upload.reset}
            onRetry={upload.reset}
            subject="career arc"
            formatsHint={CAREER_ARC_FORMATS_HINT}
            phases={CAREER_ARC_UPLOAD_PHASES}
          />
        )}
        <div className="flex flex-wrap gap-3">
          {upload.phase === "error" && wantsTemplate(upload.errorCode) ? (
            <Button type="button" variant="quiet" size="sm" onClick={() => setMode("template")}>
              Use the template instead
            </Button>
          ) : null}
          {reading ? null : (
            <Button type="button" variant="ghost" size="sm" onClick={close}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (!saved || !hasContent(saved)) {
    return (
      <Card variant="nested" padding="md" className="space-y-4">
        <div>
          <p className="text-sm font-sans-semibold text-ink">No career arc yet</p>
          <p className="mt-1 text-sm text-ink-muted">
            Your resume says what you did. A career arc says how and why: your roles, the stories
            behind them, the trade-offs and the results. Add one and your outreach emails can
            mention the story that fits each company. We never keep your file, only what you
            confirm.
          </p>
        </div>
        {error ? <Notice>{error}</Notice> : null}
        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={() => setMode("upload")}>
            Upload a document
          </Button>
          <Button type="button" variant="quiet" onClick={() => setMode("template")}>
            Get the template
          </Button>
          <Button type="button" variant="ghost" onClick={startManual}>
            Add one manually
          </Button>
        </div>
      </Card>
    );
  }

  const roles = saved.roles ?? [];
  return (
    <Card variant="nested" padding="md" className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm font-sans-semibold text-ink">{describeSize(saved)}</p>
        <Badge tone="success" dot>
          Saved
        </Badge>
      </div>
      <ul className="space-y-1.5">
        {roles.slice(0, SHOWN_ROLES).map((role) => (
          <li key={role.id} className="flex flex-wrap items-center gap-2 text-sm text-ink">
            <span className="min-w-0 truncate">{roleLabel(role)}</span>
            <Badge>{plural(role.stories?.length ?? 0, "story", "stories")}</Badge>
          </li>
        ))}
        {roles.length > SHOWN_ROLES ? (
          <li className="text-sm text-ink-muted">and {roles.length - SHOWN_ROLES} more</li>
        ) : null}
      </ul>
      {error ? <Notice>{error}</Notice> : null}
      {confirmingRemove ? (
        <div className="space-y-3">
          <Notice tone="neutral" boxed>
            Remove your career arc? This deletes all {describeSize(saved)} and cannot be undone.
          </Notice>
          <div className="flex flex-wrap gap-3">
            <Button type="button" loading={saving} onClick={() => persist(EMPTY_CAREER_ARC)}>
              Remove career arc
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={saving}
              onClick={() => setConfirmingRemove(false)}
            >
              Keep it
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={startEditing}>
            Edit
          </Button>
          <Button type="button" variant="quiet" onClick={() => setMode("upload")}>
            Replace with a file
          </Button>
          <Button type="button" variant="ghost" onClick={() => setConfirmingRemove(true)}>
            Remove
          </Button>
        </div>
      )}
    </Card>
  );
}
