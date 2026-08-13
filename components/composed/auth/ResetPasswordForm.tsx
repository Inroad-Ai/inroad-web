"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ApiError, resetPassword } from "@/lib/api-client/client";
import { resolvePostAuthPath } from "@/lib/auth";
import { storeTokens } from "@/lib/auth-native/browser";

const MIN_PASSWORD_LENGTH = 8;

export function ResetPasswordForm() {
  const router = useRouter();
  // The token comes straight from the emailed link. It isn't a session and
  // isn't stored: it goes to the backend once, with the new password.
  const token = useSearchParams().get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordsMatch = password === confirmPassword;
  const valid = password.length >= MIN_PASSWORD_LENGTH && passwordsMatch;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setTouched(true);
    if (!valid || !token) return;

    setSubmitting(true);
    setError(null);

    // The reset hands back a fresh session: reaching the emailed link
    // already proved the account is theirs, so there is nothing left to
    // sign in with.
    try {
      const tokens = await resetPassword(token, password);
      storeTokens(tokens);
      router.push(await resolvePostAuthPath(tokens.access_token));
      router.refresh();
    } catch (resetError) {
      setError(
        resetError instanceof ApiError
          ? resetError.message
          : "Could not update your password. Try again.",
      );
      setSubmitting(false);
    }
  }

  if (!token) {
    return (
      <div className="text-center">
        <h1 className="font-display text-2xl font-semibold text-text-primary">Link expired</h1>
        <p className="mt-3 font-sans text-sm text-text-secondary">
          This reset link is no longer valid. Request a new one from the{" "}
          <Link href="/forgot-password" className="text-signal-teal hover:underline">
            forgot password
          </Link>{" "}
          page.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center">
        <h1 className="font-display text-2xl font-semibold text-text-primary">
          Set a new password
        </h1>
        <p className="mt-2 font-sans text-sm text-text-secondary">
          Pick something at least {MIN_PASSWORD_LENGTH} characters long.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8">
        <div className="space-y-4">
          <div>
            <label htmlFor="password" className="utility-label text-text-secondary">
              New password
            </label>
            <Input
              id="password"
              type="password"
              autoFocus
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="utility-label text-text-secondary">
              Confirm new password
            </label>
            <Input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="mt-2"
            />
          </div>
        </div>

        {touched && !valid ? (
          <p className="mt-3 text-sm text-error">
            {password.length < MIN_PASSWORD_LENGTH
              ? `Password needs to be at least ${MIN_PASSWORD_LENGTH} characters.`
              : "Those passwords don't match."}
          </p>
        ) : null}
        {error ? <p className="mt-3 text-sm text-error">{error}</p> : null}

        <Button type="submit" disabled={submitting} className="mt-8 w-full">
          {submitting ? "Saving..." : "Save password"}
        </Button>
      </form>
    </div>
  );
}
