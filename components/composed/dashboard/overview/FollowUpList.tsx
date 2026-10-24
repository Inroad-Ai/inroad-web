import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatRelativeDays } from "@/lib/format";
import type { Company } from "@/lib/types";

import { DashboardPanel } from "../DashboardPanel";
import { CompanyRow } from "./CompanyRow";

export function FollowUpList({ companies }: { companies: Company[] }) {
  return (
    <DashboardPanel
      eyebrow="Needs attention"
      title="Follow up next"
      description="The companies that have gone longest without a status change."
    >
      <ul className="grid gap-0.5">
        {companies.map((company) => (
          <CompanyRow
            key={company.id}
            company={company}
            detail={`Updated ${formatRelativeDays(company.updated_at)}`}
            trailing={<StatusBadge stage={company.stage} />}
          />
        ))}
      </ul>
    </DashboardPanel>
  );
}
