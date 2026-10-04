"use client";

import { useState } from "react";

import { updateCompanyStage } from "@/lib/api-client/client";
import { formatTimestamp } from "@/lib/format";
import type { Company, CompanyDetail } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { Menu } from "@/components/ui/Menu";
import { PIPELINE_STAGES, StatusBadge, type PipelineStage } from "@/components/ui/StatusBadge";

export function IdentityHeader({
  detail,
  accessToken,
  onCompanyChange,
  onRetry,
  rerunning,
  rerunError,
}: {
  detail: CompanyDetail;
  accessToken: () => Promise<string>;
  onCompanyChange: (company: Company) => void;
  onRetry: () => void;
  rerunning: boolean;
  rerunError: string;
}) {
  const [movingStage, setMovingStage] = useState(false);
  const [stageError, setStageError] = useState("");

  // The same PATCH the Pipeline board uses, so a stage moved here and a card
  // dragged there go through one code path and one set of side effects.
  async function moveToStage(stage: PipelineStage) {
    if (stage === detail.stage) return;
    setMovingStage(true);
    setStageError("");
    try {
      const updated = await updateCompanyStage(detail.id, stage, await accessToken());
      onCompanyChange(updated);
    } catch (err) {
      setStageError(err instanceof Error ? err.message : "Could not change the stage.");
    } finally {
      setMovingStage(false);
    }
  }

  return (
    <section className="rounded-md border border-line bg-surface p-7 shadow-overlay">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex min-w-0 gap-4">
          <CompanyLogo logoUrl={detail.logo_url} domain={detail.domain} className="h-12 w-12" />
          <div className="min-w-0">
            <p className="utility-label text-text-secondary">Domain</p>
            <p className="mt-1 font-display text-2xl text-ink">{detail.domain}</p>
            {detail.homepage_title ? (
              <p className="mt-2 max-w-xl text-sm leading-snug text-text-secondary">
                {detail.homepage_title}
              </p>
            ) : null}
            {detail.homepage_url ? (
              <a
                href={detail.homepage_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm text-signal-teal underline decoration-signal-teal/30 underline-offset-4"
              >
                {detail.homepage_url}
              </a>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 sm:items-end">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge stage={detail.stage} />
            <Menu
              label={`Change the stage for ${detail.domain}`}
              trigger={movingStage ? "Changing..." : "Change stage"}
              disabled={movingStage}
              items={PIPELINE_STAGES.map((stage) => ({
                key: stage,
                label: <StatusBadge stage={stage} />,
                disabled: stage === detail.stage,
                onSelect: () => moveToStage(stage),
              }))}
            />
          </div>
          <Button size="sm" onClick={onRetry} disabled={rerunning}>
            {rerunning ? "Checking again..." : "Run research again"}
          </Button>
          <p className="utility-label text-text-secondary/70">
            Last researched {formatTimestamp(detail.updated_at)}
          </p>
        </div>
      </div>

      {stageError ? (
        <p className="mt-4 text-sm text-error" role="alert">
          {stageError}
        </p>
      ) : null}
      {rerunError ? (
        <p className="mt-4 text-sm text-error" role="alert">
          {rerunError}
        </p>
      ) : null}
    </section>
  );
}
