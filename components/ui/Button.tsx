import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "quiet";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-signal-amber text-ink hover:bg-signal-amber-hover disabled:bg-signal-amber/40",
  quiet:
    "border border-line bg-surface text-text-primary hover:border-signal-teal hover:text-signal-teal disabled:text-text-secondary/40",
};

const BASE_CLASSES =
  "inline-flex items-center justify-center rounded-sm px-5 py-3 font-sans text-sm font-medium transition-colors disabled:cursor-not-allowed";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  href?: undefined;
}

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  href: string;
}

/** Same visual component whether it acts as a button or navigates — pass `href` to render a Link. */
export function Button({
  variant = "primary",
  className = "",
  href,
  ...props
}: ButtonProps | ButtonLinkProps) {
  const classes = `${BASE_CLASSES} ${VARIANTS[variant]} ${className}`;

  if (href !== undefined) {
    return (
      <Link
        href={href}
        className={classes}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      />
    );
  }

  return (
    <button
      className={classes}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    />
  );
}
