import { Button } from "@/components/ui/Button";
import { CheckIcon, SendIcon } from "@/components/ui/Icons";
import { DEMO_SENDER } from "@/lib/landing/ask-people";
import type { DemoAnswer } from "@/lib/landing/ask-types";

import { CitationChip } from "./CitationChip";
import { draftTokens } from "./draft-tokens";

type Draft = NonNullable<DemoAnswer["draft"]>;

/** A draft streaming in, then waiting for the visitor to approve it. */
export function DraftPanel({
  draft,
  sources,
  typedTokens,
  sent,
  approveTarget,
  onApprove,
}: {
  draft: Draft;
  sources: DemoAnswer["sources"];
  typedTokens: number;
  sent: boolean;
  approveTarget: string;
  onApprove: () => void;
}) {
  const tokens = draftTokens(draft.body);
  const isTyping = typedTokens < tokens.length;
  const to = `${draft.person.name} <${draft.person.email ?? "find email first"}>`;

  return (
    <div className="mt-3 overflow-hidden rounded-nest bg-surface-raised">
      <dl className="grid gap-1.5 border-b border-line px-3.5 py-3 text-sm">
        {[
          ["To", to],
          ["Subject", draft.subject],
        ].map(([label, value]) => (
          <div key={label} className="flex min-w-0 gap-2.5">
            <dt className="utility-label w-14 shrink-0 pt-0.5 text-ink-faint">{label}</dt>
            <dd className="min-w-0 truncate font-sans-medium text-ink">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="min-h-32 whitespace-pre-wrap px-3.5 py-3.5 text-sm text-ink-muted">
        {tokens.slice(0, typedTokens).join("")}
        {isTyping ? (
          <span
            aria-hidden
            className="ml-px inline-block h-4 w-2 animate-shimmer rounded-sm bg-signal-teal align-text-bottom"
          />
        ) : null}
      </p>
      <div className="flex flex-wrap items-center gap-2 border-t border-line px-3.5 py-2.5">
        <div className="utility-label mr-auto flex flex-wrap items-center gap-1 text-ink-faint">
          Facts used
          {draft.facts.map((index) => (
            <CitationChip key={index} number={index + 1} source={sources[index]} />
          ))}
        </div>
        {sent ? (
          <span className="inline-flex items-center gap-1.5 text-sm font-sans-semibold text-signal-teal">
            <CheckIcon />
            Sent from {DEMO_SENDER} · just now
          </span>
        ) : isTyping ? null : (
          <Button
            size="sm"
            icon={<SendIcon />}
            onClick={onApprove}
            data-demo-target={approveTarget}
          >
            Approve &amp; send
          </Button>
        )}
      </div>
    </div>
  );
}
