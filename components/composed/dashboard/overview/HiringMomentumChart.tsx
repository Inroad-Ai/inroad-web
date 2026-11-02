import type { HiringPoint } from "@/lib/api-client/client";
import { companyDisplayName } from "@/lib/company-brief";

import { DashboardPanel } from "../DashboardPanel";
import { ChartEmpty } from "./ChartEmpty";
import { RankedBars } from "./RankedBars";

/** Who is hiring fastest among the user's companies. */
export function HiringMomentumChart({ hiring }: { hiring: HiringPoint[] }) {
  const rows = hiring.map((point) => ({
    key: point.company_id,
    label: companyDisplayName({
      domain: point.domain,
      homepage_title: point.homepage_title ?? null,
    }),
    value: point.new_roles_30d,
  }));

  return (
    <DashboardPanel
      title="Hiring momentum"
      description="New roles each company posted in the last 30 days."
    >
      {rows.length === 0 ? (
        <div className="h-chart">
          <ChartEmpty message="None of your companies posted new roles in the last 30 days." />
        </div>
      ) : (
        <RankedBars
          rows={rows}
          valueName="New roles"
          ariaLabel={rows.map((row) => `${row.label}: ${row.value} new roles`).join(", ")}
        />
      )}
    </DashboardPanel>
  );
}
