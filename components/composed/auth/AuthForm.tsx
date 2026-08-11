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

const COPY: Record<
  Mode,
  {
    heading: string;
    subheading: string;
    submitLabel: string;
    switchPrompt: string;
    switchHref: string;
    switchLabel: string;
  }
> = {
  login: {
    heading: "Welcome back",
    subheading: "Pick up where your research left off.",
    submitLabel: "Sign in",
    switchPrompt: "New here?",
    switchHref: "/signup",
    switchLabel: "Create an account",
  },
  signup: {
    heading: "Create your account",
    subheading: "Takes a minute. No card, no sales call.",
    submitLabel: "Create account",
    switchPrompt: "Already have an account?",
    switchHref: "/login",
    switchLabel: "Sign in",
  },
};

/** Monochrome G. The four-colour mark would be the only art in the app not built from tokens. */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="mr-2 h-4 w-4 fill-current">
      <path d="M12 10.2v3.9h5.45a4.67 4.67 0 0 1-2.03 3.06l3.28 2.54c1.91-1.77 3.01-4.37 3.01-7.46 0-.72-.06-1.41-.19-2.08zM12 22c2.7 0 4.96-.9 6.62-2.43l-3.23-2.5c-.9.6-2.05.96-3.39.96-2.6 0-4.8-1.76-5.59-4.12l-3.34 2.58C4.72 19.78 8.09 22 12 22M6.41 13.91a6 6 0 0 1 0-3.82L3.07 7.51a10 10 0 0 0 0 8.98zM12 5.98c1.47 0 2.79.5 3.83 1.5l2.87-2.87C16.95 2.99 14.7 2 12 2 8.09 2 4.72 4.22 3.07 7.51l3.34 2.58C7.2 7.73 9.4 5.98 12 5.98" />
    </svg>
  );
}

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
      <div className="text-center">
        <h1 className="font-display text-2xl font-semibold text-text-primary">Check your email</h1>
        <p className="mt-3 font-sans text-sm text-text-secondary">
          We sent a confirmation link to{" "}
          <span className="text-text-primary">{email.trim()}</span>. Follow it to finish creating
          your account.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center">
        <h1 className="font-display text-2xl font-semibold text-text-primary">{copy.heading}</h1>
        <p className="mt-2 font-sans text-sm text-text-secondary">{copy.subheading}</p>
      </div>

      <Button type="button" variant="quiet" onClick={handleGoogle} className="mt-8 w-full">
        <GoogleIcon />
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
            <div className="flex items-baseline justify-between">
              <label htmlFor="password" className="utility-label text-text-secondary">
                Password
              </label>
              {mode === "login" ? (
                <Link
                  href="/forgot-password"
                  className="font-sans text-sm text-signal-teal hover:underline"
                >
                  Forgot?
                </Link>
              ) : null}
            </div>
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

      <p className="mt-8 border-t border-line pt-6 text-center font-sans text-sm text-text-secondary">
        {copy.switchPrompt}{" "}
        <Link href={copy.switchHref} className="text-signal-teal hover:underline">
          {copy.switchLabel}
        </Link>
      </p>
    </div>
  );
}
