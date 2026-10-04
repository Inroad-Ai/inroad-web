import { Button } from "@/components/ui/Button";

/** careers-roles only means "couldn't list specific open-role titles" -
 * homepage, news, hiring itself and the profile are all still good. That's a
 * narrower miss than any other source failing, so it doesn't earn the same
 * "this run is stale, don't trust it" banner. */
const NARROW_MISS_SOURCE = "careers-roles";

const SOURCE_LABELS: Record<string, string> = {
  homepage: "Website",
  "homepage-translation": "Website translation",
  news: "News",
  hiring: "Hiring information",
  linkedin: "LinkedIn company page",
  people: "People search",
  "contact-enrichment": "Contact details",
  "careers-roles": "Careers page role titles",
  "apply-url-check": "Application links",
  profile: "Company brief",
};

export function PartialRunNotice({
  errors,
  onRetry,
  rerunning,
  retryDisabled,
}: {
  errors: Record<string, string>;
  onRetry: () => void;
  rerunning: boolean;
  retryDisabled: boolean;
}) {
  const failedSources = Object.entries(errors);
  const onlyMissingRoleTitles =
    failedSources.length === 1 && failedSources[0][0] === NARROW_MISS_SOURCE;

  return (
    <div
      role="status"
      className={`mb-5 rounded-sm border p-5 ${onlyMissingRoleTitles ? "border-line bg-surface-raised" : "border-muted-rose/40 bg-muted-rose-subtle"}`}
    >
      <p
        className={`utility-label ${onlyMissingRoleTitles ? "text-text-secondary" : "text-muted-rose"}`}
      >
        This run came back incomplete
      </p>
      <p className="mt-2 text-sm text-text-secondary">
        {onlyMissingRoleTitles
          ? "The careers page was checked, but its open-role titles could not be listed."
          : `${failedSources.length} ${failedSources.length === 1 ? "part" : "parts"} of this research did not finish. The information below may be incomplete.`}
      </p>
      {failedSources.length > 0 ? (
        <ul className="mt-3 space-y-1">
          {failedSources.map(([source, reason]) => (
            <li key={source} className="text-sm text-text-secondary">
              <span className="font-medium text-ink">
                {SOURCE_LABELS[source] ?? source.replaceAll("-", " ")}
              </span>
              : {reason}
            </li>
          ))}
        </ul>
      ) : null}
      <Button variant="quiet" size="sm" onClick={onRetry} disabled={retryDisabled} className="mt-4">
        {rerunning ? "Checking again..." : "Retry research"}
      </Button>
    </div>
  );
}
