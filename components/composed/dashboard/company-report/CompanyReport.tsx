"use client";

import { useCallback, useEffect, useState } from "react";

import { fetchCompany } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import type { Company, CompanyDetail } from "@/lib/types";

import { PageNotice } from "../PageNotice";
import { CompanyReportSkeleton } from "./CompanyReportSkeleton";
import { HiringSection } from "./HiringSection";
import { IdentityHeader } from "./IdentityHeader";
import { NewsSection } from "./NewsSection";
import { NotesSection } from "./NotesSection";
import { PeopleSection } from "./PeopleSection";
import { ProductsLeadershipSection } from "./ProductsLeadershipSection";
import { ProfileSection } from "./ProfileSection";
import { SourcedFactsSection } from "./SourcedFactsSection";
import { WhoToContactSection } from "./WhoToContactSection";
import { FittingRolesSection } from "./FittingRolesSection";

const SESSION_EXPIRED = "Your session expired. Sign in again to see this company.";

type LoadState = "loading" | "error" | "ready";

export function CompanyReport({ companyId }: { companyId: string }) {
  const [detail, setDetail] = useState<CompanyDetail | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [loadError, setLoadError] = useState("");
  // PeopleSection keeps its own copy of the people; a new search remounts it.
  const [peopleVersion, setPeopleVersion] = useState(0);

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

  function replaceDetail(next: CompanyDetail) {
    setDetail(next);
    setPeopleVersion((version) => version + 1);
  }

  function mergeCompany(company: Company) {
    setDetail((current) => (current === null ? current : { ...current, ...company }));
  }

  if (loadState === "loading") return <CompanyReportSkeleton />;

  if (loadState === "error" || detail === null) {
    return <PageNotice isError>{loadError}</PageNotice>;
  }

  return (
    <div className="flex flex-col gap-6">
      <IdentityHeader detail={detail} accessToken={accessToken} onCompanyChange={mergeCompany} />

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-6 lg:col-span-2">
          <ProfileSection detail={detail} />
          <FittingRolesSection detail={detail} />
          <HiringSection detail={detail} />
          <SourcedFactsSection detail={detail} />
          <ProductsLeadershipSection detail={detail} />
          <NewsSection detail={detail} />
        </div>

        <aside className="flex min-w-0 flex-col gap-6" aria-label="Who to contact and notes">
          <WhoToContactSection
            detail={detail}
            accessToken={accessToken}
            onDetailChange={replaceDetail}
          />
          <NotesSection detail={detail} accessToken={accessToken} onSaved={mergeCompany} />
          <PeopleSection
            key={peopleVersion}
            detail={detail}
            accessToken={accessToken}
            onCompanyChange={mergeCompany}
          />
        </aside>
      </div>
    </div>
  );
}
