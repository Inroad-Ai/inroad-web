import type { OutreachDraft } from "@/lib/api-client/client";
import { formatTimestamp, plural } from "@/lib/format";
import type { PersonDetail } from "@/lib/types";
import { PersonStageBadge } from "@/components/ui/PersonStageBadge";

import { DashboardPanel } from "../DashboardPanel";

interface HistoryEvent {
  label: string;
  at: string;
}

function historyOf(detail: PersonDetail, drafts: OutreachDraft[]): HistoryEvent[] {
  const latestDraft = [...drafts].sort(
    (first, second) => Date.parse(second.updated_at) - Date.parse(first.updated_at),
  )[0];

  return [
    { label: "Contact added", at: detail.created_at },
    ...(detail.contacted_at ? [{ label: "Marked as contacted", at: detail.contacted_at }] : []),
    ...(latestDraft ? [{ label: "Latest draft updated", at: latestDraft.updated_at }] : []),
  ];
}

export function EngagementHistory({
  detail,
  drafts,
}: {
  detail: PersonDetail;
  drafts: OutreachDraft[];
}) {
  const sentDrafts = drafts.filter((draft) => draft.sent_at).length;
  const events = historyOf(detail, drafts);

  return (
    <DashboardPanel title="Engagement history" meta={<PersonStageBadge stage={detail.stage} />}>
      <ol className="relative">
        {events.map((event, index) => (
          <li key={event.label} className="relative flex gap-4 pb-5 last:pb-0">
            {index < events.length - 1 ? (
              <span aria-hidden className="absolute left-1 top-4 h-full w-px bg-line" />
            ) : null}
            <span
              aria-hidden
              className="relative mt-1.5 h-2 w-2 shrink-0 rounded-full bg-signal-teal ring-4 ring-signal-teal-subtle"
            />
            <div>
              <p className="text-sm font-sans-semibold text-ink">{event.label}</p>
              <p className="mt-0.5 font-mono text-xs text-ink-muted">{formatTimestamp(event.at)}</p>
            </div>
          </li>
        ))}
      </ol>
      {sentDrafts > 0 ? (
        <p className="mt-5 border-t border-line pt-4 text-sm text-ink-muted">
          {plural(sentDrafts, "recorded message", "recorded messages")} sent.
        </p>
      ) : null}
    </DashboardPanel>
  );
}
