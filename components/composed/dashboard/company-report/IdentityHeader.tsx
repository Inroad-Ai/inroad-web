"use client";

import { useEffect, useRef, useState } from "react";

import { fetchCompany, updateCompanyStage } from "@/lib/api-client/client";
import { formatTimestamp } from "@/lib/format";
import { useResearchRuns } from "@/lib/research-runs";
import type { Company, CompanyDetail } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Notice } from "@/components/ui/Notice";
import { StatusBadge, type PipelineStage } from "@/components/ui/StatusBadge";

import { StageMenu } from "../companies/StageMenu";
import { HeroBand } from "./HeroBand";
import { RerunProgress } from "./RerunProgress";

export function IdentityHeader({
  detail,
  accessToken,
  onCompanyChange,
}: {
  detail: CompanyDetail;
  accessToken: () => Promise<string>;
  onCompanyChange: (company: Company) => void;
}) {
  const [movingStage, setMovingStage] = useState(false);
  const [stageError, setStageError] = useState("");
  const [rerunError, setRerunError] = useState("");
  const [activeRunId, setActiveRunId] = useState<number | null>(null);
  const handledRunId = useRef<number | null>(null);

  const { runs, startResearch } = useResearchRuns();
  const activeRun = runs.find((r) => r.id === activeRunId) ?? null;
  const rerunning = activeRun?.state === "pending";

  // The run is tracked in ResearchRunsProvider, not here, so it keeps going
  // (and this effect still fires to react to it) even if this page was
  // navigated away from and back while it was in flight. handledRunId
  // guards against acting twice on the same run if this effect re-fires for
  // an unrelated reason (onCompanyChange isn't memoized by the caller).
  useEffect(() => {
    if (!activeRun || activeRun.state === "pending") return;
    if (handledRunId.current === activeRun.id) return;
    handledRunId.current = activeRun.id;

    if (activeRun.state === "done") {
      accessToken()
        .then((token) => fetchCompany(detail.id, token))
        .then(onCompanyChange)
        .catch((err) => {
          setRerunError(err instanceof Error ? err.message : "Could not refresh this company.");
        });
    } else {
      setRerunError(activeRun.error ?? "Could not run research again.");
    }
  }, [activeRun, accessToken, detail.id, onCompanyChange]);

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

  function rerunResearch() {
    setRerunError("");
    // Asks for new research, not the shared copy that is still fresh.
    setActiveRunId(startResearch(detail.domain, { refresh: true }));
  }

  const errors = [stageError, rerunError].filter(Boolean);

  return (
    <Card as="section" padding="none" className="overflow-hidden" aria-label={detail.domain}>
      <HeroBand detail={detail} />

      <div className="flex flex-col gap-4 px-6 py-5 sm:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge stage={detail.stage} />
          <StageMenu
            label={`Change the stage for ${detail.domain}`}
            trigger={movingStage ? "Changing..." : "Change stage"}
            current={detail.stage}
            disabled={movingStage}
            align="left"
            onSelect={moveToStage}
          />
          <span className="utility-label text-ink-faint">
            Last researched {formatTimestamp(detail.updated_at)}
          </span>
          <Button size="sm" onClick={rerunResearch} loading={rerunning} className="sm:ml-auto">
            {rerunning ? "Checking again..." : "Run research again"}
          </Button>
        </div>

        {rerunning && activeRun ? <RerunProgress run={activeRun} /> : null}

        {errors.map((message) => (
          <Notice key={message}>{message}</Notice>
        ))}
      </div>
    </Card>
  );
}
