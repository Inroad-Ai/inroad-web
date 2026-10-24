"use client";

import { useRouter } from "next/navigation";

import { SignOutIcon, SlidersIcon, UserIcon } from "@/components/ui/Icons";
import { Avatar } from "@/components/ui/Avatar";
import { Menu } from "@/components/ui/Menu";
import { useSignOut } from "@/hooks/useSignOut";
import type { Profile } from "@/lib/api-client/client";

import { PROFILE_HREF } from "./nav/nav.constants";

/** No profile means onboarding was never finished, or it is still loading.
 * Either way the menu stays, so sign out is always reachable. */
export function AccountMenu({ profile }: { profile: Profile | null }) {
  const router = useRouter();
  const { signOut, signingOut } = useSignOut();
  const name = profile ? `${profile.first_name} ${profile.last_name}`.trim() : "";

  return (
    <Menu
      label="Account menu"
      size="md"
      trigger={
        <>
          <span className={`-mx-3 inline-flex ${name ? "xl:mr-0" : ""}`}>
            <Avatar name={name} size="sm" />
          </span>
          {name ? <span className="hidden max-w-32 truncate xl:inline">{name}</span> : null}
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
          onSelect: () => router.push(PROFILE_HREF),
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
