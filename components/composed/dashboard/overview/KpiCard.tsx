import type { ReactNode } from "react";

import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function KpiCard({
  label,
  value,
  context,
}: {
  label: string;
  value: ReactNode;
  context: ReactNode;
}) {
  return (
    <Card className="min-w-0">
      <Eyebrow as="h3">{label}</Eyebrow>
      <p className="mt-3 font-display text-4xl font-sans-semibold leading-display tracking-display text-ink tabular-nums">
        {value}
      </p>
      <p className="mt-2 text-sm text-ink-muted">{context}</p>
    </Card>
  );
}
