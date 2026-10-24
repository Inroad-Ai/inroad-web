"use client";

import { useCallback, useEffect, useState } from "react";

import { fetchCompany } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import type { Company, CompanyDetail } from "@/lib/types";
import { EmptyState } from "@/components/ui/EmptyState";

import { CompanyReportSkeleton } from "./CompanyReportSkeleton";
import { HiringSection } from "./HiringSection";
import { IdentityHeader } from "./IdentityHeader";
import { LatestResearchSection } from "./LatestResearchSection";
import { NotesSection } from "./NotesSection";
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
    return (
      <div className="mt-6 rounded-md border border-line bg-surface">
        <EmptyState className="px-6 py-16 text-center">{loadError}</EmptyState>
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-6">
      <IdentityHeader detail={detail} accessToken={accessToken} onCompanyChange={mergeCompany} />
      <ProfileSection detail={detail} />
      <ProductsLeadershipSection detail={detail} />
      <HiringSection detail={detail} />
      <PeopleSection detail={detail} accessToken={accessToken} onCompanyChange={mergeCompany} />
      <ResearchCoverageSection detail={detail} />
      <SourcedFactsSection detail={detail} />
      <LatestResearchSection detail={detail} />
      <NotesSection detail={detail} accessToken={accessToken} onSaved={mergeCompany} />
      <ResearchHistorySection detail={detail} />
    </div>
  );
}
