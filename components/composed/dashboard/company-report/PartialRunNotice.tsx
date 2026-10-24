import { Card } from "@/components/ui/Card";
import { AlertCircleIcon } from "@/components/ui/Icons";
import { plural } from "@/lib/format";

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
      <Card role="status" padding="sm">
        <p className="text-sm text-ink-muted">
          Everything else came back fine. We just couldn&apos;t list specific open-role titles from
          their careers page this run. Run research again to try that once more.
        </p>
      </Card>
    );
  }

  return (
    <div role="status" className="flex gap-3 rounded-card bg-error-subtle p-4 text-error">
      <span className="mt-0.5">
        <AlertCircleIcon />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-sans-bold">This run came back incomplete</p>
        <p className="mt-1 text-sm text-ink-muted">
          {plural(failedSources.length, "source", "sources")} did not answer, so what is below may
          be out of date or missing. Run research again to try them once more.
        </p>
        {failedSources.length > 0 ? (
          <ul className="mt-2 space-y-1">
            {failedSources.map(([source, reason]) => (
              <li key={source} className="break-words text-sm text-ink-muted">
                <span className="font-sans-semibold text-ink">{source}</span>: {reason}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
