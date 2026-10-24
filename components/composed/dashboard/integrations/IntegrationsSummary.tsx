import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PlugIcon } from "@/components/ui/Icons";
import { ProgressBar } from "@/components/ui/ProgressBar";

export function IntegrationsSummary({ connected, total }: { connected: number; total: number }) {
  return (
    <Card as="section" aria-label="Connected services">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-nest bg-signal-amber-subtle text-signal-amber">
            <PlugIcon />
          </span>
          <div className="min-w-0">
            <Eyebrow>Connected services</Eyebrow>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
              Connect the tools you already use to build a richer, more automated outreach workflow.
              Each connection is optional and only used for the work you explicitly start.
            </p>
          </div>
        </div>

        <Card variant="nested" padding="sm" className="shrink-0 lg:w-64">
          <p className="utility-label text-ink-muted">Connected</p>
          <p className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-3xl font-sans-semibold tracking-display text-ink">
              {connected}
            </span>
            <span className="text-sm text-ink-muted">of {total}</span>
          </p>
          <ProgressBar value={connected / total} label="Connected services" className="mt-3" />
        </Card>
      </div>
    </Card>
  );
}
