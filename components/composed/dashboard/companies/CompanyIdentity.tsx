import type { Company } from "@/lib/types";
import { CompanyLogo } from "@/components/ui/CompanyLogo";

/** Logo, domain and the homepage's own title: how a company is named in
 * lists. The saved row has no separate company name, so none is made up. */
export function CompanyIdentity({
  company,
  size = "md",
}: {
  company: Pick<Company, "domain" | "logo_url" | "homepage_title">;
  size?: "sm" | "md";
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <CompanyLogo logoUrl={company.logo_url} seed={company.domain} size={size} />
      <div className="min-w-0">
        <p className="truncate text-sm font-sans-semibold text-ink">{company.domain}</p>
        {company.homepage_title ? (
          <p className="truncate text-xs text-ink-muted">{company.homepage_title}</p>
        ) : null}
      </div>
    </div>
  );
}
