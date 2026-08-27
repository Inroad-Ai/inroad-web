"use client";

import { useState } from "react";

/** Arbitrary company domains, so a static remotePatterns allowlist for
 * next/image isn't workable - a plain <img> with a text fallback on error
 * is the honest option here. */
export function CompanyLogo({
  logoUrl,
  domain,
  className = "",
}: {
  logoUrl: string | null;
  domain: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const base = `flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-line bg-surface-raised ${className}`;

  if (!logoUrl || failed) {
    return (
      <div className={base} aria-hidden>
        <span className="font-display text-lg text-text-secondary">
          {domain.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div className={base}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoUrl}
        alt=""
        className="h-full w-full object-contain p-1.5"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
