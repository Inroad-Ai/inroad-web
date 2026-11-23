"use client";

import { useEffect, useState } from "react";

import { PageNotice, SetupNotice } from "@/components/composed/dashboard/PageNotice";
import {
  AuthorityTab,
  ProjectInsights,
} from "@/components/composed/dashboard/v2/pages/ProfilePage";
import { Av, Bar, Btn, Views } from "@/components/composed/dashboard/v2/kit";
import { Skeleton } from "@/components/ui/Skeleton";
import { plural } from "@/lib/format";
import { CareerArcManager } from "./CareerArcManager";
import { CertificatesEditor } from "./CertificatesEditor";
import { EducationEditor } from "./EducationEditor";
import { LanguagesEditor } from "./LanguagesEditor";
import { OnlinePresenceFields } from "./OnlinePresenceFields";
import { PersonalDetailsFields } from "./PersonalDetailsFields";
import { ProfessionalStoryFields } from "./ProfessionalStoryFields";
import { ProfileSaveBar } from "./ProfileSaveBar";
import { RecruiterView, summaryText } from "./RecruiterView";
import { ProfileSection } from "./ProfileSection";
import { ProjectsEditor } from "./ProjectsEditor";
import { ResumeManager } from "./ResumeManager";
import { SearchPreferencesFields } from "./SearchPreferencesFields";
import { WorkHistoryEditor } from "./WorkHistoryEditor";
import { completionPercent, hasResumeData } from "./profile-form-state";
import { useProfileForm } from "./useProfileForm";

const SECTIONS = {
  personal: { id: "profile-personal", label: "Personal details" },
  online: { id: "profile-online", label: "Online presence" },
  resume: { id: "profile-resume", label: "Resume" },
  careerArc: { id: "profile-career-arc", label: "Career arc document" },
  search: { id: "profile-search", label: "Search preferences" },
  story: { id: "profile-story", label: "Professional story" },
  experience: { id: "profile-experience", label: "Experience" },
  projects: { id: "profile-projects", label: "Projects" },
  education: { id: "profile-education", label: "Education" },
  certificates: { id: "profile-certificates", label: "Certificates & achievements" },
  languages: { id: "profile-languages", label: "Languages" },
} as const;

type Tab = "authority" | "story" | "projects" | "search" | "documents";

const TAB_FOR_HASH: Record<string, Tab> = {
  "profile-career-arc": "documents",
  "profile-resume": "documents",
  "profile-search": "search",
  "profile-projects": "projects",
  "profile-personal": "story",
  "profile-online": "story",
  "profile-story": "story",
  "profile-experience": "story",
  "profile-education": "story",
  "profile-certificates": "story",
  "profile-languages": "story",
};

const TABS: { id: Tab; label: string }[] = [
  { id: "authority", label: "Authority" },
  { id: "story", label: "Story and experience" },
  { id: "projects", label: "Projects" },
  { id: "search", label: "Search preferences" },
  { id: "documents", label: "Documents" },
];

export function ProfileForm() {
  const controller = useProfileForm();
  const { profile, form, validationErrors: errors, update } = controller;
  const [tab, setTab] = useState<Tab>("story");
  const [recruiter, setRecruiter] = useState(false);
  const [shared, setShared] = useState(false);

  // Links like /profile#profile-career-arc land on the tab that holds that section.
  useEffect(() => {
    const target = TAB_FOR_HASH[window.location.hash.replace("#", "")];
    if (target) setTab(target);
  }, []);

  if (controller.loading) {
    return (
      <div role="status" className="space-y-6" aria-label="Loading your profile">
        <Skeleton className="h-16 w-72" />
        <Skeleton className="h-80 rounded-card" />
      </div>
    );
  }

  if (controller.error) {
    return <PageNotice isError>{controller.error}</PageNotice>;
  }

  if (!profile || !form) {
    return <SetupNotice subject="profile" />;
  }

  const name = `${form.firstName} ${form.lastName}`.trim();
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const subtitle = [form.targetRoles.join(", "), form.location].filter(Boolean).join(" · ");
  const completion = completionPercent(form);
  const editing = tab !== "authority" && !recruiter;

  async function shareSummary() {
    if (!form) return;
    try {
      await navigator.clipboard.writeText(summaryText(form));
      setShared(true);
      setTimeout(() => setShared(false), 1800);
    } catch {
      // Clipboard access can be refused; there is nothing else to fall back to.
    }
  }

  return (
    <div style={{ maxWidth: 1000 }}>
      <div className="row wrap" style={{ gap: 18 }}>
        <Av i={initials} c={2} size="xl" />
        <div style={{ minWidth: 0 }}>
          <h1 className="t" style={{ fontSize: 30 }}>
            {name || "Your profile"}
          </h1>
          {subtitle ? (
            <div className="sm muted" style={{ marginTop: 4 }}>
              {subtitle}
            </div>
          ) : null}
        </div>
        <span className="sp" />
        <Btn icon="eye" onClick={() => setRecruiter((on) => !on)}>
          {recruiter ? "Back to editing" : "View as a recruiter"}
        </Btn>
        <Btn kind="p" icon="link" onClick={shareSummary}>
          {shared ? "Copied" : "Share"}
        </Btn>
        <div style={{ width: 200 }}>
          <div className="xs faint" style={{ marginBottom: 6, textAlign: "right" }}>
            {completion}% complete
          </div>
          <Bar v={completion} tone={completion > 65 ? "green" : ""} />
        </div>
      </div>

      {recruiter ? (
        <div style={{ marginTop: 24 }}>
          <RecruiterView form={form} />
        </div>
      ) : (
        <>
          <div style={{ marginTop: 22 }}>
            <Views
              items={TABS.map((item) => ({
                l: item.label,
                n: item.id === "projects" ? form.projects.length : undefined,
                on: tab === item.id,
                onSelect: () => setTab(item.id),
              }))}
            />
          </div>

          <div style={{ marginTop: 24 }} className="space-y-6">
            {tab === "authority" ? <AuthorityTab /> : null}

            {tab === "story" ? (
              <>
                <ProfileSection section={SECTIONS.personal} meta="Required">
                  <PersonalDetailsFields form={form} errors={errors} update={update} />
                </ProfileSection>

                <ProfileSection section={SECTIONS.online} meta="Optional">
                  <OnlinePresenceFields form={form} errors={errors} update={update} />
                </ProfileSection>

                <ProfileSection section={SECTIONS.story} meta="Used for outreach">
                  <ProfessionalStoryFields form={form} update={update} />
                </ProfileSection>

                <ProfileSection
                  section={SECTIONS.experience}
                  meta={plural(form.workHistory.length, "role", "roles")}
                >
                  <WorkHistoryEditor
                    entries={form.workHistory}
                    onChange={(workHistory) => update("workHistory", workHistory)}
                  />
                </ProfileSection>

                <ProfileSection
                  section={SECTIONS.education}
                  meta={plural(form.education.length, "entry", "entries")}
                >
                  <EducationEditor
                    entries={form.education}
                    onChange={(education) => update("education", education)}
                  />
                </ProfileSection>

                <ProfileSection
                  section={SECTIONS.certificates}
                  meta={plural(form.certificates.length, "certificate", "certificates")}
                >
                  <CertificatesEditor
                    entries={form.certificates}
                    onChange={(certificates) => update("certificates", certificates)}
                  />
                </ProfileSection>

                <ProfileSection
                  section={SECTIONS.languages}
                  meta={plural(form.languages.length, "language", "languages")}
                >
                  <LanguagesEditor
                    entries={form.languages}
                    onChange={(languages) => update("languages", languages)}
                  />
                </ProfileSection>
              </>
            ) : null}

            {tab === "projects" ? (
              <>
                <ProfileSection
                  section={SECTIONS.projects}
                  meta={plural(form.projects.length, "project", "projects")}
                >
                  <ProjectsEditor
                    entries={form.projects}
                    onChange={(projects) => update("projects", projects)}
                  />
                </ProfileSection>
                <ProjectInsights />
              </>
            ) : null}

            {tab === "search" ? (
              <ProfileSection section={SECTIONS.search} meta="Used for matching">
                <SearchPreferencesFields
                  form={form}
                  errors={errors}
                  update={update}
                  onToggleWorkPreference={controller.toggleWorkPreference}
                />
              </ProfileSection>
            ) : null}

            {tab === "documents" ? (
              <>
                <ProfileSection section={SECTIONS.resume} meta="PDF or DOCX">
                  <ResumeManager
                    hasResume={hasResumeData(form)}
                    roleCount={form.workHistory.length}
                    skillCount={form.skills.length}
                    onParsed={controller.applyParsedResume}
                    onDeleted={controller.applyDeletedResume}
                  />
                </ProfileSection>

                <ProfileSection section={SECTIONS.careerArc} meta="Optional">
                  <CareerArcManager initial={profile.career_arc ?? null} />
                </ProfileSection>
              </>
            ) : null}

            {editing ? (
              <ProfileSaveBar
                isDirty={controller.isDirty}
                saving={controller.saving}
                saved={controller.saved}
                saveError={controller.saveError}
                onSave={controller.save}
              />
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
