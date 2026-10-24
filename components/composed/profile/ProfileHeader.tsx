import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { completionPercent, type FormState } from "./profile-form-state";

export function ProfileHeader({ form }: { form: FormState }) {
  const completion = completionPercent(form);
  const stats = [
    { label: "Roles", value: form.targetRoles.length },
    { label: "Skills", value: form.skills.length },
    { label: "Experience", value: form.workHistory.length },
  ];

  return (
    <Card as="section" aria-label="Profile summary">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar name={`${form.firstName} ${form.lastName}`} size="xl" />
          <div className="min-w-0">
            <Eyebrow>Candidate profile</Eyebrow>
            <h2 className="mt-1.5 truncate font-display text-2xl font-sans-semibold tracking-heading text-ink">
              {form.firstName || "Your"} {form.lastName || "profile"}
            </h2>
            <p className="mt-1 truncate text-sm text-ink-muted">{form.email}</p>
          </div>
        </div>
        <dl className="grid grid-cols-3 gap-2 lg:min-w-80">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              variant="nested"
              padding="none"
              className="flex min-w-0 flex-col-reverse gap-1 px-2 py-3 text-center sm:px-4"
            >
              <dt className="utility-label text-ink-muted">{stat.label}</dt>
              <dd className="font-display text-xl font-sans-semibold tracking-heading text-ink">
                {stat.value}
              </dd>
            </Card>
          ))}
        </dl>
      </div>

      <div className="mt-6 flex flex-col gap-2 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-muted">
          Your profile shapes company matching, research, and the outreach drafts prepared in
          Inroad.
        </p>
        <span className="utility-label whitespace-nowrap text-ink">{completion}% complete</span>
      </div>
      <ProgressBar value={completion / 100} label="Profile completeness" className="mt-3" />
    </Card>
  );
}
