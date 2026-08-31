import { PageShell } from "@/components/composed/dashboard/PageShell";
import { ProfileForm } from "@/components/composed/profile/ProfileForm";

export default function ProfilePage() {
  return (
    <PageShell
      eyebrow="Inroad workspace"
      title="Profile"
      description="What the search runs on. Keep it current and the matches follow."
    >
      <ProfileForm />
    </PageShell>
  );
}
