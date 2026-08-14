"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { fetchMe } from "@/lib/api-client/client";
import { ensureValidAccessToken, signOutNative } from "@/lib/auth-native/browser";

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
  const [signingOut, setSigningOut] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  // middleware.ts and (dashboard)/layout.tsx admit a request only with a
  // valid access token, so anything rendering this is signed in.
  useEffect(() => {
    let cancelled = false;

    ensureValidAccessToken()
      .then((token) => (token ? fetchMe(token) : null))
      .then((user) => {
        if (!cancelled) setEmail(user?.email ?? null);
      })
      .catch(() => {
        // Just drops the address; the route guards own session state.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function signOut() {
    setSigningOut(true);
    await signOutNative();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-1">
      {email ? (
        <div
          title={collapsed ? email : undefined}
          className={`flex items-center rounded-full px-3 py-2 ${
            collapsed ? "justify-center" : "gap-2.5"
          }`}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-signal-teal-subtle font-display text-xs font-semibold text-signal-teal">
            {email.slice(0, 1).toUpperCase()}
          </span>
          {collapsed ? null : (
            <span className="truncate font-sans text-sm text-text-secondary">{email}</span>
          )}
        </div>
      ) : null}

      <button
        type="button"
        onClick={signOut}
        disabled={signingOut}
        title={collapsed ? "Sign out" : undefined}
        className="utility-label flex w-full items-center justify-center gap-2 rounded-full px-3 py-2 text-text-secondary transition-colors hover:bg-surface-raised hover:text-muted-rose disabled:opacity-50"
      >
        <SignOutIcon />
        {collapsed ? null : <span>{signingOut ? "Signing out..." : "Sign out"}</span>}
      </button>
    </div>
  );
}
