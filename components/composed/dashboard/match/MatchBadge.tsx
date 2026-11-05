import { Badge, type BadgeTone } from "@/components/ui/Badge";

const BANDS: Record<string, { label: string; tone: BadgeTone }> = {
  strong: { label: "Strong match", tone: "success" },
  good: { label: "Good match", tone: "teal" },
  possible: { label: "Possible match", tone: "neutral" },
};

export function MatchBadge({ band, score }: { band: string; score: number }) {
  const { label, tone } = BANDS[band] ?? BANDS.possible;
  return (
    <Badge tone={tone} dot>
      {label} · {score}
    </Badge>
  );
}
