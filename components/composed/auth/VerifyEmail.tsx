"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ApiError, verifyEmail } from "@/lib/api-client/client";
import { resolvePostAuthPath } from "@/lib/auth";
import { storeTokens } from "@/lib/auth-native/browser";

/** Where the confirmation email points. Confirming also signs the user in,
 * so this lands them in the app rather than back at a login form. */
export function VerifyEmail() {
  const router = useRouter();
  const token = useSearchParams().get("token");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("This confirmation link is missing its token.");
      return;
    }

    let cancelled = false;

    verifyEmail(token)
      .then(async (tokens) => {
        if (cancelled) return;
        storeTokens(tokens);
        router.replace(await resolvePostAuthPath(tokens.access_token));
        router.refresh();
      })
      .catch((verifyError) => {
        if (cancelled) return;
        setError(
          verifyError instanceof ApiError
            ? verifyError.message
            : "Could not confirm your email. Try again.",
        );
      });

    return () => {
      cancelled = true;
    };
  }, [token, router]);

  if (error) {
    return (
      <div className="text-center">
        <h1 className="font-display text-2xl font-semibold text-text-primary">
          Link didn&apos;t work
        </h1>
        <p className="mt-3 font-sans text-sm text-text-secondary">{error}</p>
        <p className="mt-6 font-sans text-sm text-text-secondary">
          <Link href="/signup" className="text-signal-teal hover:underline">
            Start again
          </Link>{" "}
          or{" "}
          <Link href="/login" className="text-signal-teal hover:underline">
            sign in
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <p className="text-center font-sans text-sm text-text-secondary">
      Confirming your email...
    </p>
  );
}
