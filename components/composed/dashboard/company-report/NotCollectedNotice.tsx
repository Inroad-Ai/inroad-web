import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";

/** What this research did not gather, or found nothing stating. Neutral on
 * purpose: unknown is not a failure (PartialRunNotice) and not a negative
 * finding. */
export function NotCollectedNotice({ notCollected }: { notCollected: Record<string, string> }) {
  const entries = Object.entries(notCollected);
  if (entries.length === 0) return null;
  return (
    <Card role="note" padding="sm">
      <Eyebrow as="h2">Not covered by this research</Eyebrow>
      <ul className="mt-2 space-y-1">
        {entries.map(([source, reason]) => (
          <li key={source} className="text-sm text-ink-muted">
            <span className="font-sans-semibold text-ink">{source}</span>: {reason}
          </li>
        ))}
      </ul>
    </Card>
  );
}
