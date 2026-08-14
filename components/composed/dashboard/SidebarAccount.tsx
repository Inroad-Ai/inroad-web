"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { SignOutIcon } from "@/components/ui/Icons";
import { useProfile } from "@/hooks/useProfile";
import { signOutNative } from "@/lib/auth-native/browser";

export function SidebarAccount({ collapsed }: { collapsed: boolean }) {
  const router = useRouter();
  const { profile } = useProfile();
  const [signingOut, setSigningOut] = useState(false);

  // No profile means onboarding was never finished, and a load error is the
  // profile page's problem to report, not the sidebar's. Either way the row
  // drops out and sign out stays reachable.
  const name = profile ? `${profile.first_name} ${profile.last_name}`.trim() : null;

  async function signOut() {
    setSigningOut(true);
    await signOutNative();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-1">
      {name ? (
        <Link
          href="/profile"
          title={collapsed ? name : undefined}
          className={`sidebar-row hover:bg-surface-raised ${
            collapsed ? "sidebar-row-collapsed" : "gap-2.5 px-2"
          }`}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-signal-teal-subtle font-display text-xs font-semibold text-signal-teal">
            {name.slice(0, 1).toUpperCase()}
          </span>
          {collapsed ? null : (
            <span className="truncate font-sans text-sm text-text-secondary">{name}</span>
          )}
        </Link>
      ) : null}

      <button
        type="button"
        onClick={signOut}
        disabled={signingOut}
        title={collapsed ? "Sign out" : undefined}
        className={`utility-label sidebar-row w-full text-text-secondary hover:bg-surface-raised hover:text-muted-rose disabled:opacity-50 ${
          collapsed ? "sidebar-row-collapsed" : ""
        }`}
      >
        <SignOutIcon />
        {collapsed ? null : <span>{signingOut ? "Signing out..." : "Sign out"}</span>}
      </button>
    </div>
  );
}
