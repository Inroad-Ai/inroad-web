"use client";

import { Notice } from "@/components/ui/Notice";
import { Skeleton } from "@/components/ui/Skeleton";
import { Switch } from "@/components/ui/Switch";
import { useSettings } from "@/hooks/useSettings";

import { SettingRow } from "./SettingRow";

/** Saves on change, like the cadence options. */
export function OpportunityAlertsToggle() {
  const { settings, loading, saving, error, update } = useSettings();
  const enabled = settings?.opportunity_alerts_enabled ?? false;

  return (
    <div>
      <SettingRow
        label="In-app alerts"
        hint={
          enabled
            ? "On. New matches show under the bell, at most 3 a day."
            : "Off. Nothing about you is used for alerts while this is off."
        }
      >
        {loading || !settings ? (
          error ? null : (
            <Skeleton className="h-6 w-11 rounded-full" />
          )
        ) : (
          <Switch
            checked={enabled}
            disabled={saving}
            label="Opportunity alerts"
            onChange={(next) => update({ opportunity_alerts_enabled: next })}
          />
        )}
      </SettingRow>
      {error ? (
        <Notice size="xs" className="mt-3">
          {error}
        </Notice>
      ) : null}
    </div>
  );
}
