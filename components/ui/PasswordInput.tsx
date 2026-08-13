"use client";

import { useId, useState, type InputHTMLAttributes } from "react";

import { Input } from "./Input";

/** Crossed-out when the password is showing: the icon states what a click
 * will do, not what the field is currently doing. */
function EyeIcon({ crossedOut }: { crossedOut: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-4 w-4 fill-none stroke-current"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.75" />
      {crossedOut ? <path d="m4 20 16-16" /> : null}
    </svg>
  );
}

/**
 * Password field with a show/hide toggle. Every password input in the app
 * goes through this, so the toggle behaves identically everywhere and the
 * markup exists once.
 *
 * `type` is owned by this component and deliberately not overridable.
 *
 * `className` lands on the wrapper, not the input: the toggle is positioned
 * against the wrapper, so spacing applied to the input alone would move the
 * field out from under its own button.
 */
export function PasswordInput({
  className = "",
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  const [visible, setVisible] = useState(false);
  // Announced instead of the button itself, so a screen reader hears the
  // state change rather than the label silently swapping under it.
  const statusId = useId();

  return (
    <div className={`relative ${className}`}>
      <Input
        type={visible ? "text" : "password"}
        // Room for the toggle, so a long password never runs under it.
        className="pr-12"
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((shown) => !shown)}
        // Skipped in tab order: it's a convenience control, and stopping
        // between the password field and the submit button on every form
        // costs more than it gives. Still reachable by click and by screen
        // readers.
        tabIndex={-1}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-describedby={statusId}
        className="absolute inset-y-0 right-0 flex items-center px-4 text-text-secondary transition-colors hover:text-ink focus-visible:text-ink focus-visible:outline-none"
      >
        <EyeIcon crossedOut={visible} />
      </button>
      <span id={statusId} className="sr-only" role="status">
        {visible ? "Password is showing" : "Password is hidden"}
      </span>
    </div>
  );
}
