"use client";

import { RATING_REASONS, reasonLabel, type MatchRatings } from "@/lib/match-ratings";
import type { MatchRating } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Menu } from "@/components/ui/Menu";
import { Notice } from "@/components/ui/Notice";

interface RateMatchProps {
  ratings: MatchRatings;
  companyId: string;
  /** Empty rates the company itself. */
  roleKey?: string;
  /** Read out with the buttons, e.g. the role title. */
  subject: string;
}

/**
 * Good fit / not for me on one role or on the company. Once rated it shows
 * the verdict with an undo, in the same place.
 */
export function RateMatch({ ratings, companyId, roleKey = "", subject }: RateMatchProps) {
  const rating = ratings.get(companyId, roleKey);
  const busy = ratings.isPending(companyId, roleKey);
  const error = ratings.errorFor(companyId, roleKey);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-center gap-2">
        {rating ? (
          <>
            <span className="text-xs text-ink-muted">{verdictText(rating, roleKey === "")}</span>
            <Button
              variant="ghost"
              size="xs"
              disabled={busy}
              aria-label={`Undo your rating of ${subject}`}
              onClick={() => ratings.undo(companyId, roleKey)}
            >
              Undo
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="quiet"
              size="xs"
              disabled={busy}
              aria-label={`${subject} is a good fit`}
              onClick={() => ratings.rate(companyId, roleKey, "up")}
            >
              Good fit
            </Button>
            {roleKey === "" ? (
              <Button
                variant="quiet"
                size="xs"
                disabled={busy}
                aria-label={`${subject} is not for me`}
                onClick={() => ratings.rate(companyId, roleKey, "down")}
              >
                Not for me
              </Button>
            ) : (
              <Menu
                label={`Why ${subject} is not for you`}
                trigger="Not for me"
                disabled={busy}
                align="left"
                items={RATING_REASONS.map((reason) => ({
                  key: reason.value,
                  label: reason.label,
                  onSelect: () => ratings.rate(companyId, roleKey, "down", [reason.value]),
                }))}
              />
            )}
          </>
        )}
      </div>
      {error ? <Notice size="xs">{error}</Notice> : null}
    </div>
  );
}

function verdictText(rating: MatchRating, forCompany: boolean): string {
  if (rating.verdict === "up") return "Marked as a good fit";
  if (forCompany) return "Not for me. Left out of your next steps.";
  const reasons = (rating.reasons ?? []).map(reasonLabel).join(", ");
  return reasons ? `Not for me: ${reasons}` : "Not for me";
}
