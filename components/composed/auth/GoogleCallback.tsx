"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { resolvePostAuthPath } from "@/lib/auth";
import { storeTokens } from "@/lib/auth-native/browser";

/** Where the backend sends the browser after Google sign-in. The session
 * arrives in the URL fragment rather than the query string, because a
 * fragment is never sent to a server: it stays out of access logs and
 * Referer headers. That also means only client-side code can read it, which
 * is why this is a page and not a route handler. */
export function GoogleCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  // Reading the fragment consumes it: the tokens are cleared from the URL
  // below. Under React's development double-invoke that would leave the
  // second run looking at an empty fragment and reporting a failed sign-in
  // over the top of a successful one, so the whole effect runs once.
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const params = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (!accessToken || !refreshToken) {
      setError(
        params.get("error") === "cancelled"
          ? "Google sign-in was cancelled."
          : "Google sign-in didn't complete. Try again.",
      );
      return;
    }

    storeTokens({ access_token: accessToken, refresh_token: refreshToken, token_type: "bearer" });
    // Drop the tokens out of the address bar before anything else renders,
    // so they aren't sitting in history or on screen.
    window.history.replaceState(null, "", window.location.pathname);

    resolvePostAuthPath(accessToken)
      .then((path) => {
        router.replace(path);
        router.refresh();
      })
      .catch(() => setError("Signed in, but couldn't load your account. Try again."));
  }, [router]);

  if (error) {
    return (
      <div className="text-center">
        <h1 className="font-display text-2xl font-semibold text-text-primary">
          Couldn&apos;t sign you in
        </h1>
        <p className="mt-3 font-sans text-sm text-text-secondary">{error}</p>
        <p className="mt-6 font-sans text-sm text-text-secondary">
          <Link href="/login" className="text-signal-teal hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <p className="text-center font-sans text-sm text-text-secondary">Signing you in...</p>
  );
}
