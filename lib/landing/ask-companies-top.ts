import type { DemoCompany } from "./ask-types";
import { source } from "./demo-source";

/** The three best fits for the sample profile, with the fullest research. */
export const TOP_FIT_COMPANIES: readonly DemoCompany[] = [
  {
    id: "ledgerline",
    name: "Ledgerline",
    domain: "ledgerline.com",
    fit: 92,
    tagline: "Accounting APIs for platforms that move money",
    whyNow:
      "Ledgerline raised a $42M Series B three weeks ago and announced a dedicated ledger platform team",
    matchedRole: "Senior Backend Engineer, Ledger",
    stack: ["Go", "PostgreSQL", "Kafka", "Kubernetes"],
    reasons: {
      role: "Hiring a Senior Backend Engineer, Ledger: your exact last role.",
      stack: "Go, PostgreSQL, Kafka. 7 of your top 8 skills.",
      stage: "Series B, 85 people. You said you like small teams.",
      work: "Remote within the EU, Berlin office optional.",
    },
    sources: {
      role: source(
        "jobs.ashbyhq.com",
        "“Senior Backend Engineer, Ledger” · 14 open roles on Ashby",
        "https://jobs.ashbyhq.com/ledgerline",
      ),
      funding: source(
        "ledgerline.com",
        "“...today we're announcing our $42M Series B, led by Northzone...”",
        "https://ledgerline.com/blog/series-b",
      ),
      team: source(
        "ledgerline.com",
        "“The new money goes first into a ledger platform team...”",
        "https://ledgerline.com/blog/series-b",
      ),
      tech: source(
        "ledgerline.com",
        "“...moving the write path from Elixir to Go cut p99 latency by 70%...”",
        "https://ledgerline.com/engineering/go-write-path",
      ),
      home: source(
        "ledgerline.com",
        "“Ledgerline gives marketplaces and fintech platforms a double-entry ledger as an API.”",
        "https://ledgerline.com",
      ),
    },
    signals: [
      {
        ago: "3w",
        text: "Raised $42M Series B",
        source: source(
          "TechCrunch",
          "“Raised $42M Series B” · Oct 2, 2026",
          "https://techcrunch.com/2026/10/02/ledgerline-raises-42m-series-b",
        ),
      },
      {
        ago: "9d",
        text: "Opened 6 engineering roles this month",
        source: source(
          "Ashby",
          "“Opened 6 engineering roles this month” · Oct 14, 2026",
          "https://jobs.ashbyhq.com/ledgerline",
        ),
      },
    ],
    pagesRead: 8,
    articlesRead: 12,
    openRoles: 14,
    careersBoard: "Ashby",
  },
  {
    id: "tessellate",
    name: "Tessellate",
    domain: "tessellate.dev",
    fit: 88,
    tagline: "Infrastructure as code that teams review like product code",
    whyNow: "Their CTO posted last week that they are hiring people who have been paged at 3am",
    matchedRole: "Founding Backend Engineer",
    stack: ["Go", "Terraform", "Kubernetes", "PostgreSQL"],
    reasons: {
      role: "Hiring a Platform Engineer and a Founding Backend Engineer.",
      stack: "Go, Terraform, Kubernetes.",
      stage: "Series A, 31 people.",
      work: "Remote-first, EU time zones.",
    },
    sources: {
      role: source(
        "jobs.lever.co",
        "“Founding Backend Engineer” · 5 open roles on Lever",
        "https://jobs.lever.co/tessellate",
      ),
      hiring: source(
        "LinkedIn",
        "“Hiring people who have been paged at 3am” · Oct 17, 2026",
        "https://linkedin.com/posts/tessellate-cto-hiring",
      ),
      home: source(
        "tessellate.dev",
        "“A collaborative editor and review layer for Terraform and Pulumi.”",
        "https://tessellate.dev",
      ),
    },
    signals: [
      {
        ago: "6d",
        text: "CTO post: hiring a founding backend engineer",
        source: source(
          "LinkedIn",
          "“CTO post: hiring a founding backend engineer” · Oct 17, 2026",
          "https://linkedin.com/posts/tessellate-cto-hiring",
        ),
      },
      {
        ago: "2w",
        text: "Launched multi-cloud plan previews",
        source: source(
          "Product Hunt",
          "“Launched multi-cloud plan previews” · Oct 8, 2026",
          "https://producthunt.com/posts/tessellate",
        ),
      },
    ],
    pagesRead: 6,
    articlesRead: 10,
    openRoles: 5,
    careersBoard: "Lever",
  },
  {
    id: "orrery",
    name: "Orrery Robotics",
    domain: "orrery.ai",
    fit: 81,
    tagline: "Fleet software for warehouse robots",
    whyNow: "Orrery signed a pilot with a top-3 logistics company in August",
    matchedRole: "Backend Engineer, Fleet Telemetry",
    stack: ["Python", "Rust", "Kafka", "PostgreSQL"],
    reasons: {
      role: "Backend Engineer, Fleet Telemetry.",
      stack: "Python, Kafka, PostgreSQL, some Rust.",
      stage: "Series B, 140 people.",
      work: "Hybrid, Berlin office two days a week.",
    },
    sources: {
      role: source(
        "boards.greenhouse.io",
        "“Backend Engineer, Fleet Telemetry” · 22 open roles on Greenhouse",
        "https://boards.greenhouse.io/orrery",
      ),
      launch: source(
        "Reuters",
        "“Pilot with a top-3 logistics company” · Aug 22, 2026",
        "https://reuters.com/technology/orrery-lands-logistics-pilot",
      ),
      home: source(
        "orrery.ai",
        "“Orchestration software that lets warehouses run mixed fleets of robots.”",
        "https://orrery.ai",
      ),
    },
    signals: [],
    pagesRead: 5,
    articlesRead: 10,
    openRoles: 22,
    careersBoard: "Greenhouse",
  },
];
