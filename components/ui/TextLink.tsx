import Link from "next/link";
import type { ReactNode } from "react";

export const TEXT_LINK_CLASSES =
  "text-signal-teal underline decoration-signal-teal/30 underline-offset-4 transition-colors duration-fast hover:decoration-signal-teal";

/** An inline teal link inside running text. `external` opens a new tab and
 * renders a plain anchor; anything else goes through next/link. */
export function TextLink({
  href,
  external = false,
  className = "",
  children,
}: {
  href: string;
  external?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const classes = `${TEXT_LINK_CLASSES} ${className}`;
  if (external || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
