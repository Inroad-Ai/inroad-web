import type { InputHTMLAttributes } from "react";

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-sm border border-line bg-surface px-4 py-3.5 font-sans text-base text-ink placeholder:text-ink-muted/50 focus:border-signal-teal focus:outline-none ${className}`}
      {...props}
    />
  );
}
