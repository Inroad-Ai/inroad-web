import { AlertCircleIcon, CheckCircleIcon, SpinnerIcon } from "@/components/ui/Icons";
import type { SourceState } from "@/lib/types";

export function StatusIcon({ state }: { state: SourceState }) {
  if (state === "pending") {
    return (
      <span className="inline-flex text-signal-amber">
        <SpinnerIcon />
      </span>
    );
  }
  if (state === "done") {
    return (
      <span className="inline-flex text-signal-teal">
        <CheckCircleIcon />
      </span>
    );
  }
  if (state === "failed") {
    return (
      <span className="inline-flex text-error">
        <AlertCircleIcon />
      </span>
    );
  }
  return <span aria-hidden className="mx-1 inline-block h-2 w-2 shrink-0 rounded-full bg-ink/20" />;
}
