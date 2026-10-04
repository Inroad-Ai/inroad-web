"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { fetchCompany } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import { useResearchRuns } from "@/lib/research-runs";
import type { Company, CompanyDetail } from "@/lib/types";
import { EmptyState } from "@/components/ui/EmptyState";

import { CompanyReportSkeleton } from "./CompanyReportSkeleton";
import { HiringSection } from "./HiringSection";
import { IdentityHeader } from "./IdentityHeader";
import { LatestResearchSection } from "./LatestResearchSection";
import { NotesSection } from "./NotesSection";
import { PeopleSection } from "./PeopleSection";
import { ProfileSection } from "./ProfileSection";
import { ResearchHistorySection } from "./ResearchHistorySection";

const SESSION_EXPIRED = "Your session expired. Sign in again to see this company.";

type LoadState = "loading" | "error" | "ready";

export function CompanyReport({ companyId }: { companyId: string }) {
  const [detail, setDetail] = useState<CompanyDetail | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [loadError, setLoadError] = useState("");
  const [rerunError, setRerunError] = useState("");
  const [activeRunId, setActiveRunId] = useState<number | null>(null);
  const handledRunId = useRef<number | null>(null);
  const { runs, canStartResearch, startResearch } = useResearchRuns();
  const activeRun = runs.find((run) => run.id === activeRunId);
  const rerunning = runs.some(
    (run) => run.state === "pending" && run.domain === detail?.domain.trim().toLowerCase(),
  );
  const retryDisabled = !canStartResearch(detail?.domain ?? "");

  const accessToken = useCallback(async () => {
    const token = await ensureValidAccessToken();
    if (!token) throw new Error(SESSION_EXPIRED);
    return token;
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const token = await accessToken();
        setDetail(await fetchCompany(companyId, token, controller.signal));
        setLoadState("ready");
      } catch (err) {
        if (controller.signal.aborted) return;
        setLoadError(err instanceof Error ? err.message : "Could not load this company.");
        setLoadState("error");
      }
    }

    load();
    return () => controller.abort();
  }, [companyId, accessToken]);

  useEffect(() => {
    if (!activeRun || activeRun.state === "pending" || handledRunId.current === activeRun.id)
      return;
    handledRunId.current = activeRun.id;

    if (activeRun.state === "done") {
      accessToken()
        .then((token) => fetchCompany(companyId, token))
        .then(setDetail)
        .catch((error) => {
          setRerunError(error instanceof Error ? error.message : "Could not refresh this company.");
        });
    } else {
      setRerunError(activeRun.error ?? "Could not run research again.");
    }
  }, [activeRun, accessToken, companyId]);

  function mergeCompany(company: Company) {
    setDetail((current) => (current === null ? current : { ...current, ...company }));
  }

  function rerunResearch() {
    if (!detail || retryDisabled) return;
    setRerunError("");
    const runId = startResearch(detail.domain);
    if (runId !== null) setActiveRunId(runId);
  }

  if (loadState === "loading") return <CompanyReportSkeleton />;

  if (loadState === "error" || detail === null) {
    return (
      <div className="mt-6 rounded-md border border-line bg-surface">
        <EmptyState className="px-6 py-16 text-center">{loadError}</EmptyState>
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-6">
      <IdentityHeader
        detail={detail}
        accessToken={accessToken}
        onCompanyChange={mergeCompany}
        onRetry={rerunResearch}
        rerunning={rerunning}
        retryDisabled={retryDisabled}
        rerunError={rerunError}
      />
      <LatestResearchSection
        detail={detail}
        onRetry={rerunResearch}
        rerunning={rerunning}
        retryDisabled={retryDisabled}
      />
      <ProfileSection detail={detail} />
      <HiringSection detail={detail} />
      <PeopleSection detail={detail} accessToken={accessToken} onCompanyChange={mergeCompany} />
      <NotesSection detail={detail} accessToken={accessToken} onSaved={mergeCompany} />
      <ResearchHistorySection detail={detail} />
    </div>
  );
}
