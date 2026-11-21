import { PageShell } from "@/components/composed/dashboard/PageShell";
import { ProfileForm } from "@/components/composed/profile/ProfileForm";
import { ProfileTabs } from "@/components/composed/dashboard/v2/pages/ProfilePage";

export default function ProfilePage() {
  return (
    <PageShell
      title="Profile"
      description="What the search runs on. Keep it current and the matches follow."
      maxWidth={1000}
    >
      <ProfileTabs tab="details" />
      <div style={{ marginTop: 24 }}>
        <ProfileForm />
      </div>
    </PageShell>
  );
}
