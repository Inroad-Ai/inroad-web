"use client";

import Link from "next/link";

import { formatAmountUsd, formatDay } from "@/lib/format";
import { safeHref } from "@/lib/safe-href";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { TextLink } from "@/components/ui/TextLink";

import { DashboardPanel } from "../DashboardPanel";
import { MatchBadge } from "../match/MatchBadge";
import { useRecentlyFunded } from "./useRecentlyFunded";

/** Companies with new money and an open role that fits: the ones most likely
 * to answer now. Loaded on its own, so it never holds up the rest of the
 * Overview, and hidden while there is nothing to show. */
export function RecentlyFundedSection() {
  const items = useRecentlyFunded();
  if (items.length === 0) return null;

  return (
    <DashboardPanel
      title="Recently funded, fits you"
      description="Companies that raised money in the last year and have an open role that fits you. New money usually means new hires."
    >
      <ul className="grid gap-3 lg:grid-cols-2">
        {items.map((company) => {
          const source = company.sources[0];
          const sourceHref = source ? safeHref(source.url) : null;
          const roleHref = safeHref(company.best_role.url);
          const name = company.company_name ?? company.domain;
          return (
            <Card
              as="li"
              key={`${company.domain}-${company.announced_on}`}
              variant="nested"
              padding="sm"
              className="flex flex-col gap-3"
            >
              <div className="flex items-start gap-3">
                <CompanyLogo logoUrl={null} seed={company.domain} />
                <div className="min-w-0 flex-1">
                  {company.company_id ? (
                    <Link
                      href={`/companies/${company.company_id}`}
                      className="block truncate text-sm font-sans-semibold text-ink underline-offset-4 hover:underline"
                    >
                      {name}
                    </Link>
                  ) : (
                    <p className="truncate text-sm font-sans-semibold text-ink">{name}</p>
                  )}
                  <p className="text-sm text-ink-muted">
                    {[company.stage, formatAmountUsd(company.amount_usd)]
                      .filter(Boolean)
                      .join(", ") || "Raised funding"}
                    {" · "}
                    {formatDay(company.announced_on)}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <MatchBadge
                  band={company.best_role.match.band}
                  score={company.best_role.match.score}
                />
                {company.fitting_roles > 1 ? (
                  <Badge>{company.fitting_roles} roles fit you</Badge>
                ) : null}
                {(company.backed_by ?? []).length > 0 ? (
                  <Badge tone="neutral">Backed by {(company.backed_by ?? []).join(", ")}</Badge>
                ) : null}
              </div>
              <p className="min-w-0 text-sm text-ink">
                {roleHref ? (
                  <TextLink href={roleHref} external>
                    {company.best_role.title}
                  </TextLink>
                ) : (
                  company.best_role.title
                )}
                <span className="block text-xs text-ink-muted">{company.best_role.fit_reason}</span>
              </p>
              {source && sourceHref ? (
                <p className="truncate border-t border-line pt-2 text-xs text-ink-muted">
                  Source:{" "}
                  <TextLink href={sourceHref} external>
                    {source.title}
                  </TextLink>
                </p>
              ) : null}
            </Card>
          );
        })}
      </ul>
    </DashboardPanel>
  );
}
