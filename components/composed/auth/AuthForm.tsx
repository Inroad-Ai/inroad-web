"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Notice } from "@/components/ui/Notice";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { ApiError, login, resendVerification, signup } from "@/lib/api-client/client";
import { resolvePostAuthPath } from "@/lib/auth";
import { storeTokens } from "@/lib/auth-native/browser";
import { isValidEmail } from "@/lib/onboarding";

import { AuthFooterNote, AuthLink } from "./AuthFooterNote";
import { AuthHeading } from "./AuthHeading";
import { CheckYourEmail } from "./CheckYourEmail";
import { GoogleSignIn } from "./GoogleSignIn";

type Mode = "login" | "signup";

const MIN_PASSWORD_LENGTH = 8;

const COPY: Record<
  Mode,
  {
    eyebrow: string;
    heading: string;
    subheading: string;
    submitLabel: string;
    switchPrompt: string;
    switchHref: string;
    switchLabel: string;
  }
> = {
  login: {
    eyebrow: "Welcome back",
    heading: "Sign in",
    subheading: "Pick up where your research left off.",
    submitLabel: "Sign in",
    switchPrompt: "New here?",
    switchHref: "/signup",
    switchLabel: "Create an account",
  },
  signup: {
    eyebrow: "New account",
    heading: "Create your account",
    subheading: "Takes a minute. No card, no sales call.",
    submitLabel: "Create account",
    switchPrompt: "Already have an account?",
    switchHref: "/login",
    switchLabel: "Sign in",
  },
};

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const copy = COPY[mode];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unverified, setUnverified] = useState(false);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  const passwordsMatch = mode === "login" || password === confirmPassword;
  const valid = isValidEmail(email) && password.length >= MIN_PASSWORD_LENGTH && passwordsMatch;

  function validationMessage(): string {
    if (!isValidEmail(email)) return "That doesn't look like a real email.";
    if (password.length < MIN_PASSWORD_LENGTH) {
      return `Password needs to be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    return "Those passwords don't match.";
  }

  async function handleResendFromLogin() {
    await resendVerification(email.trim());
    setUnverified(false);
    setError("Sent. Check your inbox for a new link.");
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setTouched(true);
    if (!valid) return;

    setSubmitting(true);
    setError(null);
    setUnverified(false);

    try {
      if (mode === "signup") {
        await signup(email.trim(), password);
        setAwaitingConfirmation(true);
        return;
      }

      const tokens = await login(email.trim(), password);
      storeTokens(tokens);
      router.push(await resolvePostAuthPath(tokens.access_token));
      router.refresh();
    } catch (submitError) {
      if (submitError instanceof ApiError && submitError.code === "email_not_verified") {
        setUnverified(true);
      }
      setError(
        submitError instanceof ApiError ? submitError.message : "Something went wrong. Try again.",
      );
      setSubmitting(false);
    }
  }

  if (awaitingConfirmation) {
    return <CheckYourEmail email={email.trim()} />;
  }

  return (
    <div className="grid gap-7">
      <AuthHeading eyebrow={copy.eyebrow} title={copy.heading}>
        {copy.subheading}
      </AuthHeading>

      <GoogleSignIn />

      <form onSubmit={handleSubmit} className="grid gap-4">
        <Field label="Email" htmlFor="email">
          <Input
            id="email"
            type="email"
            autoFocus
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />
        </Field>
        <Field label="Password" htmlFor="password">
          <PasswordInput
            id="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Field>
        {mode === "login" ? (
          <Link
            href="/forgot-password"
            className="-mt-1 justify-self-end text-sm font-sans-semibold text-ink-muted underline decoration-ink/30 underline-offset-4 transition-colors duration-fast hover:text-ink"
          >
            Forgot password?
          </Link>
        ) : (
          <Field label="Confirm password" htmlFor="confirm-password">
            <PasswordInput
              id="confirm-password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </Field>
        )}

        {touched && !valid ? <Notice>{validationMessage()}</Notice> : null}
        {error ? <Notice>{error}</Notice> : null}
        {unverified ? (
          <button
            type="button"
            onClick={handleResendFromLogin}
            className="justify-self-start text-sm font-sans-semibold text-signal-teal underline-offset-4 hover:underline"
          >
            Send the confirmation link again
          </button>
        ) : null}

        <Button type="submit" size="lg" loading={submitting} className="mt-2 w-full">
          {submitting ? "Working..." : copy.submitLabel}
        </Button>
      </form>

      {mode === "signup" ? (
        <AuthFooterNote>
          By creating an account you agree to the <AuthLink href="/terms">Terms</AuthLink> and the{" "}
          <AuthLink href="/privacy">Privacy Policy</AuthLink>.
        </AuthFooterNote>
      ) : null}

      <AuthFooterNote>
        {copy.switchPrompt} <AuthLink href={copy.switchHref}>{copy.switchLabel}</AuthLink>
      </AuthFooterNote>
    </div>
  );
}
