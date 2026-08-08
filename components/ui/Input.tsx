import type { InputHTMLAttributes } from "react";

export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-sm border border-line bg-surface px-4 py-3 font-mono text-base text-paper placeholder:text-paper/35 focus:border-signal-teal focus:outline-none ${className}`}
      {...props}
    />
  );
}
