"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { DossierSummary } from "@/components/composed/dashboard/DossierSummary";
import { HistoryList } from "@/components/composed/dashboard/HistoryList";
import { PageShell } from "@/components/composed/dashboard/PageShell";
import { ResultCard } from "@/components/composed/dashboard/ResultCard";
import { SearchBar } from "@/components/composed/dashboard/SearchBar";
import { Button } from "@/components/ui/Button";
import { StatusDot } from "@/components/ui/StatusDot";
import {
  ApiError,
  fetchHistory,
  fetchResearch,
  saveCompanyResearchNative,
} from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import { recordLiveFetch } from "@/lib/api";
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

/** The run above is a preview and nothing more until this saves it. Saving
 * sends the dossier the user is looking at rather than researching again, so
 * what is on screen is what lands in the companies table. */
function SaveResult({ dossier }: { dossier: CompanyDossier }) {
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState("");

  // A new domain resets the button, otherwise the previous run's "Saved"
  // state would carry over onto an unsaved one.
  useEffect(() => {
    setSavedId(null);
    setSaveError("");
  }, [dossier]);

  async function save() {
    setSaving(true);
    setSaveError("");
    try {
      const token = await ensureValidAccessToken();
      if (!token) throw new Error("Your session expired. Sign in again to save this.");
      const company = await saveCompanyResearchNative(dossier, token);
      setSavedId(company.id);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Could not save this company.");
    } finally {
      setSaving(false);
    }
  }

  if (savedId !== null) {
    return (
      <p className="mt-4 text-xs text-text-secondary/70">
        Saved to your companies.{" "}
        <Link
          href={`/companies/${savedId}`}
          className="text-signal-teal underline decoration-signal-teal/30 underline-offset-4"
        >
          Open {dossier.domain}
        </Link>
      </p>
    );
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-4">
      <Button variant="quiet" onClick={save} disabled={saving} className="px-5 py-2.5">
        {saving ? "Saving..." : "Save to companies"}
      </Button>
      <span className="text-xs text-text-secondary/70">
        This is a live preview. Nothing is stored until you save it.
      </span>
      {saveError ? (
        <p className="w-full text-sm text-error" role="alert">
          {saveError}
        </p>
      ) : null}
    </div>
  );
}

export default function ResearchPage() {
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
    <PageShell
      title="Research"
      description="Enter a company domain to see its homepage, its recent news and its open roles."
      action={
        <div className="sm:min-w-[26rem]">
          <SearchBar onRun={run} busy={busy} value={domain} />
        </div>
      }
    >
      {problem ? (
        <div className="mt-6 rounded-sm border border-muted-rose/40 bg-muted-rose-subtle p-5">
          <div className="flex items-center gap-2">
            <StatusDot state="failed" />
            <span className="utility-label text-muted-rose">Could not run</span>
          </div>
          <p className="mt-2 text-sm text-text-secondary">{problem}</p>
        </div>
      ) : null}

      {dossier ? (
        <div className="mt-6">
          <DossierSummary dossier={dossier} />
        </div>
      ) : null}

      {started ? (
        <>
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
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
            <>
              {/* Worth saying plainly: the three checks do run at the same time,
                  but the service answers once, when the last of them is done, so
                  all three cards land together. */}
              <p className="mt-4 text-xs text-text-secondary/70">
                All three ran together. They fill in at the same moment because
                the service replies once, after the slowest one finishes.
              </p>
              <SaveResult dossier={dossier} />
            </>
          ) : null}
        </>
      ) : null}

      <div className="mt-10">
        <HistoryList
          runs={runs}
          onSelect={show}
          activeDomain={dossier?.domain ?? null}
        />
      </div>
    </PageShell>
  );
}
