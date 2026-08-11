import type { SelectHTMLAttributes } from "react";

export function Select({
  className = "",
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`rounded-sm border border-line bg-surface px-4 py-3.5 font-sans text-base text-ink focus:border-signal-teal focus:outline-none ${className}`}
      {...props}
    />
  );
}
