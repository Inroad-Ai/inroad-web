import type { RolePosting } from "@/lib/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { Eyebrow } from "@/components/ui/Eyebrow";

import { ExternalLink } from "./ExternalLink";

const ROW = "flex flex-wrap items-baseline gap-x-2 gap-y-1 py-2.5 text-sm text-ink";

/** Board postings with links when the sourcing backend sent them, otherwise
 * the plain sample titles. */
export function HiringRoles({
  postings,
  sampleRoles,
}: {
  postings: RolePosting[];
  sampleRoles: string[];
}) {
  if (postings.length > 0) {
    return (
      <div className="mt-6">
        <Eyebrow as="h3">Open roles on the company&apos;s job board</Eyebrow>
        <ul className="mt-2 divide-y divide-line">
          {postings.map((posting, index) => {
            const meta = [posting.department, posting.location].filter(Boolean).join(" · ");
            return (
              <li key={`${posting.title}-${index}`} className={ROW}>
                <ExternalLink href={posting.url} className="font-sans-semibold">
                  {posting.title}
                </ExternalLink>
                {meta ? <span className="text-ink-muted">{meta}</span> : null}
                {posting.availability === "not_seen_in_latest_scan" ? (
                  <span className="text-xs text-ink-muted">
                    not in the board&apos;s latest listing
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <Eyebrow as="h3">Open roles</Eyebrow>
      {sampleRoles.length === 0 ? (
        <EmptyState className="mt-2">No role titles came back with the last run.</EmptyState>
      ) : (
        <ul className="mt-2 divide-y divide-line">
          {sampleRoles.map((role) => (
            <li key={role} className={`${ROW} font-sans-semibold`}>
              {role}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
