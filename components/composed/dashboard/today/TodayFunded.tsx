import Link from "next/link";

import type { FundedCompany } from "@/lib/api-client/client";
import { formatAmountUsd } from "@/lib/format";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { RowList, RowListItem } from "@/components/ui/RowList";

import { MatchBadge } from "../match/MatchBadge";

export function TodayFunded({ items }: { items: FundedCompany[] }) {
  return (
    <RowList>
      {items.map((company) => {
        const name = company.company_name ?? company.domain;
        const raised = [company.stage, formatAmountUsd(company.amount_usd)]
          .filter(Boolean)
          .join(", ");
        return (
          <RowListItem
            key={`${company.domain}-${company.announced_on}`}
            leading={<CompanyLogo logoUrl={null} seed={company.domain} size="sm" />}
            title={
              company.company_id ? (
                <Link href={`/companies/${company.company_id}`} className="hover:underline">
                  {name}
                </Link>
              ) : (
                name
              )
            }
            detail={[company.best_role.title, raised || "Raised funding"].join(" · ")}
            trailing={
              <MatchBadge
                band={company.best_role.match.band}
                score={company.best_role.match.score}
              />
            }
          />
        );
      })}
    </RowList>
  );
}
