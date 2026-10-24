"use client";

import { useState } from "react";

import {
  MONOGRAM_FACE,
  MONOGRAM_SIZES,
  TILE_RADIUS,
  monogramFill,
  type MonogramSize,
} from "./monogram";

/** Arbitrary company domains, so a static remotePatterns allowlist for
 * next/image isn't workable - a plain <img> with a monogram fallback on error
 * is the honest option here. `seed` is the domain, or a sample company's name. */
export function CompanyLogo({
  logoUrl,
  seed,
  size = "md",
  className = "",
}: {
  logoUrl: string | null;
  seed: string;
  size?: MonogramSize;
  /** Rings and borders only; size comes from `size`. */
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const shape = `${MONOGRAM_SIZES[size]} ${TILE_RADIUS[size]} ${className}`;

  if (!logoUrl || failed) {
    return (
      <span aria-hidden className={`${MONOGRAM_FACE} ${monogramFill(seed)} ${shape}`}>
        <span className="relative">{seed.charAt(0).toUpperCase()}</span>
      </span>
    );
  }

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-chalk shadow-nest ${shape}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoUrl}
        alt=""
        className="h-full w-full object-contain p-1.5"
        onError={() => setFailed(true)}
      />
    </span>
  );
}
