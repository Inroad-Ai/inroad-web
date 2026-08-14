"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useProfile } from "@/hooks/useProfile";
import { signOutNative } from "@/lib/auth-native/browser";

function SignOutIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path d="M6.25 2.75H3.5a.75.75 0 0 0-.75.75v9a.75.75 0 0 0 .75.75h2.75" strokeLinecap="round" />
      <path d="M9.5 5.25 12.25 8 9.5 10.75M12.25 8H6.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SidebarAccount({ collapsed }: { collapsed: boolean }) {
  const router = useRouter();
  const { profile } = useProfile();
  const [signingOut, setSigningOut] = useState(false);

  // No profile means onboarding was never finished, and a load error is the
  // profile page's problem to report, not the sidebar's. Either way the row
  // just drops out and sign out stays reachable.
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
          className={`flex items-center rounded-full px-2 py-2 transition-colors hover:bg-surface-raised ${
            collapsed ? "justify-center" : "gap-2.5"
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
        className={`utility-label flex w-full items-center rounded-full py-2 text-text-secondary transition-colors hover:bg-surface-raised hover:text-muted-rose disabled:opacity-50 ${
          collapsed ? "justify-center" : "gap-3 px-3"
        }`}
      >
        <SignOutIcon />
        {collapsed ? null : <span>{signingOut ? "Signing out..." : "Sign out"}</span>}
      </button>
    </div>
  );
}
