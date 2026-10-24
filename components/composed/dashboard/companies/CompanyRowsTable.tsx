import { describeHiring } from "@/lib/companies";
import { formatRelativeDays, formatTimestamp } from "@/lib/format";
import type { Company } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";

import { CompanyIdentity } from "./CompanyIdentity";

// Narrow screens drop the lower-priority columns instead of scrolling sideways.
const COLUMNS = [
  { label: "Company", className: "w-3/5 md:w-2/5" },
  { label: "Stage", className: "" },
  { label: "Hiring", className: "hidden md:table-cell" },
  { label: "Last researched", className: "hidden sm:table-cell" },
] as const;

const CELL = "px-5 py-3.5 align-middle";
const SKELETON_ROWS = 6;

export function CompanyRowsTable({
  companies,
  loading,
  onOpen,
}: {
  companies: Company[];
  loading: boolean;
  onOpen: (id: string) => void;
}) {
  return (
    <Card padding="none" className="overflow-hidden">
      <table className="w-full table-fixed text-left text-sm">
        <thead>
          <tr className="utility-label border-b border-line text-ink-muted">
            {COLUMNS.map((column) => (
              <th
                key={column.label}
                scope="col"
                className={`px-5 py-4 font-sans-medium ${column.className}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {loading
            ? Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                <tr key={i}>
                  {COLUMNS.map((column) => (
                    <td key={column.label} className={`${CELL} ${column.className}`}>
                      <Skeleton className="h-4 w-24" />
                    </td>
                  ))}
                </tr>
              ))
            : companies.map((company) => (
                <CompanyRow key={company.id} company={company} onOpen={onOpen} />
              ))}
        </tbody>
      </table>
    </Card>
  );
}

function CompanyRow({ company, onOpen }: { company: Company; onOpen: (id: string) => void }) {
  const hiring = describeHiring(company);

  return (
    <tr
      onClick={() => onOpen(company.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onOpen(company.id);
      }}
      tabIndex={0}
      role="button"
      aria-label={`Open ${company.domain}`}
      className="cursor-pointer transition-colors duration-fast hover:bg-ink/5 focus-visible:bg-ink/5 focus-visible:-outline-offset-2"
    >
      <td className={CELL}>
        <CompanyIdentity company={company} size="sm" />
      </td>
      <td className={CELL}>
        <StatusBadge stage={company.stage} />
      </td>
      <td
        className={`${CELL} ${COLUMNS[2].className} ${hiring.muted ? "text-ink-muted" : "font-sans-semibold text-ink"}`}
      >
        {hiring.label}
      </td>
      <td className={`${CELL} ${COLUMNS[3].className} text-ink-muted`}>
        <time dateTime={company.updated_at} title={formatTimestamp(company.updated_at)}>
          {formatRelativeDays(company.updated_at)}
        </time>
      </td>
    </tr>
  );
}
