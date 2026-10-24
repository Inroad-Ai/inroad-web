import type { DemoSource, Segment } from "@/lib/landing/ask-types";

import { CitationChip } from "./CitationChip";

/** One answer paragraph: plain and bold runs with numbered citations inline. */
export function SegmentText({
  segments,
  sources,
}: {
  segments: readonly Segment[];
  sources: readonly DemoSource[];
}) {
  return (
    <p>
      {segments.map((segment, i) =>
        "cite" in segment ? (
          <CitationChip key={i} number={segment.cite + 1} source={sources[segment.cite]} />
        ) : segment.strong ? (
          <strong key={i} className="font-sans-semibold text-ink">
            {segment.text}
          </strong>
        ) : (
          <span key={i}>{segment.text}</span>
        ),
      )}
    </p>
  );
}
