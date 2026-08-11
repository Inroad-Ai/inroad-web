"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { resolvePostAuthPath } from "@/lib/auth";
import { isValidEmail } from "@/lib/onboarding";
import { createClient } from "@/lib/supabase/browser";

type Mode = "login" | "signup";

const COPY: Record<Mode, { heading: string; submitLabel: string; switchPrompt: string; switchHref: string; switchLabel: string }> = {
  login: {
    heading: "Sign in",
    submitLabel: "Sign in",
    switchPrompt: "New here?",
    switchHref: "/signup",
    switchLabel: "Create an account",
  },
  signup: {
    heading: "Create your account",
    submitLabel: "Create account",
    switchPrompt: "Already have an account?",
    switchHref: "/login",
    switchLabel: "Sign in",
  },
};

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const supabase = createClient();
  const copy = COPY[mode];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);

  const valid = isValidEmail(email) && password.length >= 8;

  async function handleGoogle() {
    setError(null);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (oauthError) setError(oauthError.message);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setTouched(true);
    if (!valid) return;

    setSubmitting(true);
    setError(null);

    if (mode === "login") {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) {
        setError(signInError.message);
        setSubmitting(false);
        return;
      }
      const path = await resolvePostAuthPath(supabase, data.user.id);
      router.push(path);
      router.refresh();
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/confirm` },
    });
    if (signUpError) {
      // Don't echo "user already registered" back to the caller - that
      // confirms an email is a real account to whoever's asking. Show the
      // same "check your email" state a real signup gets; a real signup
      // gets a confirmation link, a repeat one silently gets nothing.
      if (/already registered/i.test(signUpError.message)) {
        setCheckEmail(true);
        setSubmitting(false);
        return;
      }
      setError(signUpError.message);
      setSubmitting(false);
      return;
    }
    // No session back yet means Supabase is holding the account for email
    // confirmation. If confirmations are disabled on the project, a session
    // comes back immediately and we can route straight in.
    if (!data.session || !data.user) {
      setCheckEmail(true);
      setSubmitting(false);
      return;
    }
    const path = await resolvePostAuthPath(supabase, data.user.id);
    router.push(path);
    router.refresh();
  }

  if (checkEmail) {
    return (
      <div>
        <h1 className="font-display text-2xl text-text-primary">Check your email</h1>
        <p className="mt-3 text-sm text-text-secondary">
          We sent a confirmation link to {email.trim()}. Follow it to finish creating your account.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-text-primary">{copy.heading}</h1>

      <Button
        type="button"
        variant="quiet"
        onClick={handleGoogle}
        className="mt-6 w-full"
      >
        Continue with Google
      </Button>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-line" />
        <span className="utility-label text-text-secondary">or</span>
        <div className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="utility-label text-text-secondary">
              Email
            </label>
            <Input
              id="email"
              type="email"
              autoFocus
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="mt-2"
            />
          </div>
          <div>
            <label htmlFor="password" className="utility-label text-text-secondary">
              Password
            </label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2"
            />
          </div>
        </div>

        {touched && !valid ? (
          <p className="mt-3 text-sm text-error">
            {isValidEmail(email)
              ? "Password needs to be at least 8 characters."
              : "That doesn't look like a real email."}
          </p>
        ) : null}
        {error ? <p className="mt-3 text-sm text-error">{error}</p> : null}

        <Button type="submit" disabled={submitting} className="mt-8 w-full">
          {submitting ? "Working..." : copy.submitLabel}
        </Button>
      </form>

      {mode === "login" ? (
        <p className="mt-3 text-sm text-text-secondary">
          <Link href="/forgot-password" className="text-signal-teal hover:underline">
            Forgot your password?
          </Link>
        </p>
      ) : null}

      <p className="mt-6 text-sm text-text-secondary">
        {copy.switchPrompt}{" "}
        <Link href={copy.switchHref} className="text-signal-teal hover:underline">
          {copy.switchLabel}
        </Link>
      </p>
    </div>
  );
}
