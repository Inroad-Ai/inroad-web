"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";

import { companyDisplayName } from "@/lib/company-brief";
import { formatRelativeDays } from "@/lib/format";
import { USUAL_SCAN_RANGE } from "@/lib/match-scan";
import { useResearchRuns } from "@/lib/research-runs";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { Notice } from "@/components/ui/Notice";

import { MatchScanRow } from "../../research/MatchScanRow";
import { ResearchSteps } from "../../research/ResearchSteps";
import { ScanTimer } from "../../research/ScanTimer";
import { isMatchInFlight, useMatchScans } from "../../research/useMatchScans";
import { useRecentCompanies } from "../../research/useRecentCompanies";
import { Btn, Ic, Section } from "../kit";

type Action = "focus" | "match" | "link" | "soon";

interface Item {
  icon: string;
  title: string;
  desc: string;
  action: Action;
  href?: string;
}

const GROUPS: { title: string; items: Item[] }[] = [
  {
    title: "Companies",
    items: [
      {
        icon: "target",
        title: "Find companies for me",
        desc: "Match companies to your profile, location and hiring signals.",
        action: "match",
      },
      {
        icon: "building",
        title: "Deep-dive a company",
        desc: "Site, news, funding, tech, people and open roles.",
        action: "focus",
      },
      {
        icon: "rocket",
        title: "Funding and stealth startups",
        desc: "Fresh rounds and filings, before they post a role.",
        action: "soon",
      },
    ],
  },
  {
    title: "People",
    items: [
      {
        icon: "users",
        title: "People and decision makers",
        desc: "Who hires, who refers, and the best way in.",
        action: "link",
        href: "/contacts",
      },
      {
        icon: "user",
        title: "Research a person",
        desc: "Background, writing, talks and common ground.",
        action: "soon",
      },
    ],
  },
  {
    title: "Opportunities",
    items: [
      {
        icon: "layers",
        title: "Boards and hidden roles",
        desc: "Public, private and hidden sources, ranked for you.",
        action: "link",
        href: "/opportunities",
      },
      {
        icon: "briefcase",
        title: "Freelance and contracts",
        desc: "Direct clients and platforms, with rates.",
        action: "soon",
      },
      {
        icon: "zap",
        title: "Lead generation",
        desc: "Clients or leads by region and size.",
        action: "soon",
      },
    ],
  },
];

export function DiscoverPage() {
  const [domain, setDomain] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { runs, startResearch } = useResearchRuns();
  const scans = useMatchScans();
  const { matchBusy, matchRuns, runMatch, retryMatchPoll } = scans;

  const active = runs.find((run) => run.state === "pending");
  const latest = runs[0];
  const finished = runs.filter((run) => run.state === "done").length;
  const recent = useRecentCompanies(finished);
  const scanning = matchRuns.find(isMatchInFlight);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = domain.trim();
    if (next && !active) startResearch(next);
  }

  function run(item: Item) {
    if (item.action === "match") runMatch();
    else if (item.action === "focus") inputRef.current?.focus();
  }

  return (
    <div style={{ maxWidth: 1040 }}>
      <h1 className="t">Discover</h1>
      <div className="sub">
        Paste a company website to get a brief, or let your profile find companies for you.
      </div>

      <form
        onSubmit={submit}
        className="field lg focus"
        style={{ marginTop: 26, color: "rgb(var(--color-ink))" }}
      >
        <Ic n="search" size="l" />
        <label htmlFor="research-domain" className="sr-only">
          Company website
        </label>
        <input
          ref={inputRef}
          id="research-domain"
          name="domain"
          value={domain}
          onChange={(event) => setDomain(event.target.value)}
          placeholder="Paste a company website, e.g. stripe.com"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          disabled={Boolean(active)}
          style={{
            flex: 1,
            minWidth: 0,
            background: "none",
            border: 0,
            outline: 0,
            color: "inherit",
            font: "inherit",
          }}
        />
        <button
          type="submit"
          className="btn p"
          disabled={Boolean(active) || domain.trim().length === 0}
        >
          {active ? "Researching..." : "Research"}
          <Ic n="arrow" size="s" />
        </button>
      </form>

      <div style={{ marginTop: 18 }}>
        {active ? (
          <ResearchSteps run={active} />
        ) : latest?.state === "done" && latest.companyId ? (
          <div className="note teal" style={{ alignItems: "center" }}>
            <Ic n="check" size="s" />
            <span style={{ flex: 1 }}>
              <b>{latest.domain}</b> is ready.
            </span>
            <Btn kind="p sm" href={`/companies/${latest.companyId}`}>
              Open brief
            </Btn>
          </div>
        ) : latest?.state === "failed" ? (
          <Notice boxed>
            {latest.domain}: {latest.error ?? "Research stopped. Try again."}
          </Notice>
        ) : (
          <div className="sm faint">
            Usually 20 to 40 seconds. You can leave this page; it keeps going.
          </div>
        )}
      </div>

      <div className="row split" style={{ gap: 56, alignItems: "flex-start", marginTop: 44 }}>
        {GROUPS.map((group) => (
          <div key={group.title} style={{ flex: 1, minWidth: 0 }}>
            <div className="sm faint" style={{ marginBottom: 8 }}>
              {group.title}
            </div>
            {group.items.map((item) => {
              const body = (
                <>
                  <span className="muted" style={{ marginTop: 2 }}>
                    <Ic n={item.icon} />
                  </span>
                  <div>
                    <div className="m" style={{ fontSize: 15 }}>
                      {item.title}
                      {item.action === "soon" ? (
                        <span className="tag" style={{ marginLeft: 8 }}>
                          Soon
                        </span>
                      ) : null}
                    </div>
                    <div className="sm muted" style={{ marginTop: 2, lineHeight: 1.45 }}>
                      {item.desc}
                    </div>
                  </div>
                </>
              );
              const style = {
                gap: 14,
                padding: "12px 10px",
                margin: "0 -10px",
                borderRadius: 10,
                alignItems: "flex-start",
                opacity: item.action === "soon" ? 0.55 : 1,
              };
              if (item.action === "link" && item.href) {
                return (
                  <Link key={item.title} href={item.href} className="row" style={style}>
                    {body}
                  </Link>
                );
              }
              return (
                <button
                  key={item.title}
                  type="button"
                  className="row"
                  style={{ ...style, width: "100%" }}
                  disabled={item.action === "soon" || (item.action === "match" && matchBusy)}
                  onClick={() => run(item)}
                >
                  {body}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div
        className="row wrap"
        style={{
          gap: 18,
          marginTop: 30,
          paddingTop: 18,
          borderTop: "1px solid rgb(var(--color-line))",
        }}
      >
        <span className="muted sm">Running now</span>
        {active ? (
          <span className="st teal sm">
            <i />
            {active.domain}
          </span>
        ) : null}
        {scanning ? (
          <span className="st teal sm">
            <i />
            Company match scan
          </span>
        ) : null}
        {!active && !scanning ? <span className="sm faint">Nothing is running.</span> : null}
        <span className="sp" />
        {scanning ? (
          <ScanTimer startedAt={scanning.startedAt} />
        ) : (
          <span className="sm faint">Match scan: {USUAL_SCAN_RANGE}</span>
        )}
      </div>

      {matchRuns.length > 0 ? (
        <Section title="Your scans" style={{ marginTop: 36 }}>
          <ul style={{ listStyle: "none" }} className="divide-y divide-line">
            {matchRuns.map((scan) => (
              <MatchScanRow key={scan.id} run={scan} onRetry={retryMatchPoll} />
            ))}
          </ul>
        </Section>
      ) : null}

      <Section title="Recently researched" style={{ marginTop: 36 }}>
        {recent === null ? null : recent.length === 0 ? (
          <p className="sm muted">Companies you research show up here.</p>
        ) : (
          <div className="list">
            {recent.map((company) => (
              <Link key={company.id} href={`/companies/${company.id}`}>
                <CompanyLogo logoUrl={company.logo_url} seed={company.domain} size="sm" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="m">{companyDisplayName(company)}</div>
                  <div className="xs faint">
                    {company.domain} · {formatRelativeDays(company.updated_at)}
                  </div>
                </div>
                <span className="faint">
                  <Ic n="chev" size="s" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
