/** Copy for the landing sections below the story. Product facts only: no
 * cohort numbers until there are real ones to show. */

export const HOW_STEPS = [
  {
    title: "Find companies that actually fit what you want.",
    points: [
      "Matched on role, stack, stage and how they work",
      "One domain becomes one dossier",
      "Every score comes with the reason behind it",
    ],
  },
  {
    title: "Research the details worth mentioning, fast.",
    points: [
      "Homepage, news and hiring read in parallel",
      "Every fact links back to its source",
      "Nothing goes in a draft unverified",
    ],
  },
  {
    title: "Send outreach that sounds like you, not a template.",
    points: [
      "Drafts built from your profile and real facts",
      "Tone and length are yours to tune",
      "Always your call before anything sends",
    ],
  },
] as const;

export const PRODUCT_FACTS = [
  { value: "3", label: "sources read for every company: its homepage, its news and its hiring" },
  { value: "1", label: "link behind every fact, back to the page it was read from" },
  { value: "0", label: "emails sent without you pressing Send yourself" },
  { value: "€0", label: "to use Inroad while it is in early access" },
] as const;

export const OLD_LOOP = [
  "Search for a fit",
  "Open too many tabs",
  "Try to find a reason",
  "Write from memory",
  "Hope it lands",
] as const;

export const NEW_LOOP = [
  "Get twelve companies that fit",
  "Read one dossier, not twenty tabs",
  "Start from a real reason to write",
  "Edit a draft that already sounds like you",
  "Send it yourself, and follow up on time",
] as const;

export const COMPARISON = [
  ["Starting point", "A vacancy", "A company worth knowing"],
  ["What you receive", "A place in a queue", "Context for a real message"],
  ["How it feels", "Apply, then wait", "Research, decide, reach out"],
  ["Who sends", "A system on your behalf", "You, with the final word"],
] as const;

export const PRO_PRICE = { monthly: 18, yearlyPerMonth: 15, yearlyTotal: 180 } as const;

export const PLANS = {
  free: {
    name: "Early access",
    note: "Everything you need to land the next role.",
    features: [
      "25 companies researched a month",
      "Drafts and follow-ups for every contact",
      "Send from your own Gmail",
      "Pipeline, notes and reply tracking",
    ],
  },
  pro: {
    name: "Pro",
    features: [
      "Unlimited research and re-research",
      "Contact lookups with Apollo.io or Hunter.io",
      "Custom follow-up cadences",
      "Weekly new-match scans",
    ],
  },
} as const;

export const FAQ = [
  {
    q: "How is this different from Simplify or a job board?",
    a: "Job boards and auto-apply tools put you in a queue for a posted vacancy. Inroad starts from companies that fit you, researches them, and helps you write to a person who can hire you, whether or not a role is posted.",
  },
  {
    q: "Do you send emails automatically?",
    a: "No. Inroad drafts. You read, edit, and press Send yourself, from your own Gmail. Nothing goes out without you.",
  },
  {
    q: "Is my data safe?",
    a: "Your resume is parsed and then discarded. Connections use OAuth or your own API keys, are private to your account, and can be disconnected at any time.",
  },
  {
    q: "Is it free?",
    a: "Free during early access. If that changes, you'll hear about it well before anything is charged.",
  },
  {
    q: "Who does Inroad write to?",
    a: "The person most likely to run the team you'd join: a founder, CTO or VP at a small company, an engineering or product lead at a larger one. You can switch to anyone else Inroad found, including recruiters.",
  },
  {
    q: "Does it work if I'm not an engineer?",
    a: "Yes. Matching and research work the same for product, design and data roles. Pick your roles during setup and Inroad searches for those.",
  },
  {
    q: "Can I change the drafts?",
    a: "Every word. Edit directly, or ask for warmer, shorter, more specific or more formal. Inroad never sends a draft you haven't approved.",
  },
] as const;
