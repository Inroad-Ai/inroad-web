"use client";

import type { FollowUpCadence } from "@/lib/api-client/client";
import { Notice } from "@/components/ui/Notice";
import { SelectableCard } from "@/components/ui/SelectableCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { useSettings } from "@/hooks/useSettings";

// Total messages per channel = 1 initial + the follow-ups. Mirrors
// FOLLOW_UP_COUNTS in app/schemas/settings.py.
const CADENCE_OPTIONS: { value: FollowUpCadence; label: string; description: string }[] = [
  { value: "light", label: "Light", description: "3 follow-ups, 4 emails total" },
  { value: "standard", label: "Standard", description: "5 follow-ups, 6 emails total" },
  { value: "aggressive", label: "Aggressive", description: "6 follow-ups, 7 emails total" },
];

/** Saves on click: there is no form around it and nothing else to confirm. */
export function CadenceOptions() {
  const { settings, loading, saving, error, update } = useSettings();

  return (
    <div>
      {loading || !settings ? (
        error ? null : (
          <div className="grid gap-3 sm:grid-cols-3" role="status" aria-label="Loading">
            {CADENCE_OPTIONS.map((option) => (
              <Skeleton key={option.value} className="h-20 rounded-nest" />
            ))}
          </div>
        )
      ) : (
        <div
          role="group"
          aria-label="Follow-up cadence"
          aria-busy={saving}
          className="grid gap-3 sm:grid-cols-3"
        >
          {CADENCE_OPTIONS.map((option) => (
            <SelectableCard
              key={option.value}
              selected={settings.follow_up_cadence === option.value}
              onClick={() => update(option.value)}
            >
              <span className="block font-display text-lg font-sans-semibold tracking-heading">
                {option.label}
              </span>
              <span className="mt-1 block text-xs text-ink-muted">{option.description}</span>
            </SelectableCard>
          ))}
        </div>
      )}
      {saving ? (
        <p className="mt-3 text-xs text-ink-muted" role="status">
          Saving...
        </p>
      ) : null}
      {error ? (
        <Notice size="xs" className="mt-3">
          {error}
        </Notice>
      ) : null}
    </div>
  );
}
