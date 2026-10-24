"use client";

import { PageNotice, SetupNotice } from "@/components/composed/dashboard/PageNotice";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { plural } from "@/lib/format";
import { CareerArcStatus } from "./CareerArcStatus";
import { CertificatesEditor } from "./CertificatesEditor";
import { EducationEditor } from "./EducationEditor";
import { LanguagesEditor } from "./LanguagesEditor";
import { OnlinePresenceFields } from "./OnlinePresenceFields";
import { PersonalDetailsFields } from "./PersonalDetailsFields";
import { ProfessionalStoryFields } from "./ProfessionalStoryFields";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileSaveBar } from "./ProfileSaveBar";
import { ProfileSection } from "./ProfileSection";
import { ProfileSectionNav } from "./ProfileSectionNav";
import { ProjectsEditor } from "./ProjectsEditor";
import { ResumeManager } from "./ResumeManager";
import { SearchPreferencesFields } from "./SearchPreferencesFields";
import { WorkHistoryEditor } from "./WorkHistoryEditor";
import { hasResumeData } from "./profile-form-state";
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

export function ProfileForm() {
  const controller = useProfileForm();
  const { profile, form, validationErrors: errors, update } = controller;

  if (controller.loading) {
    return (
      <div role="status" className="space-y-6" aria-label="Loading your profile">
        <Card>
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-56" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        </Card>
        <Skeleton className="h-80 rounded-card" />
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

  return (
    <div className="space-y-6">
      <ProfileHeader form={form} />

      <div className="flex gap-8">
        <ProfileSectionNav items={Object.values(SECTIONS)} />

        <div className="min-w-0 flex-1 space-y-6">
          <ProfileSection section={SECTIONS.personal} meta="Required">
            <PersonalDetailsFields form={form} errors={errors} update={update} />
          </ProfileSection>

          <ProfileSection section={SECTIONS.online} meta="Optional">
            <OnlinePresenceFields form={form} errors={errors} update={update} />
          </ProfileSection>

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
            <CareerArcStatus isParsed={Boolean(profile.career_arc_parsed_json)} />
          </ProfileSection>

          <ProfileSection section={SECTIONS.search} meta="Used for matching">
            <SearchPreferencesFields
              form={form}
              errors={errors}
              update={update}
              onToggleWorkPreference={controller.toggleWorkPreference}
            />
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
            section={SECTIONS.projects}
            meta={plural(form.projects.length, "project", "projects")}
          >
            <ProjectsEditor
              entries={form.projects}
              onChange={(projects) => update("projects", projects)}
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

          <ProfileSaveBar
            isDirty={controller.isDirty}
            saving={controller.saving}
            saved={controller.saved}
            saveError={controller.saveError}
            onSave={controller.save}
          />
        </div>
      </div>
    </div>
  );
}
