"use client";

import Link from "next/link";

import type { Profile } from "@/lib/api-client/client";
import { companyDisplayName } from "@/lib/company-brief";
import type { Company } from "@/lib/types";

import { Ic } from "../kit";

/** Three things worth searching for, each saying why it was picked. */
export function DiscoverSuggestions({
  profile,
  recent,
  matchBusy,
  onFindMatches,
}: {
  profile: Profile | null;
  recent: Company[] | null;
  matchBusy: boolean;
  onFindMatches: () => void;
}) {
  const role = profile?.target_roles[0];
  const hiring = recent?.find((company) => (company.open_roles ?? 0) > 0) ?? recent?.[0];

  return (
    <div className="row wrap" style={{ gap: 10, marginTop: 18 }}>
      <span className="sm faint">Suggested for you</span>

      <span className="suggest">
        <button type="button" className="pill" onClick={onFindMatches} disabled={matchBusy}>
          <Ic n="spark" size="xs" />
          {role ? `${role} roles that fit you` : "Companies that fit your profile"}
        </button>
        <span className="why" role="tooltip">
          <b>Why this suggestion</b>
          {role
            ? `Your profile targets ${profile?.target_roles.join(", ")}. This runs a match scan with it.`
            : "This runs a match scan against your profile."}
        </span>
      </span>

      <span className="suggest">
        <Link href="/research/results" className="pill">
          <Ic n="spark" size="xs" />
          Companies that hire from open source
        </Link>
        <span className="why" role="tooltip">
          <b>Why this suggestion</b>
          Teams that hire from open source can be reached through your work. Opens an example
          result.
        </span>
      </span>

      {hiring ? (
        <span className="suggest">
          <Link href={`/companies/${hiring.id}`} className="pill">
            <Ic n="spark" size="xs" />
            Who should I contact at {companyDisplayName(hiring)}?
          </Link>
          <span className="why" role="tooltip">
            <b>Why this suggestion</b>
            You researched it recently
            {hiring.open_roles ? ` and it has ${hiring.open_roles} open roles` : ""}.
          </span>
        </span>
      ) : null}
    </div>
  );
}
