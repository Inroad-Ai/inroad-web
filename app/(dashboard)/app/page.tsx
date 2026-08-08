"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { DossierSummary } from "@/components/composed/dashboard/DossierSummary";
import { HistoryList } from "@/components/composed/dashboard/HistoryList";
import { ResultCard } from "@/components/composed/dashboard/ResultCard";
import { SearchBar } from "@/components/composed/dashboard/SearchBar";
import { StatusDot } from "@/components/ui/StatusDot";
import { ApiError, fetchHistory, fetchResearch, recordLiveFetch } from "@/lib/api";
import {
  SOURCE_KEYS,
  type CardState,
  type CompanyDossier,
  type SourceKey,
} from "@/lib/types";

type CardStates = Record<SourceKey, CardState>;

const ALL_IDLE: CardStates = { homepage: "idle", news: "idle", hiring: "idle" };
const ALL_PENDING: CardStates = {
  homepage: "pending",
  news: "pending",
  hiring: "pending",
};

/** A source is "done" when it came back with something, "failed" when it did not. */
function settle(dossier: CompanyDossier): CardStates {
  return SOURCE_KEYS.reduce((states, key) => {
    states[key] = dossier[key] === null ? "failed" : "done";
    return states;
  }, {} as CardStates);
}

export default function DashboardPage() {
  const [domain, setDomain] = useState("");
  const [busy, setBusy] = useState(false);
  const [dossier, setDossier] = useState<CompanyDossier | null>(null);
  const [cards, setCards] = useState<CardStates>(ALL_IDLE);
  const [problem, setProblem] = useState<string | null>(null);
  const [runs, setRuns] = useState<CompanyDossier[]>([]);

  const loadHistory = useCallback(async () => {
    try {
      setRuns(await fetchHistory());
    } catch {
      // History is a convenience. If it is unavailable the page still works,
      // and the empty-list copy is honest either way.
    }
  }, []);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  async function run(next: string) {
    setDomain(next);
    setBusy(true);
    setProblem(null);
    setDossier(null);
    setCards(ALL_PENDING);

    try {
      const result = await fetchResearch(next);
      if (!result.from_cache) recordLiveFetch(result.domain);
      setDossier(result);
      setCards(settle(result));
      void loadHistory();
    } catch (error) {
      setCards(ALL_IDLE);
      setProblem(
        error instanceof ApiError
          ? error.message
          : "Something went wrong before the check could run.",
      );
    } finally {
      setBusy(false);
    }
  }

  /** Show a past run as it came back. No second request. */
  function show(past: CompanyDossier) {
    setDomain(past.domain);
    setProblem(null);
    setDossier(past);
    setCards(settle(past));
  }

  const started = busy || dossier !== null;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between">
        <Link href="/" className="font-mono text-sm text-paper">
          research<span className="text-signal-amber">/</span>fetcher
        </Link>
        <span className="utility-label text-paper/40">Dashboard</span>
      </div>

      <div className="mt-10">
        <SearchBar onRun={run} busy={busy} value={domain} />
      </div>

      {problem ? (
        <div className="mt-6 rounded-sm border border-muted-rose/40 bg-muted-rose/5 p-5">
          <div className="flex items-center gap-2">
            <StatusDot state="failed" />
            <span className="utility-label text-muted-rose">Could not run</span>
          </div>
          <p className="mt-2 text-sm text-paper/70">{problem}</p>
        </div>
      ) : null}

      {!started && !problem ? (
        <p className="mt-6 text-sm text-paper/60">
          Enter a company domain to see its homepage, its recent news and its
          open roles.
        </p>
      ) : null}

      {dossier ? (
        <div className="mt-8">
          <DossierSummary dossier={dossier} />
        </div>
      ) : null}

      {started ? (
        <>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {SOURCE_KEYS.map((key) => (
              <ResultCard
                key={key}
                source={key}
                state={cards[key]}
                dossier={dossier}
              />
            ))}
          </div>
          {dossier ? (
            // Worth saying plainly: the three checks do run at the same time,
            // but the service answers once, when the last of them is done, so
            // all three cards land together.
            <p className="mt-4 text-xs text-paper/40">
              All three ran together. They fill in at the same moment because
              the service replies once, after the slowest one finishes.
            </p>
          ) : null}
        </>
      ) : null}

      <div className="mt-16">
        <HistoryList
          runs={runs}
          onSelect={show}
          activeDomain={dossier?.domain ?? null}
        />
      </div>
    </main>
  );
}
