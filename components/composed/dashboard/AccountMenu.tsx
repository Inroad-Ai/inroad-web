"use client";

import { useRouter } from "next/navigation";

import { SignOutIcon, SlidersIcon, UserIcon } from "@/components/ui/Icons";
import { Menu } from "@/components/ui/Menu";
import { useProfile } from "@/hooks/useProfile";
import { useSignOut } from "@/hooks/useSignOut";

export function AccountMenu() {
  const router = useRouter();
  const { profile } = useProfile();
  const { signOut, signingOut } = useSignOut();

  // No profile means onboarding was never finished, and a load error is the
  // profile page's problem to report, not the header's. Either way the menu
  // stays, so sign out is always reachable.
  const name = profile ? `${profile.first_name} ${profile.last_name}`.trim() : "";

  return (
    <Menu
      label="Account menu"
      trigger={
        <>
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-signal-teal-subtle font-display text-2xs font-semibold text-signal-teal">
            {name ? name.slice(0, 1).toUpperCase() : <UserIcon />}
          </span>
          {name ? (
            <span className="hidden max-w-32 truncate normal-case sm:inline">{name}</span>
          ) : null}
        </>
      }
      items={[
        {
          key: "profile",
          label: (
            <>
              <UserIcon />
              Profile
            </>
          ),
          onSelect: () => router.push("/profile"),
        },
        {
          key: "settings",
          label: (
            <>
              <SlidersIcon />
              Settings
            </>
          ),
          onSelect: () => router.push("/settings"),
        },
        {
          key: "sign-out",
          label: (
            <>
              <SignOutIcon />
              {signingOut ? "Signing out..." : "Sign out"}
            </>
          ),
          disabled: signingOut,
          onSelect: signOut,
        },
      ]}
    />
  );
}
