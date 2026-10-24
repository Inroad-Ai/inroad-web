/** What this research did not gather, or found nothing stating. Neutral on
 * purpose: unknown is not a failure (PartialRunNotice) and not a negative
 * finding. */
export function NotCollectedNotice({ notCollected }: { notCollected: Record<string, string> }) {
  const entries = Object.entries(notCollected);
  if (entries.length === 0) return null;
  return (
    <div role="note" className="mb-5 rounded-sm border border-line bg-surface-raised p-5">
      <p className="utility-label text-text-secondary">Not covered by this research</p>
      <ul className="mt-2 space-y-1">
        {entries.map(([source, reason]) => (
          <li key={source} className="text-sm text-text-secondary">
            <span className="text-ink">{source}</span>: {reason}
          </li>
        ))}
      </ul>
    </div>
  );
}
