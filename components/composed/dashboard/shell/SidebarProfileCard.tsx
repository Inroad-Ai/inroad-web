import Link from "next/link";

import { completionPercent, toFormState } from "@/components/composed/profile/profile-form-state";
import { Avatar } from "@/components/ui/Avatar";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { Profile } from "@/lib/api-client/client";

import { PROFILE_HREF } from "../nav/nav.constants";

/** Who is signed in and how complete their profile is, since matching and
 * drafts are only as good as what is on it. Same percentage as the Profile
 * page header. */
export function SidebarProfileCard({
  profile,
  loading,
  collapsed,
  onNavigate,
}: {
  profile: Profile | null;
  loading: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const name = profile ? `${profile.first_name} ${profile.last_name}`.trim() : "";
  const strength = profile ? completionPercent(toFormState(profile)) : null;
  const label = strength === null ? "Your profile" : `${name}, profile ${strength}% complete`;

  return (
    <Link
      href={PROFILE_HREF}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      aria-label={collapsed ? label : undefined}
      className={`flex items-center gap-3 rounded-card bg-surface shadow-card transition duration-fast ease-standard hover:-translate-y-0.5 hover:shadow-card-hover ${
        collapsed ? "justify-center" : "p-2.5"
      }`}
    >
      <Avatar name={name} />
      {collapsed ? null : (
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-sans-semibold text-ink">
            {name || "Your profile"}
          </span>
          {strength === null ? (
            loading ? null : (
              <span className="block truncate text-xs text-ink-muted">Finish setting it up</span>
            )
          ) : (
            <>
              <span className="mt-0.5 flex items-center justify-between gap-2 text-xs text-ink-muted">
                Profile strength
                <span className="font-mono text-ink">{strength}%</span>
              </span>
              <ProgressBar value={strength / 100} className="mt-1.5" />
            </>
          )}
        </span>
      )}
    </Link>
  );
}
