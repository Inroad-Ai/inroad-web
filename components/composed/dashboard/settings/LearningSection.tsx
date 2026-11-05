"use client";

import { useEffect, useState } from "react";

import {
  fetchLearning,
  resetLearning,
  type LearnedItem,
  type Learning,
} from "@/lib/api-client/client";
import { requireAccessToken } from "@/lib/auth-native/browser";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { Button } from "@/components/ui/Button";
import { Notice } from "@/components/ui/Notice";
import { Skeleton } from "@/components/ui/Skeleton";

import { SettingRow } from "./SettingRow";

/** What the user's ratings taught, and the one way to undo all of it. */
export function LearningSection() {
  const { data, setData, loading, error } = useAsyncResource<Learning | null>(
    null,
    (token, signal) => fetchLearning(token, signal),
    [],
    "Could not load what Inroad has learned.",
  );
  const [confirming, setConfirming] = useState(false);

  // Settings renders this after loading, so the browser's own jump to
  // #learning (the link beside every rating) lands before it exists.
  useEffect(() => {
    if (!loading && window.location.hash === "#learning") {
      document.getElementById("learning")?.scrollIntoView({ block: "start" });
    }
  }, [loading]);
  const [resetting, setResetting] = useState(false);
  const [resetError, setResetError] = useState("");

  async function reset() {
    setResetting(true);
    setResetError("");
    try {
      setData(await resetLearning(await requireAccessToken()));
      setConfirming(false);
    } catch (caught) {
      setResetError(caught instanceof Error ? caught.message : "Could not reset.");
    } finally {
      setResetting(false);
    }
  }

  if (loading) return <Skeleton className="h-24 rounded-nest" />;
  if (error || !data) return <Notice size="xs">{error}</Notice>;

  return (
    <div className="flex flex-col gap-5">
      <SettingRow label="Your ratings" hint={ratingsHint(data)}>
        <p className="font-mono text-sm text-ink">{data.ratings ?? 0}</p>
      </SettingRow>

      {data.ratings ? (
        <>
          <LearnedList title="Showing fewer" items={data.showing_fewer ?? []} />
          <LearnedList title="Showing more" items={data.showing_more ?? []} />
        </>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-line pt-5">
        {confirming ? (
          <div className="flex flex-col gap-3 rounded-nest bg-surface-raised p-4">
            <p className="text-sm text-ink">
              This deletes all {data.ratings} of your ratings and everything learned from them.
              Roles and companies you passed on will show again.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" loading={resetting} onClick={reset}>
                Reset
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={resetting}
                onClick={() => setConfirming(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <Button
              variant="quiet"
              size="sm"
              disabled={!data.ratings}
              onClick={() => setConfirming(true)}
            >
              Reset what Inroad has learned
            </Button>
          </div>
        )}
        {resetError ? <Notice size="xs">{resetError}</Notice> : null}
      </div>
    </div>
  );
}

function ratingsHint(data: Learning): string {
  if (!data.ratings) return "Rate a role or company as a good fit or not for me to start.";
  if (data.updating) return "Your latest ratings are still being learned from.";
  const down = data.rated_down ?? 0;
  return `${down} not for me, ${data.ratings - down} good fit.`;
}

function LearnedList({ title, items }: { title: string; items: LearnedItem[] }) {
  return (
    <div className="border-t border-line pt-5">
      <p className="text-sm font-sans-semibold text-ink">{title}</p>
      {items.length === 0 ? (
        <p className="mt-1 text-xs text-ink-muted">
          Nothing yet. A pattern needs at least two ratings that agree.
        </p>
      ) : (
        <ul className="mt-2 flex flex-col gap-1.5">
          {items.map((item) => (
            <li
              key={`${item.kind}:${item.label}`}
              className="flex items-baseline justify-between gap-3 text-sm"
            >
              <span className="text-ink">{item.label}</span>
              {item.evidence ? (
                <span className="shrink-0 text-xs text-ink-faint">
                  {item.evidence} {item.evidence === 1 ? "rating" : "ratings"}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
