"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { fetchCompany } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import { buildBrief } from "@/lib/company-brief";
import type { Company, CompanyDetail } from "@/lib/types";

import { PageNotice } from "../PageNotice";
import { AboutSection } from "./AboutSection";
import { CompanyReportSkeleton } from "./CompanyReportSkeleton";
import { FittingRolesSection } from "./FittingRolesSection";
import { HighlightsSection } from "./HighlightsSection";
import { IdentityHeader } from "./IdentityHeader";
import { NewsSection } from "./NewsSection";
import { NotesSection } from "./NotesSection";
import { OpenRolesSection } from "./OpenRolesSection";
import { PeopleSection } from "./PeopleSection";
import { ProductsSection } from "./ProductsSection";
import { WhoToContactSection } from "./WhoToContactSection";
import { YouAndThemCard } from "./YouAndThemCard";

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

  const brief = useMemo(() => (detail === null ? null : buildBrief(detail)), [detail]);

  if (loadState === "loading") return <CompanyReportSkeleton />;

  if (loadState === "error" || detail === null || brief === null) {
    return <PageNotice isError>{loadError}</PageNotice>;
  }

  return (
    <div className="flex flex-col gap-6">
      <IdentityHeader
        detail={detail}
        brief={brief}
        accessToken={accessToken}
        onCompanyChange={mergeCompany}
      />
      <YouAndThemCard detail={detail} brief={brief} />

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-6 lg:col-span-2">
          <AboutSection brief={brief} />
          <FittingRolesSection detail={detail} />
          <OpenRolesSection brief={brief} />
          <ProductsSection brief={brief} />
          <HighlightsSection brief={brief} />
          <NewsSection brief={brief} />
        </div>

        {/* Stays beside the brief while it scrolls: who to contact is the next step. */}
        <aside
          className="flex min-w-0 flex-col gap-6 lg:sticky lg:top-20"
          aria-label="Who to contact and notes"
        >
          <WhoToContactSection
            detail={detail}
            companyName={brief.name}
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
