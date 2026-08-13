"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { fetchMe } from "@/lib/api-client/client";
import { ensureValidAccessToken, signOutNative } from "@/lib/auth-native/browser";

const TITLES: Record<string, string> = {
  "/overview": "Overview",
  "/research": "Research",
  "/companies/pipeline": "Pipeline",
  "/companies": "Companies",
  "/settings": "Settings",
};

function pageTitle(pathname: string | null): string {
  if (!pathname) return "";
  // Longest prefix first, so "/companies/pipeline" wins over "/companies".
  const match = Object.keys(TITLES)
    .sort((a, b) => b.length - a.length)
    .find((prefix) => pathname.startsWith(prefix));
  return match ? TITLES[match] : "";
}

export function DashboardHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  // middleware.ts and (dashboard)/layout.tsx admit a request only with a
  // valid access token, so anything rendering this header is signed in.
  useEffect(() => {
    let cancelled = false;

    ensureValidAccessToken()
      .then((token) => (token ? fetchMe(token) : null))
      .then((user) => {
        if (!cancelled) setEmail(user?.email ?? null);
      })
      .catch(() => {
        // Header just drops the address; the route guards own session state.
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
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-line bg-surface px-6">
      <span className="font-display text-lg text-ink">{pageTitle(pathname)}</span>

      <div className="flex items-center gap-4">
        {email ? (
          <span className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-signal-teal-subtle font-display text-xs font-semibold text-signal-teal">
              {email.slice(0, 1).toUpperCase()}
            </span>
            <span className="hidden font-sans text-sm text-text-secondary sm:inline">
              {email}
            </span>
          </span>
        ) : null}

        <button
          type="button"
          onClick={signOut}
          disabled={signingOut}
          className="utility-label text-text-secondary transition-colors hover:text-muted-rose disabled:opacity-50"
        >
          {signingOut ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </header>
  );
}
