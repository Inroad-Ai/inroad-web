"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { companyDisplayName } from "@/lib/company-brief";
import { formatRelativeDays } from "@/lib/format";
import { useResearchRuns } from "@/lib/research-runs";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { ArrowRightIcon, SearchIcon } from "@/components/ui/Icons";
import { Input } from "@/components/ui/Input";
import { Notice } from "@/components/ui/Notice";

import { DashboardPanel } from "../DashboardPanel";
import { ResearchSteps } from "./ResearchSteps";
import { useRecentCompanies } from "./useRecentCompanies";

export function CompanyResearchTab() {
  const [domain, setDomain] = useState("");
  const { runs, startResearch } = useResearchRuns();
  const active = runs.find((run) => run.state === "pending");
  const latest = runs[0];
  const finished = runs.filter((run) => run.state === "done").length;
  const recent = useRecentCompanies(finished);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = domain.trim();
    if (next && !active) startResearch(next);
  }

  return (
    <div className="flex flex-col gap-6">
      <DashboardPanel
        title="Research a company"
        description="Paste their website. You get a brief: what they do, the jobs that fit you, who to contact and what to mention."
      >
        <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="research-domain" className="sr-only">
            Company website
          </label>
          <Input
            id="research-domain"
            name="domain"
            value={domain}
            onChange={(event) => setDomain(event.target.value)}
            placeholder="e.g. stripe.com"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            disabled={Boolean(active)}
            className="min-w-0 flex-1"
          />
          <Button
            type="submit"
            size="lg"
            icon={<SearchIcon />}
            disabled={Boolean(active) || domain.trim().length === 0}
          >
            {active ? "Researching..." : "Research"}
          </Button>
        </form>

        <div className="mt-5">
          {active ? (
            <ResearchSteps run={active} />
          ) : latest?.state === "done" && latest.companyId ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-nest bg-signal-teal-subtle px-4 py-3 motion-safe:animate-fade-up">
              <p className="text-sm text-ink">
                <span className="font-sans-semibold">{latest.domain}</span> is ready.
              </p>
              <Button href={`/companies/${latest.companyId}`} size="sm">
                Open brief
              </Button>
            </div>
          ) : latest?.state === "failed" ? (
            <Notice boxed>
              {latest.domain}: {latest.error ?? "Research stopped. Try again."}
            </Notice>
          ) : (
            <p className="text-sm text-ink-muted">
              Usually 20 to 40 seconds. You can leave this page; it keeps going.
            </p>
          )}
        </div>
      </DashboardPanel>

      <section aria-labelledby="recent-research">
        <h2 id="recent-research" className="text-lg font-sans-semibold tracking-heading text-ink">
          Recently researched
        </h2>
        {recent === null ? null : recent.length === 0 ? (
          <p className="mt-3 text-sm text-ink-muted">Companies you research show up here.</p>
        ) : (
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {recent.map((company) => (
              <li key={company.id}>
                <Link href={`/companies/${company.id}`} className="group block">
                  <Card variant="interactive" padding="sm" className="flex items-center gap-3">
                    <CompanyLogo logoUrl={company.logo_url} seed={company.domain} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-sans-semibold text-ink">
                        {companyDisplayName(company)}
                      </span>
                      <span className="block truncate text-xs text-ink-muted">
                        {company.domain} · {formatRelativeDays(company.updated_at)}
                      </span>
                    </span>
                    <span className="text-ink-faint transition-colors duration-fast group-hover:text-ink">
                      <ArrowRightIcon />
                    </span>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
