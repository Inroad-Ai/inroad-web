import type { ButtonHTMLAttributes, ReactNode } from "react";

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Icon-only, so the accessible name has to be given explicitly. */
  label: string;
  children: ReactNode;
}

export function IconButton({ label, className = "", children, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`flex items-center justify-center rounded-full p-1.5 text-text-secondary transition-colors hover:bg-surface-raised hover:text-signal-teal disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
