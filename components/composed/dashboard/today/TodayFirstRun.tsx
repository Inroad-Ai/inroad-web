import type { FundedCompany, Profile } from "@/lib/api-client/client";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

import { TodayFunded } from "./TodayFunded";

const STEPS = ["Profile imported", "Find companies", "Review matches", "Reach out"];
const CURRENT_STEP = 1;

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function lookingFor(profile: Profile | null): string | null {
  if (!profile || profile.target_roles.length === 0) return null;
  const where = [...profile.work_preference.map(capitalize), profile.location].filter(Boolean);
  return [profile.target_roles.join(", "), where.join(", ")].filter(Boolean).join(" · ");
}

export function TodayFirstRun({
  profile,
  funded,
}: {
  profile: Profile | null;
  funded: FundedCompany[];
}) {
  const search = lookingFor(profile);

  return (
    <div className="max-w-2xl">
      <p className="text-sm text-ink-muted">
        {profile ? `Welcome, ${profile.first_name}` : "Welcome"}
      </p>
      <h2 className="mt-2 font-display text-4xl font-sans-semibold tracking-display text-ink">
        {"Let's find your first inroad."}
      </h2>
      <p className="mt-3 max-w-xl text-ink-muted">
        Inroad finds companies that fit you, reads up on each one, and helps you write to the person
        who can hire you. Start with a search from your profile.
      </p>

      <ol className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        {STEPS.map((step, index) => (
          <li
            key={step}
            className={`flex items-center gap-2 ${index === CURRENT_STEP ? "font-sans-semibold text-ink" : "text-ink-faint"}`}
          >
            {index < CURRENT_STEP ? <CheckIcon className="h-4 w-4 text-success" /> : null}
            {step}
          </li>
        ))}
      </ol>

      {search ? (
        <div className="mt-8">
          <p className="text-xs text-ink-faint">We will look for</p>
          <p className="mt-1 text-lg text-ink">{search}</p>
        </div>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button href="/research?mode=match" size="lg" icon={<ArrowRightIcon />} iconPosition="end">
          Find companies for me
        </Button>
        <Button href="/research" variant="ghost" size="lg">
          Research a company I know
        </Button>
      </div>

      {funded.length > 0 ? (
        <Section title="Companies that fit you and just raised money" className="mt-14">
          <TodayFunded items={funded.slice(0, 3)} />
        </Section>
      ) : null}
    </div>
  );
}
