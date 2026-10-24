"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";

import { Card } from "@/components/ui/Card";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { AlertCircleIcon, CheckCircleIcon, SpinnerIcon } from "@/components/ui/Icons";
import { useElapsedSeconds } from "@/hooks/useElapsedSeconds";
import { plural } from "@/lib/format";
import { LANDING_EASE } from "@/lib/landing-motion";
import { USUAL_SCAN_RANGE } from "@/lib/match-scan";

import type { FirstMatchScan } from "./useFirstMatchScan";

function headline(scan: FirstMatchScan, elapsed: number): string {
  if (scan.status === "searching") return `Searching · ${elapsed}s`;
  if (scan.status === "matched") return `${scan.total} found`;
  if (scan.status === "empty") return "Nothing new";
  if (scan.status === "timedOut") return "Still running";
  return "Couldn't run";
}

function StatusRow({ icon, title, line }: { icon: ReactNode; title: string; line: string }) {
  return (
    <div className="flex items-start gap-3.5 rounded-nest bg-surface-raised px-4 py-4">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-sm font-sans-bold text-ink">{title}</p>
        <p className="mt-1 text-sm text-ink-muted">{line}</p>
      </div>
    </div>
  );
}

/** What the real scan is doing right now, and the matches it found as they're revealed. */
export function LaunchStatusCard({ scan, revealed }: { scan: FirstMatchScan; revealed: number }) {
  const elapsed = useElapsedSeconds(scan.status === "searching" ? scan.startedAt : null);
  const spinner = (
    <span className="text-signal-teal">
      <SpinnerIcon />
    </span>
  );
  const alert = (
    <span className="text-error">
      <AlertCircleIcon />
    </span>
  );

  return (
    <Card padding="none" className="w-full p-2 text-left shadow-pop">
      <div className="utility-label flex justify-between gap-3 px-3.5 pb-2.5 pt-3 text-ink-faint">
        <span>Your first matches</span>
        <span role="status" aria-live="polite" className="text-ink-muted">
          {headline(scan, elapsed)}
        </span>
      </div>

      {scan.status === "searching" ? (
        <StatusRow
          icon={spinner}
          title="Searching for companies that fit your profile"
          line={`Using your profile and current hiring signals. Usually ${USUAL_SCAN_RANGE}.`}
        />
      ) : null}
      {scan.status === "empty" ? (
        <StatusRow
          icon={
            <span className="text-ink-faint">
              <CheckCircleIcon />
            </span>
          }
          title="No new matches today"
          line="Nothing new fit your profile this time. You can run another scan or research any company by its website from Research."
        />
      ) : null}
      {scan.status === "timedOut" ? (
        <StatusRow
          icon={spinner}
          title="Taking longer than expected"
          line="The scan may still be running. Anything it finds will show up in Companies."
        />
      ) : null}
      {scan.status === "failed" ? (
        <StatusRow
          icon={alert}
          title="The match scan couldn't run"
          line={`${scan.message} You can try again from Research.`}
        />
      ) : null}

      {scan.status === "matched" ? (
        <ul className="grid gap-0.5">
          <AnimatePresence initial={false}>
            {scan.companies.slice(0, revealed).map((company) => (
              <motion.li
                key={company.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: LANDING_EASE }}
              >
                <Link
                  href={`/companies/${company.id}`}
                  className="flex items-center gap-3.5 rounded-nest px-3.5 py-3 transition-colors duration-fast hover:bg-ink/5"
                >
                  <CompanyLogo logoUrl={company.logoUrl} seed={company.domain} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-sans-bold text-ink">{company.domain}</p>
                    <p className="truncate text-sm text-ink-muted">
                      {company.roleTitle ?? "Matched to your profile"}
                    </p>
                  </div>
                  <span className="shrink-0 text-signal-teal">
                    <CheckCircleIcon />
                  </span>
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
          {scan.total > scan.companies.length ? (
            <li className="px-3.5 pb-2 pt-1 text-sm text-ink-muted">
              {scan.companies.length === 0
                ? `${plural(scan.total, "company", "companies")} matched. They're saved in Companies.`
                : `And ${scan.total - scan.companies.length} more, saved in Companies.`}
            </li>
          ) : null}
        </ul>
      ) : null}
    </Card>
  );
}
