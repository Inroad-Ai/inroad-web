import type { ReactNode } from "react";

import { monogramFill } from "./monogram";

/** A band in a company's own monogram colour, shading to a fixed dark at the
 * far corner. Anything on it is chalk, which clears AA on every fill. */
export function TintBand({
  seed,
  className = "",
  children,
}: {
  seed: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`relative isolate ${monogramFill(seed)} ${className}`}>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-br from-chalk/15 via-transparent to-hero-shade/60"
      />
      {children}
    </div>
  );
}
