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
export function HeroBand({ detail }: { detail: CompanyDetail }) {
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
          <h2 className="break-words font-display text-3xl font-sans-semibold leading-display tracking-display text-chalk sm:text-4xl">
            {detail.domain}
          </h2>
          {detail.homepage_title ? (
            <p className="mt-2 max-w-2xl text-base leading-snug text-chalk/90">
              {detail.homepage_title}
            </p>
          ) : null}
          {homepage ? (
            <a
              href={homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex h-8 max-w-full items-center gap-1.5 rounded-full bg-chalk/15 px-3 text-xs font-sans-semibold text-chalk transition-colors duration-fast hover:bg-chalk/25 focus-visible:outline-chalk"
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
