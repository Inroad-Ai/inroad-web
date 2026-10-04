"use client";

import { useState } from "react";

import { useConnections } from "@/hooks/useConnections";
import { useProfile } from "@/hooks/useProfile";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatusDot } from "@/components/ui/StatusDot";
import type { OverviewStats } from "@/lib/types";

interface ChecklistItem {
  label: string;
  href: string;
  action: string;
  done: boolean;
}

export function SetupChecklist({
  stats,
  statsLoading,
  statsError,
  onStatsRetry,
}: {
  stats: OverviewStats | null;
  statsLoading: boolean;
  statsError: string | null;
  onStatsRetry: () => void;
}) {
  const [attempt, setAttempt] = useState(0);
  return (
    <ChecklistContent
      key={attempt}
      stats={stats}
      statsLoading={statsLoading}
      statsError={statsError}
      onStatsRetry={onStatsRetry}
      onRetry={() => setAttempt((value) => value + 1)}
    />
  );
}

function ChecklistContent({
  stats,
  statsLoading,
  statsError,
  onStatsRetry,
  onRetry,
}: {
  stats: OverviewStats | null;
  statsLoading: boolean;
  statsError: string | null;
  onStatsRetry: () => void;
  onRetry: () => void;
}) {
  const { profile, loading: profileLoading, error: profileError } = useProfile();
  const { connections, loading: connectionsLoading, error: connectionsError } = useConnections();

  if (profileLoading || connectionsLoading || (!stats && statsLoading)) {
    return (
      <section
        className="rounded-md border border-line bg-surface p-5 shadow-card sm:p-6"
        role="status"
        aria-label="Loading setup checklist"
      >
        <Skeleton className="h-5 w-44" />
        <Skeleton className="mt-5 h-12 w-full" />
        <Skeleton className="mt-3 h-12 w-full" />
      </section>
    );
  }

  if (profileError || connectionsError || !stats) {
    return (
      <section className="rounded-md border border-line bg-surface p-5 shadow-card sm:p-6">
        <h2 className="text-lg font-semibold text-ink">Get started</h2>
        <div
          role="alert"
          className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-rose"
        >
          <span>Could not load your setup progress.</span>
          <Button variant="quiet" size="sm" onClick={statsError && !stats ? onStatsRetry : onRetry}>
            Try again
          </Button>
        </div>
      </section>
    );
  }

  const items: ChecklistItem[] = [
    {
      label: "Complete your profile",
      href: "/profile",
      action: "Edit profile",
      done: Boolean(profile?.first_name && profile?.last_name && profile?.target_roles?.length),
    },
    {
      label: "Import your resume",
      href: "/profile",
      action: "Add resume",
      done: Boolean(profile?.resume_parsed_json && Object.keys(profile.resume_parsed_json).length),
    },
    {
      label: "Connect Gmail",
      href: "/integrations",
      action: "Connect",
      done: connections.some(
        (connection) => connection.provider === "gmail" && connection.status === "connected",
      ),
    },
    {
      label: "Research your first company",
      href: "/research",
      action: "Research",
      done: stats.total_companies > 0,
    },
    {
      label: "Send your first outreach",
      href: "/contacts",
      action: "Find a contact",
      done: stats.sent_outreach_count > 0,
    },
  ];
  const remaining = items.filter((item) => !item.done);
  if (!remaining.length) return null;

  return (
    <section className="rounded-md border border-line bg-surface p-5 shadow-card sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="utility-label text-signal-teal">Your foundation</p>
          <h2 className="mt-1 text-lg font-semibold text-ink">Get started</h2>
        </div>
        <Badge tone="neutral">
          {items.length - remaining.length} of {items.length} complete
        </Badge>
      </div>
      <ul className="mt-4 divide-y divide-line">
        {remaining.map((item) => (
          <li
            key={item.label}
            className="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0"
          >
            <StatusDot state="idle" />
            <span className="min-w-0 flex-1 basis-36 text-sm text-ink">{item.label}</span>
            <Button href={item.href} variant="quiet" size="sm">
              {item.action}
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
