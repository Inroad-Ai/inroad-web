"use client";

import Link from "next/link";
import { useMemo } from "react";

import type { NextStep } from "@/lib/api-client/client";
import { companyDisplayName } from "@/lib/company-brief";
import { useMatchRatings } from "@/lib/match-ratings";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CompanyLogo } from "@/components/ui/CompanyLogo";

import { DashboardPanel } from "../DashboardPanel";
import { MatchBadge } from "../match/MatchBadge";
import { RateMatch } from "../ratings/RateMatch";
import { RatingsNote } from "../ratings/RatingsNote";

/** The best companies to act on now, best first, each with one next step. */
export function NextStepsSection({ steps }: { steps: NextStep[] }) {
  const loaded = useMemo(
    () =>
      steps.flatMap((step) =>
        step.role_rating ? [{ companyId: step.company_id, rating: step.role_rating }] : [],
      ),
    [steps],
  );
  const ratings = useMatchRatings(loaded);
  return (
    <DashboardPanel
      title="Your next steps"
      description="Your best companies right now, each with one thing to do."
      className="h-full"
    >
      {steps.length === 0 ? (
        <div className="flex flex-col items-start gap-3 rounded-nest bg-surface-raised p-5">
          <p className="text-sm text-ink-muted">
            Next steps appear once you have researched companies with roles that fit you.
          </p>
          <Button href="/research" size="sm">
            Research a company
          </Button>
        </div>
      ) : (
        <ol className="grid gap-3 lg:grid-cols-2">
          {steps.map((step, index) => {
            const passed = step.role_key
              ? ratings.get(step.company_id, step.role_key)?.verdict === "down"
              : false;
            return (
              <Card
                as="li"
                key={step.company_id}
                variant="nested"
                padding="sm"
                className={`flex flex-col gap-3 ${index === 0 ? "lg:col-span-2" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <CompanyLogo logoUrl={step.logo_url ?? null} seed={step.domain} />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/companies/${step.company_id}`}
                      className="block truncate text-sm font-sans-semibold text-ink underline-offset-4 hover:underline"
                    >
                      {companyDisplayName({
                        domain: step.domain,
                        homepage_title: step.homepage_title ?? null,
                      })}
                    </Link>
                    {step.role_title ? (
                      <p className="truncate text-sm text-ink-muted">
                        {step.role_title}
                        {step.fit_reason ? ` · ${step.fit_reason}` : ""}
                      </p>
                    ) : (
                      <p className="text-sm text-ink-faint">No open role fits you here yet</p>
                    )}
                  </div>
                </div>
                <div className={`flex flex-wrap gap-2 ${passed ? "opacity-50" : ""}`}>
                  {step.match_band && typeof step.match_score === "number" ? (
                    <MatchBadge band={step.match_band} score={step.match_score} />
                  ) : null}
                  {step.skills_total ? (
                    <Badge tone={step.skills_matched ? "success" : "neutral"}>
                      {step.skills_matched} of {step.skills_total} skills
                    </Badge>
                  ) : null}
                  {step.new_roles_30d ? (
                    <Badge tone="teal" dot>
                      {step.new_roles_30d} new {step.new_roles_30d === 1 ? "role" : "roles"} this
                      month
                    </Badge>
                  ) : null}
                  {step.fitting_roles > 1 ? (
                    <Badge tone="neutral">{step.fitting_roles} roles fit you</Badge>
                  ) : null}
                </div>
                {step.role_key && step.role_title ? (
                  <RateMatch
                    ratings={ratings}
                    companyId={step.company_id}
                    roleKey={step.role_key}
                    subject={step.role_title}
                  />
                ) : null}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
                  <p className="min-w-0 text-sm text-ink">
                    {step.contact?.reason ?? "Open the company to see who to contact."}
                  </p>
                  <Button
                    size="sm"
                    variant={index === 0 ? "primary" : "quiet"}
                    href={
                      step.contact
                        ? `/contacts/${step.contact.person_id}`
                        : `/companies/${step.company_id}`
                    }
                  >
                    {step.action}
                  </Button>
                </div>
              </Card>
            );
          })}
        </ol>
      )}
      {steps.length > 0 ? <RatingsNote className="mt-4" /> : null}
    </DashboardPanel>
  );
}
