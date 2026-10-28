import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Icon-only, so the accessible name has to be given explicitly. */
  label: string;
  /** Renders a Link instead of a button, same look. */
  href?: string;
  children: ReactNode;
}

const CLASSES =
  "relative inline-grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ink/15 bg-ink/5 text-ink transition-colors duration-fast hover:bg-ink/10 disabled:pointer-events-none disabled:opacity-50";

export function IconButton({ label, href, className = "", children, ...props }: IconButtonProps) {
  if (href !== undefined) {
    return (
      <Link href={href} aria-label={label} className={`${CLASSES} ${className}`}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" aria-label={label} className={`${CLASSES} ${className}`} {...props}>
      {children}
    </button>
  );
}
