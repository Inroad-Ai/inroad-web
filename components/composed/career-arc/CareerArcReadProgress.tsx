import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { describeProgress, progressFraction } from "@/lib/career-arc";

interface Progress {
  stage: string | null;
  done: number;
  total: number;
}

export function CareerArcReadProgress({
  fileName,
  progress,
}: {
  fileName: string | null;
  progress: Progress;
}) {
  return (
    <Card variant="nested" padding="md" className="space-y-3" role="status" aria-live="polite">
      <p className="truncate text-sm font-sans-semibold text-ink">{fileName}</p>
      <p className="text-sm text-signal-teal">{describeProgress(progress)}</p>
      <ProgressBar value={progressFraction(progress)} tone="teal" label="Reading your career arc" />
      <p className="text-xs text-ink-muted">
        A long career arc can take a few minutes. Keep this page open; if you leave it, come back
        and it picks up where it was.
      </p>
    </Card>
  );
}
