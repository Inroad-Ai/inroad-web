import type { DemoCompany } from "./ask-types";
import { source } from "./demo-source";

export const MORE_COMPANIES: readonly DemoCompany[] = [
  {
    id: "gridlight",
    name: "Gridlight",
    domain: "gridlight.energy",
    fit: 79,
    tagline: "Trading software for grid batteries",
    whyNow: "Gridlight signed 1.2 GW of new battery capacity this year",
    matchedRole: "Senior Backend Engineer, Market Data",
    stack: ["Python", "Kafka", "PostgreSQL", "Rust"],
    reasons: {
      role: "Senior Backend Engineer, Market Data.",
      stack: "Python, Kafka, PostgreSQL.",
      stage: "Series A, 40 people.",
      work: "Hybrid, Berlin.",
    },
    sources: {
      role: source(
        "jobs.ashbyhq.com",
        "“Senior Backend Engineer, Market Data” · 6 open roles on Ashby",
        "https://jobs.ashbyhq.com/gridlight",
      ),
      funding: source(
        "Handelsblatt",
        "“Raised $28M Series A” · Sep 5, 2026",
        "https://handelsblatt.com/technik/gridlight-series-a",
      ),
      home: source(
        "gridlight.energy",
        "“Optimizes when grid-scale batteries buy and sell power on European markets.”",
        "https://gridlight.energy",
      ),
    },
    signals: [
      {
        ago: "7w",
        text: "Raised $28M Series A",
        source: source(
          "Handelsblatt",
          "“Raised $28M Series A” · Sep 5, 2026",
          "https://handelsblatt.com/technik/gridlight-series-a",
        ),
      },
    ],
    pagesRead: 5,
    articlesRead: 9,
    openRoles: 6,
    careersBoard: "Ashby",
  },
  {
    id: "fernway",
    name: "Fernway",
    domain: "fernway.co",
    fit: 77,
    tagline: "Carbon accounting for mid-size manufacturers",
    whyNow: "CSRD deadlines are driving a 4x jump in inbound demand",
    matchedRole: "Senior Data Platform Engineer",
    stack: ["Python", "dbt", "PostgreSQL", "Airflow"],
    reasons: {
      role: "Senior Data Platform Engineer.",
      stack: "Python, dbt, PostgreSQL.",
      stage: "Series A, 48 people.",
      work: "Remote in the EU.",
    },
    sources: {
      hiring: source(
        "fernway.co",
        "“Hiring our first data platform engineer” · careers page",
        "https://fernway.co/careers",
      ),
      home: source(
        "fernway.co",
        "“Software that turns invoices and energy bills into an auditable carbon footprint.”",
        "https://fernway.co",
      ),
    },
    signals: [
      {
        ago: "12d",
        text: "Hiring their first data platform engineer",
        source: source(
          "Careers page",
          "“Hiring our first data platform engineer” · Oct 11, 2026",
          "https://fernway.co/careers",
        ),
      },
    ],
    pagesRead: 4,
    articlesRead: 9,
    openRoles: 4,
    careersBoard: "careers page",
  },
  {
    id: "wrenly",
    name: "Wrenly",
    domain: "wrenly.app",
    fit: 72,
    tagline: "Onboarding paperwork and payroll setup for small companies",
    whyNow: "Wrenly just announced a DATEV integration",
    matchedRole: "Senior Backend Engineer",
    stack: ["Python", "Django", "PostgreSQL"],
    reasons: {
      role: "Senior Backend Engineer.",
      stack: "Python, PostgreSQL.",
      stage: "Seed+, 22 people.",
      work: "Remote.",
    },
    sources: {
      launch: source(
        "wrenly.app",
        "“DATEV integration announced” · Oct 7, 2026",
        "https://wrenly.app/blog/datev",
      ),
      home: source(
        "wrenly.app",
        "“Paperwork, payroll setup and equipment for new hires at companies under 200 people.”",
        "https://wrenly.app",
      ),
    },
    signals: [],
    pagesRead: 4,
    articlesRead: 9,
    openRoles: 2,
    careersBoard: "Ashby",
  },
  {
    id: "atlasfold",
    name: "Atlasfold",
    domain: "atlasfold.com",
    fit: 68,
    tagline: "Maps and geocoding API for logistics apps",
    whyNow: "Atlasfold just launched EU data residency",
    matchedRole: "Backend Engineer, Geo",
    stack: ["Go", "PostGIS", "Rust"],
    reasons: {
      role: "Backend Engineer, Geo.",
      stack: "Go, PostGIS.",
      stage: "Series A, 26 people.",
      work: "Remote.",
    },
    sources: {
      launch: source(
        "atlasfold.com",
        "“Launched EU data residency” · Oct 15, 2026",
        "https://atlasfold.com/blog/eu-data-residency",
      ),
      home: source(
        "atlasfold.com",
        "“Geocoding and routing APIs priced per request, built on open map data.”",
        "https://atlasfold.com",
      ),
    },
    signals: [],
    pagesRead: 4,
    articlesRead: 9,
    openRoles: 3,
    careersBoard: "Lever",
  },
];
