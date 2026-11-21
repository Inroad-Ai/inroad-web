import { Avatar } from "@/components/ui/Avatar";
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
    <section aria-label="Profile summary" className="border-b border-line pb-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar name={`${form.firstName} ${form.lastName}`} size="xl" />
          <div className="min-w-0">
            <h2 className="truncate font-display text-2xl font-sans-semibold tracking-heading text-ink">
              {form.firstName || "Your"} {form.lastName || "profile"}
            </h2>
            <p className="mt-1 truncate text-sm text-ink-muted">{form.email}</p>
          </div>
        </div>
        <dl className="flex gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse gap-0.5">
              <dt className="text-xs text-ink-muted">{stat.label}</dt>
              <dd className="font-display text-xl font-sans-semibold tracking-heading text-ink">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-muted">
          Your profile shapes company matching, research, and the outreach drafts prepared in
          Inroad.
        </p>
        <span className="whitespace-nowrap text-sm text-ink">{completion}% complete</span>
      </div>
      <ProgressBar value={completion / 100} label="Profile completeness" className="mt-3" />
    </section>
  );
}
