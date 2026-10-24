"use client";

import { ThemeControl } from "@/components/composed/ThemeControl";
import { CareerArcStatus } from "@/components/composed/profile/CareerArcStatus";
import { Skeleton } from "@/components/ui/Skeleton";
import { useProfile } from "@/hooks/useProfile";

import { DashboardPanel } from "../DashboardPanel";
import { PageNotice, SetupNotice } from "../PageNotice";
import { CadenceOptions } from "./CadenceOptions";
import { SettingRow } from "./SettingRow";

const SKELETON_SECTIONS = 3;

/**
 * Account-level only. Everything about the person - name, contact, links,
 * skills, history, what they're looking for - lives on the Profile page and
 * is not duplicated here.
 */
export function SettingsPanel() {
  const { profile, loading, error } = useProfile();

  if (loading) {
    return (
      <div className="max-w-3xl space-y-6" role="status" aria-label="Loading your settings">
        {Array.from({ length: SKELETON_SECTIONS }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-card" />
        ))}
      </div>
    );
  }

  if (error) {
    return <PageNotice isError>{error}</PageNotice>;
  }

  if (!profile) {
    return <SetupNotice subject="account" />;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <DashboardPanel title="Account">
        <SettingRow
          label="Email"
          hint="Your sign-in address. Changing it needs re-verification, which isn't built yet."
        >
          <p className="break-all font-mono text-sm text-ink">{profile.email}</p>
        </SettingRow>
      </DashboardPanel>

      <DashboardPanel title="Appearance">
        <SettingRow label="Theme" hint="Dark is the default. Light is easier in a bright room.">
          <ThemeControl />
        </SettingRow>
      </DashboardPanel>

      <DashboardPanel
        title="Follow-up cadence"
        description="How many follow-ups get drafted after the initial outreach, for both email and LinkedIn. Each one is drafted on demand from its tab on a contact's page."
      >
        <CadenceOptions />
      </DashboardPanel>

      {/* There is no file to show: what gets kept is the parsed result, not
          the document it came from. */}
      <DashboardPanel title="Career arc document">
        <CareerArcStatus isParsed={Boolean(profile.career_arc_parsed_json)} />
      </DashboardPanel>
    </div>
  );
}
