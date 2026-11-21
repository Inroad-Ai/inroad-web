"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import { fetchCompany } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import { buildBrief } from "@/lib/company-brief";
import { useMatchRatings } from "@/lib/match-ratings";
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
import { Ic } from "../v2/kit";
import { WhoToContactSection } from "./WhoToContactSection";
import { YouAndThemCard } from "./YouAndThemCard";

function More({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="more">
      <summary>
        <Ic n="chev" size="s" />
        <span className="m">{title}</span>
      </summary>
      <div className="more-body">{children}</div>
    </details>
  );
}

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
  // Keyed on the ratings list, not the detail: a stage or notes change
  // replaces the detail and must not drop ratings made on this page.
  const detailId = detail?.id;
  const detailRatings = detail?.ratings;
  const loadedRatings = useMemo(
    () =>
      detailId ? (detailRatings ?? []).map((rating) => ({ companyId: detailId, rating })) : [],
    [detailId, detailRatings],
  );
  const ratings = useMatchRatings(loadedRatings);

  if (loadState === "loading") return <CompanyReportSkeleton />;

  if (loadState === "error" || detail === null || brief === null) {
    return <PageNotice isError>{loadError}</PageNotice>;
  }

  return (
    <div className="flex max-w-4xl flex-col gap-8">
      <IdentityHeader
        detail={detail}
        brief={brief}
        accessToken={accessToken}
        onCompanyChange={mergeCompany}
        ratings={ratings}
      />
      <YouAndThemCard detail={detail} brief={brief} />
      <FittingRolesSection detail={detail} ratings={ratings} />
      <WhoToContactSection
        detail={detail}
        companyName={brief.name}
        accessToken={accessToken}
        onDetailChange={replaceDetail}
      />
      <PeopleSection
        key={peopleVersion}
        detail={detail}
        accessToken={accessToken}
        onCompanyChange={mergeCompany}
      />
      <section>
        <h2 className="sec-title" style={{ marginBottom: 6 }}>
          More
        </h2>
        <More title="About">
          <AboutSection brief={brief} />
        </More>
        <More title="Open roles">
          <OpenRolesSection brief={brief} />
        </More>
        <More title="Products">
          <ProductsSection brief={brief} />
        </More>
        <More title="Highlights">
          <HighlightsSection brief={brief} />
        </More>
        <More title="News">
          <NewsSection brief={brief} />
        </More>
      </section>
      <NotesSection detail={detail} accessToken={accessToken} onSaved={mergeCompany} />
    </div>
  );
}
