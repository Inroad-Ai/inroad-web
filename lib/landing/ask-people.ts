import type { DemoPerson } from "./ask-types";

export const DEMO_SENDER = "jordan.reyes@hey.com";

export const DEMO_PEOPLE: readonly DemoPerson[] = [
  {
    id: "priya",
    companyId: "ledgerline",
    name: "Priya Natarajan",
    title: "VP Engineering",
    email: "priya@ledgerline.com",
    linkedin: "linkedin.com/in/priyanatarajan",
    commonGround: [
      "Both ex-payments infrastructure",
      "Spoke at GopherCon EU 2025",
      "TU Berlin alum",
    ],
    foundVia: {
      label: "ledgerline.com/team",
      quote: "“Priya Natarajan, VP Engineering” · found on the team page and Apollo.io",
      url: "https://ledgerline.com/team",
    },
    draft: {
      subject: "Your ledger platform team, and a reconciliation rebuild I just did",
      body: "Hi Priya,\n\nCongrats on the Series B. The line about putting the money into a ledger platform team first caught my eye, because that is the exact system I've spent the last three years on.\n\nAt Payvault I led the rebuild of our ledger service in Go and took reconciliation from 6 hours to 11 minutes. Your post on moving the write path to Go reads like our own postmortem.\n\nI saw the Senior Backend Engineer, Ledger role. Would you be open to a 20-minute call next week? Happy to walk through how we handled consistent balance reads at high write volume.\n\nBest,\nJordan",
    },
  },
  {
    id: "marta",
    companyId: "tessellate",
    name: "Marta Oliveira",
    title: "CTO",
    email: "marta@tessellate.dev",
    linkedin: "linkedin.com/in/martaoliveira",
    commonGround: ["Both maintain open-source Postgres tools"],
    foundVia: {
      label: "linkedin.com",
      quote: "“Marta Oliveira, CTO” · found via LinkedIn search and Hunter.io",
      url: "https://linkedin.com/in/martaoliveira",
    },
    draft: {
      subject: "Founding backend role, from someone who has been paged at 3am",
      body: "Hi Marta,\n\nYour post about hiring people who have been paged at 3am made me laugh, then made me write this. I owned on-call for the payments core at Payvault for three years.\n\nI also maintain pgreplay-lite, which replays production Postgres traffic against staging. Plan previews for infra feel like the same idea one layer down.\n\nWould love to hear what the founding backend engineer would own first.\n\nJordan",
    },
  },
  {
    id: "tomas",
    companyId: "orrery",
    name: "Tomas Lindqvist",
    title: "Head of Platform",
    email: "tomas@orrery.ai",
    linkedin: "linkedin.com/in/tomaslindqvist",
    commonGround: ["Both ran Kafka at 1B+ events a day"],
    foundVia: {
      label: "orrery.ai/team",
      quote: "“Tomas Lindqvist, Head of Platform” · found on the team page and Apollo.io",
      url: "https://orrery.ai/team",
    },
    draft: {
      subject: "Fleet telemetry after the logistics pilot",
      body: "Hi Tomas,\n\nCongrats on the logistics pilot. A pilot that size usually means telemetry volume jumps before the pipeline is ready for it.\n\nAt Datasmith I ran Kafka ingestion at over a billion events a day, and I'd like to do that work somewhere it moves real things.\n\nI saw the Backend Engineer, Fleet Telemetry role. Could we find 20 minutes next week?\n\nBest,\nJordan",
    },
  },
  {
    id: "elena",
    companyId: "gridlight",
    name: "Elena Petrova",
    title: "VP Engineering",
    email: "elena@gridlight.energy",
    linkedin: "linkedin.com/in/elenapetrova",
    commonGround: ["Both ex-Datasmith network", "Berlin Go meetup"],
    foundVia: {
      label: "gridlight.energy/team",
      quote: "“Elena Petrova, VP Engineering” · found on the team page and Apollo.io",
      url: "https://gridlight.energy/team",
    },
    draft: {
      subject: "Market data ingestion at Gridlight",
      body: "Hi Elena,\n\nCongrats on signing 1.2 GW this year. I saw the Senior Backend Engineer, Market Data role and the note about sub-second ingestion across 9 exchanges.\n\nAt Datasmith I built Kafka ingestion handling 2B events a day, and I've been looking for a team where that kind of work has a direct line to the grid.\n\nCould we find 20 minutes next week?\n\nBest,\nJordan",
    },
  },
  {
    id: "lukas",
    companyId: "fernway",
    name: "Lukas Hofmann",
    title: "Co-founder",
    email: "lukas@fernway.co",
    linkedin: "linkedin.com/in/lukashofmann",
    commonGround: ["Both lived in Munich"],
    foundVia: {
      label: "fernway.co/team",
      quote: "“Lukas Hofmann, Co-founder” · found on the team page and Hunter.io",
      url: "https://fernway.co/team",
    },
    draft: {
      subject: "Your first data platform engineer",
      body: "Hi Lukas,\n\nI saw you're hiring your first data platform engineer. With CSRD deadlines pulling in demand, I'd guess supplier data is arriving faster than it can be cleaned.\n\nI've built ingestion pipelines on Python and PostgreSQL that had to survive messy inputs from hundreds of sources.\n\nWould you be open to a short call next week?\n\nBest,\nJordan",
    },
  },
];

export const primaryContactAt = (companyId: string): DemoPerson | undefined =>
  DEMO_PEOPLE.find((p) => p.companyId === companyId);
