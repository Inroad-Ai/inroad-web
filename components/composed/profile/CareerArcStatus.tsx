import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { CAREER_ARC_PARSING_UNAVAILABLE } from "@/lib/profile";

export function CareerArcStatus({ isParsed }: { isParsed: boolean }) {
  return (
    <Card
      variant="nested"
      padding="sm"
      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <p className="text-sm font-sans-semibold text-ink">
          {isParsed ? "Career arc added" : "No career arc added"}
        </p>
        <p className="mt-1 text-xs text-ink-muted">{CAREER_ARC_PARSING_UNAVAILABLE}</p>
      </div>
      <Badge tone={isParsed ? "success" : "neutral"} dot={isParsed}>
        {isParsed ? "Parsed" : "Not added"}
      </Badge>
    </Card>
  );
}
