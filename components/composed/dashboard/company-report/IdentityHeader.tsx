"use client";

import { useEffect, useRef, useState } from "react";

import { fetchCompany, updateCompanyStage } from "@/lib/api-client/client";
import { formatTimestamp } from "@/lib/format";
import type { MatchRatings } from "@/lib/match-ratings";
import { useResearchRuns } from "@/lib/research-runs";
import type { CompanyBrief } from "@/lib/company-brief";
import type { Company, CompanyDetail } from "@/lib/types";
import { Notice } from "@/components/ui/Notice";
import { describeHiring } from "@/lib/companies";
import { StatusBadge, type PipelineStage } from "@/components/ui/StatusBadge";
import { TextLink } from "@/components/ui/TextLink";

import { StageMenu } from "../companies/StageMenu";
import { MatchBadge } from "../match/MatchBadge";
import { Btn, Props } from "../v2/kit";
import { RateMatch } from "../ratings/RateMatch";
import { HeroBand } from "./HeroBand";
import { RerunProgress } from "./RerunProgress";

export function IdentityHeader({
  detail,
  brief,
  accessToken,
  onCompanyChange,
  ratings,
}: {
  detail: CompanyDetail;
  brief: CompanyBrief;
  accessToken: () => Promise<string>;
  onCompanyChange: (company: Company) => void;
  ratings: MatchRatings;
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
  const hiring = describeHiring(detail);
  const contact = detail.primary_contact_id ?? detail.people[0]?.id ?? null;

  const rows: [string, React.ReactNode, string?][] = [
    [
      "Fit",
      detail.match ? (
        <MatchBadge band={detail.match.band} score={detail.match.score} />
      ) : (
        <span className="muted">No open role here fits you yet.</span>
      ),
      "target",
    ],
    [
      "Stage",
      <span key="stage" className="row wrap" style={{ gap: 12 }}>
        <StatusBadge stage={detail.stage} />
        <StageMenu
          label={`Change the stage for ${detail.domain}`}
          trigger={movingStage ? "Changing..." : "Change stage"}
          current={detail.stage}
          disabled={movingStage}
          align="left"
          onSelect={moveToStage}
        />
      </span>,
      "kanban",
    ],
    [
      "Hiring",
      <span key="hiring" className={hiring.muted ? "muted" : "m"}>
        {hiring.label}
      </span>,
      "briefcase",
    ],
    ["Last researched", formatTimestamp(detail.updated_at), "clock"],
    [
      "Right for you?",
      <RateMatch key="rate" ratings={ratings} companyId={detail.id} subject={brief.name} />,
      "flag",
    ],
  ];
  if (detail.backed_by && detail.backed_by.length > 0) {
    rows.splice(3, 0, [
      "Backed by",
      <span key="backed">
        {detail.backed_by.map((backer, index) => (
          <span key={backer.portfolio_url}>
            {index > 0 ? ", " : null}
            <TextLink href={backer.portfolio_url} external>
              {backer.name}
            </TextLink>
          </span>
        ))}
        <span className="faint xs"> (listed on their portfolio page)</span>
      </span>,
      "dollar",
    ]);
  }

  return (
    <section aria-label={detail.domain}>
      <div className="row wrap" style={{ gap: 16, alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <HeroBand detail={detail} brief={brief} />
        </div>
        <div className="row wrap">
          <Btn kind="t" icon="history" onClick={rerunResearch} disabled={rerunning}>
            {rerunning ? "Checking again..." : "Re-research"}
          </Btn>
          {contact ? (
            <Btn kind="p" icon="send" href={`/contacts/${contact}`}>
              Reach out
            </Btn>
          ) : null}
        </div>
      </div>

      <div style={{ margin: "24px 0 8px" }}>
        <Props rows={rows} />
      </div>

      {rerunning && activeRun ? <RerunProgress run={activeRun} /> : null}

      {errors.map((message) => (
        <Notice key={message}>{message}</Notice>
      ))}
    </section>
  );
}
