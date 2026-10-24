import Link from "next/link";
import type { ReactNode } from "react";

import { CompanyLogo } from "@/components/ui/CompanyLogo";
import type { Company } from "@/lib/types";

/** One company as a clickable list row: logo, name, a line of context and
 * whatever the caller puts on the right. */
export function CompanyRow({
  company,
  detail,
  trailing,
}: {
  company: Company;
  detail: string;
  trailing?: ReactNode;
}) {
  return (
    <li>
      <Link
        href={`/companies/${company.id}`}
        className="-mx-3 flex items-center gap-3 rounded-nest px-3 py-2.5 transition-colors duration-fast hover:bg-ink/5"
      >
        <CompanyLogo logoUrl={company.logo_url} seed={company.domain} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-sans-semibold text-ink">
            {company.homepage_title || company.domain}
          </span>
          <span className="mt-0.5 block truncate text-xs text-ink-muted">{detail}</span>
        </span>
        {trailing}
      </Link>
    </li>
  );
}
