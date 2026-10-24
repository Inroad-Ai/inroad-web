"use client";

import { useState } from "react";

const MONOGRAM_FILLS = [
  "bg-monogram-1",
  "bg-monogram-2",
  "bg-monogram-3",
  "bg-monogram-4",
  "bg-monogram-5",
  "bg-monogram-6",
] as const;

/** Same domain, same colour, on every page and every visit. */
function monogramFill(domain: string): string {
  let hash = 0;
  for (const char of domain) hash = (hash + char.charCodeAt(0)) % MONOGRAM_FILLS.length;
  return MONOGRAM_FILLS[hash];
}

/** Arbitrary company domains, so a static remotePatterns allowlist for
 * next/image isn't workable - a plain <img> with a monogram fallback on error
 * is the honest option here. Size it with `className` (h-10 w-10 and so on). */
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
  const base = `relative flex shrink-0 items-center justify-center overflow-hidden rounded-nest shadow-nest ${className}`;

  if (!logoUrl || failed) {
    return (
      <div
        className={`${base} ${monogramFill(domain)} before:absolute before:inset-0 before:bg-gradient-to-br before:from-chalk/20 before:to-transparent`}
        aria-hidden
      >
        <span className="relative font-display text-lg font-sans-semibold tracking-heading text-chalk">
          {domain.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div className={`${base} bg-chalk`}>
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
