"use client";

import { useCallback, useEffect, useState } from "react";

import { fetchCompany } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import type { Company, CompanyDetail } from "@/lib/types";

import { PageNotice } from "../PageNotice";
import { CompanyReportSkeleton } from "./CompanyReportSkeleton";
import { HiringSection } from "./HiringSection";
import { IdentityHeader } from "./IdentityHeader";
import { LatestResearchSection } from "./LatestResearchSection";
import { NotCollectedNotice } from "./NotCollectedNotice";
import { NotesSection } from "./NotesSection";
import { PartialRunNotice } from "./PartialRunNotice";
import { PeopleSection } from "./PeopleSection";
import { ProductsLeadershipSection } from "./ProductsLeadershipSection";
import { ProfileSection } from "./ProfileSection";
import { ResearchCoverageSection } from "./ResearchCoverageSection";
import { ResearchHistorySection } from "./ResearchHistorySection";
import { SourcedFactsSection } from "./SourcedFactsSection";

const SESSION_EXPIRED = "Your session expired. Sign in again to see this company.";

type LoadState = "loading" | "error" | "ready";

export function CompanyReport({ companyId }: { companyId: string }) {
  const [detail, setDetail] = useState<CompanyDetail | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [loadError, setLoadError] = useState("");

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

  function mergeCompany(company: Company) {
    setDetail((current) => (current === null ? current : { ...current, ...company }));
  }

  if (loadState === "loading") return <CompanyReportSkeleton />;

  if (loadState === "error" || detail === null) {
    return <PageNotice isError>{loadError}</PageNotice>;
  }

  const research = detail.latest_research;

  return (
    <div className="flex flex-col gap-6">
      <IdentityHeader detail={detail} accessToken={accessToken} onCompanyChange={mergeCompany} />

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-6 lg:col-span-2">
          {/* A partial run is still a 200 with nulls in it. Say so plainly
              rather than letting empty fields read as "nothing to report". */}
          {research?.partial ? <PartialRunNotice errors={research.errors} /> : null}
          {research ? <NotCollectedNotice notCollected={research.not_collected ?? {}} /> : null}
          <ProfileSection detail={detail} />
          <SourcedFactsSection detail={detail} />
          <ProductsLeadershipSection detail={detail} />
          <HiringSection detail={detail} />
          <LatestResearchSection detail={detail} />
          <ResearchCoverageSection detail={detail} />
        </div>

        <aside className="flex min-w-0 flex-col gap-6" aria-label="People, notes and history">
          <PeopleSection detail={detail} accessToken={accessToken} onCompanyChange={mergeCompany} />
          <NotesSection detail={detail} accessToken={accessToken} onSaved={mergeCompany} />
          <ResearchHistorySection detail={detail} />
        </aside>
      </div>
    </div>
  );
}
