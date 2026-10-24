import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { SpinnerIcon } from "./Icons";

type Variant = "primary" | "quiet" | "ghost";
type Size = "sm" | "md" | "lg";
type IconPosition = "start" | "end";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-signal-amber text-on-amber shadow-amber hover:bg-signal-amber-hover hover:shadow-amber-hover",
  quiet: "border border-ink/15 bg-ink/5 text-ink hover:bg-ink/10",
  ghost: "text-ink-muted hover:bg-ink/5 hover:text-ink",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 gap-1.5 px-4 text-sm",
  md: "h-11 gap-2 px-5 text-sm",
  lg: "h-12 gap-2 px-6 text-base",
};

const BASE_CLASSES =
  "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full font-sans font-sans-bold transition duration-fast ease-standard active:translate-y-px disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0";

interface SharedProps {
  variant?: Variant;
  size?: Size;
  /** Rendered beside the label; sized to match it. */
  icon?: ReactNode;
  iconPosition?: IconPosition;
}

interface ButtonProps extends SharedProps, ButtonHTMLAttributes<HTMLButtonElement> {
  href?: undefined;
  /** Disables the button and swaps the icon for a spinner while an action runs. */
  loading?: boolean;
}

interface ButtonLinkProps extends SharedProps, AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  loading?: undefined;
}

/** Same visual component whether it acts as a button or navigates — pass `href` to render a Link. */
export function Button({
  variant = "primary",
  size = "md",
  className = "",
  icon,
  iconPosition = "start",
  loading = false,
  href,
  children,
  ...props
}: ButtonProps | ButtonLinkProps) {
  const classes = `${BASE_CLASSES} ${SIZES[size]} ${VARIANTS[variant]} ${className}`;
  const lead = loading ? <SpinnerIcon /> : icon;
  const content = (
    <>
      {iconPosition === "start" ? lead : null}
      {children}
      {iconPosition === "end" ? lead : null}
    </>
  );

  if (href !== undefined) {
    return (
      <Link href={href} className={classes} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </Link>
    );
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      {...buttonProps}
      className={classes}
      disabled={buttonProps.disabled || loading}
      aria-busy={loading || undefined}
    >
      {content}
    </button>
  );
}
