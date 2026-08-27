/** careers-roles only means "couldn't list specific open-role titles" -
 * homepage, news, hiring itself and the profile are all still good. That's a
 * narrower miss than any other source failing, so it doesn't earn the same
 * "this run is stale, don't trust it" banner. */
const NARROW_MISS_SOURCE = "careers-roles";

export function PartialRunNotice({ errors }: { errors: Record<string, string> }) {
  const failedSources = Object.entries(errors);
  const onlyMissingRoleTitles =
    failedSources.length === 1 && failedSources[0][0] === NARROW_MISS_SOURCE;

  if (onlyMissingRoleTitles) {
    return (
      <div role="status" className="mb-5 rounded-sm border border-line bg-surface-raised p-5">
        <p className="text-sm text-text-secondary">
          Everything else came back fine - just couldn&apos;t list specific open-role titles from
          their careers page this run. Run research again to try that once more.
        </p>
      </div>
    );
  }

  return (
    <div
      role="status"
      className="mb-5 rounded-sm border border-muted-rose/40 bg-muted-rose-subtle p-5"
    >
      <p className="utility-label text-muted-rose">This run came back incomplete</p>
      <p className="mt-2 text-sm text-text-secondary">
        {failedSources.length} {failedSources.length === 1 ? "source" : "sources"} did not answer,
        so what is below may be out of date or missing. Run research again to try them once more.
      </p>
      {failedSources.length > 0 ? (
        <ul className="mt-3 space-y-1">
          {failedSources.map(([source, reason]) => (
            <li key={source} className="text-sm text-text-secondary">
              <span className="text-ink">{source}</span>: {reason}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
