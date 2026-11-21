"use client";

import { ThemeControl } from "@/components/composed/ThemeControl";
import { CareerArcStatus } from "@/components/composed/profile/CareerArcStatus";
import { Skeleton } from "@/components/ui/Skeleton";
import { useProfile } from "@/hooks/useProfile";

import { DashboardPanel } from "../DashboardPanel";
import { PageNotice, SetupNotice } from "../PageNotice";
import { CadenceOptions } from "./CadenceOptions";
import { LearningSection } from "./LearningSection";
import { OpportunityAlertsToggle } from "./OpportunityAlertsToggle";
import { PasswordForm } from "./PasswordForm";
import { SettingRow } from "./SettingRow";

const SKELETON_SECTIONS = 3;

const SECTIONS: [string, string][] = [
  ["account", "Account"],
  ["password", "Password"],
  ["appearance", "Appearance"],
  ["cadence", "Follow-up cadence"],
  ["alerts", "Opportunity alerts"],
  ["learning", "Learning"],
  ["career-arc", "Career arc"],
];

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
    <div className="split" style={{ display: "flex", gap: 56, maxWidth: 1000 }}>
      <nav aria-label="Settings sections" style={{ width: 190, flex: "none" }}>
        <div style={{ position: "sticky", top: 80 }}>
          {SECTIONS.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="ni" style={{ height: 34 }}>
              {label}
            </a>
          ))}
        </div>
      </nav>
      <div style={{ flex: 1, minWidth: 0, maxWidth: 760 }} className="space-y-6">
        <DashboardPanel id="account" title="Account">
          <SettingRow
            label="Email"
            hint="Your sign-in address. Changing it needs re-verification, which isn't built yet."
          >
            <p className="break-all font-mono text-sm text-ink">{profile.email}</p>
          </SettingRow>
        </DashboardPanel>

        <DashboardPanel id="password" title="Password">
          <PasswordForm />
        </DashboardPanel>

        <DashboardPanel id="appearance" title="Appearance">
          <SettingRow label="Theme" hint="Dark is the default. Light is easier in a bright room.">
            <ThemeControl />
          </SettingRow>
        </DashboardPanel>

        <DashboardPanel
          id="cadence"
          title="Follow-up cadence"
          description="How many follow-ups get drafted after the initial outreach, for both email and LinkedIn. Each one is drafted on demand from its tab on a contact's page."
        >
          <CadenceOptions />
        </DashboardPanel>

        <DashboardPanel
          id="alerts"
          title="Opportunity alerts"
          description="Public posts that fit you: a hiring post for one of your target roles, or news from a company you saved. Matched on your target roles, skills, location, work preference and saved companies, each with the reasons it was picked. Your resume text, history and contact details are never used."
        >
          <OpportunityAlertsToggle />
        </DashboardPanel>

        <section id="learning" className="scroll-mt-24">
          <DashboardPanel
            title="Learning from your ratings"
            description="Inroad learns from your ratings. When you mark a role or company as a good fit or not for me, that rating changes which roles and companies you see. Only the rated job's facts are used: its company, role type, technologies, location and level. Never your resume or contact details."
          >
            <LearningSection />
          </DashboardPanel>
        </section>

        {/* There is no file to show: what gets kept is the parsed result, not
          the document it came from. */}
        <DashboardPanel id="career-arc" title="Career arc document">
          <CareerArcStatus isParsed={Boolean(profile.career_arc_parsed_json)} />
        </DashboardPanel>
      </div>
    </div>
  );
}
