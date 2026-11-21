import type { CompanyBrief } from "@/lib/company-brief";
import type { CompanyDetail } from "@/lib/types";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { ExternalLinkIcon } from "@/components/ui/Icons";
import { safeHref } from "@/lib/safe-href";

function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

/** The dossier's identity: logo, name, one-line summary and a few facts. */
export function HeroBand({ detail, brief }: { detail: CompanyDetail; brief: CompanyBrief }) {
  const homepage = safeHref(detail.homepage_url);

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
      <CompanyLogo logoUrl={detail.logo_url} seed={detail.domain} size="xl" />
      <div className="min-w-0">
        <h2 className="break-words font-display text-2xl font-sans-semibold leading-display tracking-heading text-ink">
          {brief.name}
        </h2>
        {brief.summary ? (
          <p className="mt-1 max-w-3xl text-base leading-snug text-ink-muted">{brief.summary}</p>
        ) : null}
        {brief.chips.length > 0 || homepage ? (
          <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
            {brief.chips.map((chip) => (
              <li key={chip}>{chip}</li>
            ))}
            {homepage ? (
              <li>
                <a
                  href={homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex max-w-full items-center gap-1.5 text-ink transition-colors duration-fast hover:text-signal-teal"
                >
                  <span className="truncate">{hostOf(homepage)}</span>
                  <ExternalLinkIcon />
                </a>
              </li>
            ) : null}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
