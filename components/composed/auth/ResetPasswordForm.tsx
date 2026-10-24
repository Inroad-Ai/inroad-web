"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { ApiError, resetPassword } from "@/lib/api-client/client";
import { resolvePostAuthPath } from "@/lib/auth";
import { storeTokens } from "@/lib/auth-native/browser";

import { AuthFooterNote, AuthLink } from "./AuthFooterNote";
import { AuthHeading } from "./AuthHeading";

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
      <div className="grid gap-7">
        <AuthHeading eyebrow="Account help" title="Link expired">
          This reset link is no longer valid. Request a new one from the{" "}
          <AuthLink href="/forgot-password">forgot password</AuthLink> page.
        </AuthHeading>
        <AuthFooterNote>
          <AuthLink href="/login">Back to sign in</AuthLink>
        </AuthFooterNote>
      </div>
    );
  }

  return (
    <div className="grid gap-7">
      <AuthHeading eyebrow="Account help" title="Set a new password">
        Pick something at least {MIN_PASSWORD_LENGTH} characters long.
      </AuthHeading>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <Field label="New password" htmlFor="password">
          <PasswordInput
            id="password"
            autoFocus
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Field>
        <Field label="Confirm new password" htmlFor="confirm-password">
          <PasswordInput
            id="confirm-password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </Field>

        {touched && !valid ? (
          <Notice>
            {password.length < MIN_PASSWORD_LENGTH
              ? `Password needs to be at least ${MIN_PASSWORD_LENGTH} characters.`
              : "Those passwords don't match."}
          </Notice>
        ) : null}
        {error ? <Notice>{error}</Notice> : null}

        <Button type="submit" size="lg" loading={submitting} className="mt-2 w-full">
          {submitting ? "Saving..." : "Save password"}
        </Button>
      </form>

      <AuthFooterNote>
        <AuthLink href="/login">Back to sign in</AuthLink>
      </AuthFooterNote>
    </div>
  );
}
