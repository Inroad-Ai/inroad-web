import type { ReactNode } from "react";

/**
 * Shared by (marketing) and (onboarding): neither needs chrome of its own yet
 * - the landing page renders its own Nav/Footer, and onboarding has no shell
 * requirements yet. Split this into two real layouts if either group grows
 * chrome the other shouldn't have.
 */
export function PublicLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
