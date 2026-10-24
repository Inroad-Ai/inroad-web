"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import { SearchIcon } from "@/components/ui/Icons";
import { Input } from "@/components/ui/Input";
import { useResearchRuns } from "@/lib/research-runs";

import { DashboardPanel } from "../DashboardPanel";
import { ResearchProgress } from "./ResearchProgress";

export function CompanyResearchPanel({ className = "" }: { className?: string }) {
  const [domain, setDomain] = useState("");
  const { runs, startResearch } = useResearchRuns();
  const activeRun = runs.find((run) => run.state === "pending");
  const busy = Boolean(activeRun);

  function runResearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextDomain = domain.trim();
    if (nextDomain && !busy) startResearch(nextDomain);
  }

  return (
    <DashboardPanel
      eyebrow="Company intelligence"
      title="Start with a company domain"
      description="We pull the company's profile, hiring signals and relevant context into one research brief."
      className={className}
    >
      <form onSubmit={runResearch}>
        <label htmlFor="research-domain" className="text-sm font-sans-semibold text-ink">
          Company website
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Input
            id="research-domain"
            name="domain"
            value={domain}
            onChange={(event) => setDomain(event.target.value)}
            placeholder="e.g. stripe.com"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            disabled={busy}
            className="min-w-0 flex-1"
          />
          <Button
            type="submit"
            size="lg"
            icon={<SearchIcon />}
            disabled={busy || domain.trim().length === 0}
          >
            {busy ? "Research in progress" : "Research company"}
          </Button>
        </div>
      </form>
      {activeRun ? (
        <ResearchProgress run={activeRun} />
      ) : (
        <p className="mt-6 border-t border-line pt-5 text-sm text-ink-muted">
          We&apos;ll check the company&apos;s website, news, people and hiring information, then
          write a brief.
        </p>
      )}
    </DashboardPanel>
  );
}
