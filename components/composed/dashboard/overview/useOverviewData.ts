"use client";

import { useEffect, useState } from "react";

import type { PipelineStage } from "@/components/ui/StatusBadge";
import { fetchCompanies, fetchOverviewStats } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import type { Company, OverviewStats } from "@/lib/types";

// Stages where a company is waiting on the user, not on someone else's reply.
const FOLLOW_UP_STAGES = new Set<PipelineStage>(["researched", "contacted"]);
const FOLLOW_UP_LIMIT = 5;
// Wide enough that the oldest few in a follow-up stage are usually in it.
const FOLLOW_UP_SCAN_SIZE = 25;
const RECENT_LIMIT = 5;
const CONTACTED_WINDOW_DAYS = 30;

export type OverviewLoadState = "loading" | "error" | "empty" | "ready";

interface OverviewData {
  state: OverviewLoadState;
  stats: OverviewStats | null;
  message: string;
  followUps: Company[];
  recent: Company[];
}

export function useOverviewData(): OverviewData {
  const [state, setState] = useState<OverviewLoadState>("loading");
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [message, setMessage] = useState("");
  // Independent of `state`: a list failing shouldn't blank the dashboard.
  const [followUps, setFollowUps] = useState<Company[]>([]);
  const [recent, setRecent] = useState<Company[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function loadStats(token: string) {
      try {
        const result = await fetchOverviewStats(token, signal, CONTACTED_WINDOW_DAYS);
        setStats(result);
        setState(result.total_companies ? "ready" : "empty");
      } catch (error) {
        if (!signal.aborted) {
          setMessage(error instanceof Error ? error.message : "Could not load your overview.");
          setState("error");
        }
      }
    }

    async function loadFollowUps(token: string) {
      try {
        const companies = await fetchCompanies(
          { sort: "updated_asc", pageSize: FOLLOW_UP_SCAN_SIZE },
          token,
          signal,
        );
        setFollowUps(
          companies.items
            .filter((company) => FOLLOW_UP_STAGES.has(company.stage))
            .slice(0, FOLLOW_UP_LIMIT),
        );
      } catch {
        // Best-effort widget - leave the list empty on failure.
      }
    }

    async function loadRecent(token: string) {
      try {
        const companies = await fetchCompanies(
          { sort: "updated_desc", pageSize: RECENT_LIMIT },
          token,
          signal,
        );
        setRecent(companies.items);
      } catch {
        // Best-effort widget - leave the list empty on failure.
      }
    }

    async function load() {
      const token = await ensureValidAccessToken();
      if (!token) {
        setMessage("Your session expired. Sign in again to see your overview.");
        setState("error");
        return;
      }
      await Promise.all([loadStats(token), loadFollowUps(token), loadRecent(token)]);
    }

    void load();
    return () => controller.abort();
  }, []);

  return { state, stats, message, followUps, recent };
}
