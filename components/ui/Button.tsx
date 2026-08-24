import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "quiet";
type Size = "sm" | "md";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-signal-amber text-ink hover:bg-signal-amber-hover hover:shadow-card disabled:bg-signal-amber/40",
  quiet:
    "border border-line bg-surface text-text-primary hover:border-signal-teal hover:text-signal-teal disabled:text-text-secondary/40",
};

const SIZES: Record<Size, string> = {
  md: "px-6 py-3.5 text-sm",
  sm: "px-5 py-2.5 text-sm",
};

const BASE_CLASSES =
  "inline-flex items-center justify-center rounded-full font-display font-semibold transition duration-150 disabled:cursor-not-allowed";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  href?: undefined;
}

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  size?: Size;
  href: string;
}

/** Same visual component whether it acts as a button or navigates — pass `href` to render a Link. */
export function Button({
  variant = "primary",
  size = "md",
  className = "",
  href,
  ...props
}: ButtonProps | ButtonLinkProps) {
  const classes = `${BASE_CLASSES} ${SIZES[size]} ${VARIANTS[variant]} ${className}`;

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
