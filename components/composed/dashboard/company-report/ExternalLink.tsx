import type { ReactNode } from "react";

import { TextLink } from "@/components/ui/TextLink";
import { safeHref } from "@/lib/safe-href";

/** A link out to a scraped or provider URL. Anything that isn't plain
 * http(s) renders as text, never as a clickable href. */
export function ExternalLink({
  href,
  children,
  className = "",
}: {
  href: string | null | undefined;
  children: ReactNode;
  className?: string;
}) {
  const safe = safeHref(href);
  if (!safe) return <span className={`break-words ${className}`}>{children}</span>;
  return (
    <TextLink href={safe} external className={`break-words ${className}`}>
      {children}
    </TextLink>
  );
}
