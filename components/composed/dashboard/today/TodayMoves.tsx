import { Button } from "@/components/ui/Button";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { RowList, RowListItem } from "@/components/ui/RowList";

import type { TodayMove } from "./today-moves";

export function TodayMoves({ moves }: { moves: TodayMove[] }) {
  if (moves.length === 0) {
    return (
      <p className="py-3 text-sm text-ink-muted">
        You are caught up. Research a company or run a match to find your next one.
      </p>
    );
  }

  return (
    <RowList>
      {moves.map((move, index) => (
        <RowListItem
          key={move.companyId}
          leading={<CompanyLogo logoUrl={move.logoUrl} seed={move.domain} size="sm" />}
          title={move.title}
          detail={move.detail}
          trailing={
            <Button
              href={`/companies/${move.companyId}`}
              size="xs"
              variant={index === 0 ? "primary" : "quiet"}
            >
              Open
            </Button>
          }
        />
      ))}
    </RowList>
  );
}
