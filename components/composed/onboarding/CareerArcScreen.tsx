"use client";

import { useState } from "react";

import { CareerArcReadProgress } from "@/components/composed/career-arc/CareerArcReadProgress";
import { CareerArcReview } from "@/components/composed/career-arc/CareerArcReview";
import { CareerArcSummary } from "@/components/composed/career-arc/CareerArcSummary";
import { CareerArcTemplate } from "@/components/composed/career-arc/CareerArcTemplate";
import { useCareerArcUpload } from "@/components/composed/career-arc/useCareerArcUpload";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { FileUpload } from "@/components/ui/FileUpload";
import { Notice } from "@/components/ui/Notice";
import { SelectableCard } from "@/components/ui/SelectableCard";
import type { CareerArcDocument, CareerArcWarning } from "@/lib/api-client/client";
import {
  CAREER_ARC_ACCEPT,
  CAREER_ARC_FORMATS_HINT,
  CAREER_ARC_UPLOAD_PHASES,
  hasContent,
  incompleteExtras,
  untitledStories,
  wantsTemplate,
} from "@/lib/career-arc";
import { plural } from "@/lib/format";

import { StepFooter } from "./StepFooter";
import { StepHeading } from "./StepHeading";

type Mode = "choose" | "upload" | "template";

export function CareerArcScreen({
  careerArc,
  warnings,
  onChange,
  onNext,
  onBack,
}: {
  careerArc: CareerArcDocument | null;
  warnings: CareerArcWarning[];
  onChange: (careerArc: CareerArcDocument | null, warnings: CareerArcWarning[]) => void;
  onNext: () => void;
  onBack?: () => void;
}) {
  const [mode, setMode] = useState<Mode>("choose");
  const [editing, setEditing] = useState(false);
  const upload = useCareerArcUpload(({ document, warnings: found }) => onChange(document, found));

  if (careerArc && hasContent(careerArc)) {
    const untitled = untitledStories(careerArc) + incompleteExtras(careerArc);
    const toLookAt =
      warnings.length + (careerArc.strengths ?? []).filter((s) => s.source === "suggested").length;
    return (
      <div>
        <StepHeading title="Here is what we found">
          A quick look. Nothing is saved until you continue, and you can change any of it later from
          your profile.
        </StepHeading>
        <div className="mt-7 space-y-4">
          <CareerArcSummary document={careerArc} />
          {toLookAt > 0 ? (
            <Notice tone="neutral" boxed>
              {plural(toLookAt, "thing is", "things are")} worth a quick look before you continue.
              Open the editor to see them.
            </Notice>
          ) : null}
          {untitled > 0 ? (
            <Notice>Give every story, strength and recognition a title to continue.</Notice>
          ) : null}
          <Button type="button" variant="quiet" onClick={() => setEditing(true)}>
            Review and edit
          </Button>
        </div>
        <StepFooter
          onBack={onBack}
          onPrimary={onNext}
          primaryLabel="Looks good, continue"
          isPrimaryDisabled={untitled > 0}
        >
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              upload.reset();
              onChange(null, []);
              setMode("upload");
            }}
          >
            Use a different file
          </Button>
        </StepFooter>

        <Drawer
          open={editing}
          onClose={() => setEditing(false)}
          label="Review your career arc"
          side="right"
        >
          <div className="flex h-full flex-col">
            <div className="flex items-start gap-4 border-b border-ink/10 px-6 py-5">
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-lg font-sans-semibold text-ink">
                  Review your career arc
                </h2>
                <p className="mt-1 text-sm text-ink-muted">
                  Open a chapter to see its stories, and any story to fix it. Anything we were not
                  sure about is marked.
                </p>
              </div>
              <Button type="button" size="sm" onClick={() => setEditing(false)}>
                Done
              </Button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
              <CareerArcReview
                document={careerArc}
                warnings={warnings}
                onChange={(next) => onChange(hasContent(next) ? next : null, warnings)}
              />
            </div>
          </div>
        </Drawer>
      </div>
    );
  }

  return (
    <div>
      <StepHeading
        title="Add your career story"
        aside={<span className="utility-label text-ink-faint">Optional</span>}
      >
        Your resume says what you did. A career arc says how and why. Your outreach emails will
        mention real results, not just job titles. We never keep your file.
      </StepHeading>

      <div className="mt-7 space-y-4">
        {mode === "choose" ? (
          <div className="grid gap-3">
            <SelectableCard selected={false} onClick={() => setMode("upload")}>
              <span className="block font-sans-semibold">I already have one</span>
              <span className="mt-1 block text-sm text-ink-muted">
                Upload a PDF, DOCX, TXT or Markdown file, even a very long one. You check it before
                anything is saved.
              </span>
            </SelectableCard>
            <SelectableCard selected={false} onClick={() => setMode("template")}>
              <span className="block font-sans-semibold">Make one from our template</span>
              <span className="mt-1 block text-sm text-ink-muted">
                Download it, fill it in, upload it. About 15 minutes for two or three experiences.
              </span>
            </SelectableCard>
          </div>
        ) : null}

        {mode === "template" ? (
          <>
            <CareerArcTemplate />
            <Button type="button" variant="quiet" onClick={() => setMode("upload")}>
              I have filled it in, upload it
            </Button>
          </>
        ) : null}

        {mode === "upload" ? (
          <>
            {upload.phase === "reading" ? (
              <CareerArcReadProgress fileName={upload.fileName} progress={upload.progress} />
            ) : (
              <FileUpload
                accept={CAREER_ARC_ACCEPT}
                fileName={upload.fileName}
                fileSize={upload.fileSize}
                state={upload.phase}
                errorMessage={upload.error}
                onSelect={upload.select}
                onRemove={upload.reset}
                onRetry={upload.reset}
                subject="career arc"
                formatsHint={CAREER_ARC_FORMATS_HINT}
                phases={CAREER_ARC_UPLOAD_PHASES}
                autoFocus
              />
            )}
            {upload.phase === "error" && wantsTemplate(upload.errorCode) ? (
              <Button type="button" variant="quiet" size="sm" onClick={() => setMode("template")}>
                Use the template instead
              </Button>
            ) : null}
          </>
        ) : null}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {onBack ? (
          <Button type="button" variant="ghost" onClick={onBack}>
            Back
          </Button>
        ) : null}
        {mode !== "choose" ? (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              upload.reset();
              setMode("choose");
            }}
          >
            Choose another way
          </Button>
        ) : null}
        <Button type="button" variant="quiet" className="ml-auto" onClick={onNext}>
          Skip for now
        </Button>
      </div>
      <p className="mt-3 text-xs text-ink-muted">You can add it any time from your profile.</p>
    </div>
  );
}
