import { Badge } from "@/components/ui/Badge";
import { LinkedinIcon, MailIcon } from "@/components/ui/Icons";
import type { DemoAnswer } from "@/lib/landing/ask-types";

import { CitationChip } from "./CitationChip";

/** The verified email and profile under a "who should I write to" answer. */
export function ContactLines({ contact }: { contact: NonNullable<DemoAnswer["contact"]> }) {
  return (
    <div className="mt-3 flex max-w-md flex-col gap-2 font-mono text-xs">
      <div className="flex min-h-10 items-center gap-2.5 rounded-nest bg-surface-raised px-3 py-2">
        <MailIcon className="h-4 w-4 text-ink-faint" />
        <span className="min-w-0 flex-1 truncate text-ink">{contact.email ?? "No email yet"}</span>
        <Badge tone={contact.email ? "teal" : "neutral"} dot>
          {contact.email ? "Verified" : "Find"}
        </Badge>
      </div>
      <div className="flex min-h-10 items-center gap-2.5 rounded-nest bg-surface-raised px-3 py-2">
        <LinkedinIcon className="h-4 w-4 text-ink-faint" />
        <span className="min-w-0 flex-1 truncate text-ink">{contact.linkedin}</span>
      </div>
    </div>
  );
}

/** Dated signals, newest first, each with its source. */
export function SignalTimeline({
  items,
  sources,
}: {
  items: NonNullable<DemoAnswer["timeline"]>;
  sources: DemoAnswer["sources"];
}) {
  return (
    <ol className="relative mt-3 grid gap-3 pl-6 before:absolute before:bottom-1.5 before:left-1.5 before:top-1.5 before:w-px before:bg-line">
      {items.map((item, i) => (
        <li
          key={`${item.company}-${item.text}`}
          className="relative flex items-baseline gap-2.5 text-sm"
        >
          <span
            aria-hidden
            className={`absolute -left-5 top-1.5 h-2.5 w-2.5 rounded-full border-2 ${
              i === 0
                ? "border-signal-amber bg-signal-amber ring-4 ring-signal-amber/15"
                : "border-ink/25 bg-surface"
            }`}
          />
          <span className="w-12 shrink-0 font-mono text-2xs text-ink-faint">{item.ago}</span>
          <span className="min-w-0 flex-1">
            <strong className="font-sans-semibold text-ink">{item.company}</strong> {item.text}{" "}
            <CitationChip number={item.cite + 1} source={sources[item.cite]} />
          </span>
        </li>
      ))}
    </ol>
  );
}
