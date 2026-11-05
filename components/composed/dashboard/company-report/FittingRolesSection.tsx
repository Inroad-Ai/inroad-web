"use client";

import { useState } from "react";

import type { MatchRatings } from "@/lib/match-ratings";
import type { CompanyDetail } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

import { DashboardPanel } from "../DashboardPanel";
import { MatchDetails } from "../match/MatchDetails";
import { RateMatch } from "../ratings/RateMatch";
import { RatingsNote } from "../ratings/RatingsNote";
import { ExternalLink } from "./ExternalLink";

// The API ranks closest to the person first; the top few are the ones worth
// reading, the rest are one click away.
const SHOWN_FIRST = 4;

export function FittingRolesSection({
  detail,
  ratings,
}: {
  detail: CompanyDetail;
  ratings: MatchRatings;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showPassed, setShowPassed] = useState(false);
  const fitting = detail.fitting_roles ?? [];
  const fittingKeys = new Set(fitting.map((role) => role.key));
  // Passed on before this page loaded, so the API already left them out.
  const passed = (detail.ratings ?? []).filter(
    (r) =>
      r.role_key &&
      !fittingKeys.has(r.role_key) &&
      ratings.get(detail.id, r.role_key)?.verdict === "down",
  );
  if (fitting.length === 0 && passed.length === 0) return null;
  const shown = expanded ? fitting : fitting.slice(0, SHOWN_FIRST);

  return (
    <DashboardPanel
      title="Jobs here that fit you"
      meta={<span className="utility-label text-ink-faint">{fitting.length}</span>}
    >
      {fitting.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {shown.map((role) => {
            const hidden = ratings.get(detail.id, role.key)?.verdict === "down";
            return (
              <Card
                as="li"
                key={role.key}
                variant="nested"
                padding="sm"
                className="flex flex-col gap-3"
              >
                <div className={hidden ? "opacity-50" : undefined}>
                  <ExternalLink href={role.url} className="text-sm font-sans-semibold">
                    {role.title}
                  </ExternalLink>
                  <p className="mt-1 text-xs text-ink-muted">
                    {hidden ? "Hidden from your matches" : role.reason}
                  </p>
                </div>
                {hidden ? null : (
                  <MatchDetails
                    band={role.match.band}
                    score={role.match.score}
                    parts={role.match.parts}
                    matched={role.match.matched_skills}
                    missing={role.match.missing_skills}
                  />
                )}
                <div className="mt-auto border-t border-line pt-3">
                  <RateMatch
                    ratings={ratings}
                    companyId={detail.id}
                    roleKey={role.key}
                    subject={role.title}
                  />
                </div>
              </Card>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-ink-muted">You passed on every role that fit you here.</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {fitting.length > SHOWN_FIRST ? (
          <Button variant="quiet" size="sm" onClick={() => setExpanded((open) => !open)}>
            {expanded ? "Show fewer" : `Show all ${fitting.length} that fit`}
          </Button>
        ) : null}
        {passed.length > 0 ? (
          <Button variant="ghost" size="sm" onClick={() => setShowPassed((open) => !open)}>
            {showPassed
              ? "Hide roles you passed on"
              : `${passed.length} ${passed.length === 1 ? "role" : "roles"} you passed on`}
          </Button>
        ) : null}
      </div>

      {showPassed && passed.length > 0 ? (
        <ul className="mt-3 flex flex-col divide-y divide-line rounded-nest bg-surface-raised px-4">
          {passed.map((rating) => (
            <li
              key={rating.role_key}
              className="flex flex-wrap items-center justify-between gap-2 py-3"
            >
              <ExternalLink href={rating.role_url ?? null} className="text-sm">
                {rating.role_title ?? "A role"}
              </ExternalLink>
              <RateMatch
                ratings={ratings}
                companyId={detail.id}
                roleKey={rating.role_key}
                subject={rating.role_title ?? "this role"}
              />
            </li>
          ))}
        </ul>
      ) : null}

      {detail.old_roles ? (
        <p className="mt-4 text-xs text-ink-faint">
          {detail.old_roles} {detail.old_roles === 1 ? "role was" : "roles were"} posted over 90
          days ago and {detail.old_roles === 1 ? "is" : "are"} left out: most roles fill within two
          months.
        </p>
      ) : null}
      <RatingsNote className="mt-2" />
    </DashboardPanel>
  );
}
