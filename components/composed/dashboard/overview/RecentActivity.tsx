import { STAGE_LABEL } from "@/components/ui/StatusBadge";
import { formatRelativeDays } from "@/lib/format";
import type { Company } from "@/lib/types";

import { DashboardPanel } from "../DashboardPanel";
import { CompanyRow } from "./CompanyRow";

/** The companies that changed most recently: research, notes or a new stage. */
export function RecentActivity({ companies }: { companies: Company[] }) {
  return (
    <DashboardPanel eyebrow="Latest" title="Recent activity">
      <ul className="grid gap-0.5">
        {companies.map((company) => (
          <CompanyRow
            key={company.id}
            company={company}
            detail={`${STAGE_LABEL[company.stage]} · updated ${formatRelativeDays(company.updated_at)}`}
          />
        ))}
      </ul>
    </DashboardPanel>
  );
}
