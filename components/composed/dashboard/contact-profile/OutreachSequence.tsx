import type { OutreachDraft } from "@/lib/api-client/client";
import { formatTimestamp } from "@/lib/format";
import type { PersonDetail } from "@/lib/types";

import { Ic } from "../v2/kit";

interface Step {
  title: string;
  meta: string;
  state: "done" | "now" | "";
}

function stepsOf(detail: PersonDetail, drafts: OutreachDraft[]): Step[] {
  const drafted = new Set(drafts.map((draft) => draft.sequence_index));
  const highest = drafted.size > 0 ? Math.max(...drafted) : 0;
  const followUps = Math.max(1, highest);
  const steps: Step[] = [];

  const sent = Boolean(detail.contacted_at);
  steps.push({
    title: "First message",
    meta: sent
      ? `Contacted ${formatTimestamp(detail.contacted_at as string)}`
      : drafted.has(0)
        ? "Draft ready"
        : "Not drafted yet",
    state: sent ? "done" : drafted.has(0) ? "now" : "",
  });

  for (let index = 1; index <= followUps; index += 1) {
    steps.push({
      title: `Follow-up ${index}`,
      meta: drafted.has(index) ? "Draft ready" : "After the previous message",
      state: !sent && !drafted.has(0) ? "" : drafted.has(index) && sent ? "now" : "",
    });
  }
  return steps;
}

export function OutreachSequence({
  detail,
  drafts,
}: {
  detail: PersonDetail;
  drafts: OutreachDraft[];
}) {
  const steps = stepsOf(detail, drafts);

  return (
    <div style={{ marginBottom: 28 }}>
      <div className="xs faint" style={{ marginBottom: 12 }}>
        Sequence
      </div>
      {steps.map((step, i) => (
        <div
          key={step.title}
          className="row"
          style={{ alignItems: "flex-start", gap: 12, padding: "8px 0" }}
        >
          <span
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              flex: "none",
              display: "grid",
              placeItems: "center",
              fontSize: 10.5,
              fontWeight: 700,
              marginTop: 1,
              ...(step.state === "done"
                ? { background: "rgb(var(--color-success))", color: "rgb(var(--color-paper))" }
                : step.state === "now"
                  ? {
                      background: "rgb(var(--color-signal-amber))",
                      color: "rgb(var(--color-on-amber))",
                    }
                  : { boxShadow: "inset 0 0 0 1px rgb(var(--color-ink-faint))" }),
            }}
          >
            {step.state === "done" ? <Ic n="check" size="xs" /> : i + 1}
          </span>
          <div>
            <div className={`sm ${step.state === "now" ? "m" : "muted"}`}>{step.title}</div>
            <div className="xs faint">{step.meta}</div>
          </div>
        </div>
      ))}
      <div className="note" style={{ marginTop: 16, fontSize: 13 }}>
        <Ic n="clock" size="s" />
        <span>
          Best time: <b style={{ color: "rgb(var(--color-ink))" }}>Thursday 09:10</b> their time.
        </span>
      </div>
    </div>
  );
}
