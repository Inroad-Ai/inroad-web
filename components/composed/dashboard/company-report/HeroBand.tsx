import type { CompanyBrief } from "@/lib/company-brief";
import type { CompanyDetail } from "@/lib/types";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { ExternalLinkIcon } from "@/components/ui/Icons";
import { TintBand } from "@/components/ui/TintBand";
import { safeHref } from "@/lib/safe-href";

function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

/** The dossier's identity, on a band tinted with the company's own colour.
 * Text is chalk in both themes: every monogram fill clears AA against it. */
export function HeroBand({ detail, brief }: { detail: CompanyDetail; brief: CompanyBrief }) {
  const homepage = safeHref(detail.homepage_url);

  return (
    <TintBand seed={detail.domain}>
      <div className="relative flex flex-col gap-5 px-6 py-7 sm:flex-row sm:items-center sm:px-8 sm:py-9">
        <CompanyLogo
          logoUrl={detail.logo_url}
          seed={detail.domain}
          size="xl"
          className="ring-1 ring-chalk/30"
        />
        <div className="min-w-0">
          <h2 className="break-words font-display text-2xl font-sans-semibold leading-display tracking-heading text-chalk sm:text-3xl">
            {brief.name}
          </h2>
          {brief.summary ? (
            <p className="mt-2 max-w-3xl text-base leading-snug text-chalk/90">{brief.summary}</p>
          ) : null}
          {brief.chips.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {brief.chips.map((chip) => (
                <li
                  key={chip}
                  className="rounded-full bg-chalk/15 px-3 py-1 text-xs font-sans-semibold text-chalk"
                >
                  {chip}
                </li>
              ))}
            </ul>
          ) : null}
          {homepage ? (
            <a
              href={homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex h-8 max-w-full items-center gap-1.5 rounded-full bg-chalk/15 px-3 text-xs font-sans-semibold text-chalk transition-colors duration-fast hover:bg-chalk/25 focus-visible:outline-chalk"
            >
              <span className="truncate">{hostOf(homepage)}</span>
              <ExternalLinkIcon />
            </a>
          ) : null}
        </div>
      </div>
    </TintBand>
  );
}
