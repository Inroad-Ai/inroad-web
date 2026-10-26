// Lusha and ContactOut append here later - authMode "api_key" for either,
// unless they turn out to offer OAuth too. No backend change required, see
// schemas/connection.py's ConnectionProvider literal on the API side.
export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  Outreach: "Send outreach from your own accounts with full transparency and control.",
  "Contact data": "Enrich people found during research with verified email addresses.",
  "AI models":
    "Use your own provider key for resume parsing and outreach drafts. If you set nothing, " +
    "Inroad's default model is used. Company research is shared and never uses a personal key.",
};

// The same honest line in every AI-model key modal: what it powers and that
// the key is never readable again. Kept out of the card body, which stays short.
const AI_KEY_NOTE =
  "This key is used only for the features you point at it below. It is encrypted, " +
  "stored write-only, and never shown again. You pay the provider's bill and quota.";

export const KNOWN_PROVIDERS = [
  {
    provider: "gmail",
    label: "Gmail",
    category: "Outreach",
    eyebrow: "Send from your inbox",
    description:
      "Puts a drafted outreach email into your own Gmail Drafts, or sends it from your " +
      "account after you confirm the recipient. Every send is one you asked for; nothing " +
      "goes out on its own, and Inroad cannot read your existing mail.",
    logoSrc: "/logos/gmail.svg",
    authMode: "oauth",
    keyNote: null,
  },
  {
    provider: "apollo",
    label: "Apollo.io",
    category: "Contact data",
    eyebrow: "Find verified emails",
    description:
      "Fills in missing emails for people found via LinkedIn search. Requires an Apollo " +
      "plan with API access to People Enrichment - Apollo gates raw API calls above its " +
      "lower tiers, separate from its no-code Zapier/CRM integrations.",
    logoSrc: "/logos/apollo.svg",
    authMode: "oauth",
    keyNote: null,
  },
  {
    provider: "hunter",
    label: "Hunter.io",
    category: "Contact data",
    eyebrow: "Find verified emails",
    description:
      "Fills in missing emails for people found via LinkedIn search. Free plan includes " +
      "50 lookups/month with no card required - a good fallback when Apollo doesn't have a match.",
    logoSrc: "/logos/hunter.png",
    authMode: "api_key",
    keyNote: null,
  },
  {
    provider: "openai",
    label: "OpenAI",
    category: "AI models",
    eyebrow: "Use your own key",
    description:
      "Runs resume parsing or outreach drafts on your own OpenAI account when you point a " +
      "feature at it below. You pay OpenAI's bill and quota for those calls.",
    logoSrc: null,
    authMode: "api_key",
    keyNote: AI_KEY_NOTE,
  },
  {
    provider: "groq",
    label: "Groq",
    category: "AI models",
    eyebrow: "Use your own key",
    description:
      "Runs resume parsing or outreach drafts on your own Groq account when you point a " +
      "feature at it below. You pay Groq's bill and quota for those calls.",
    logoSrc: null,
    authMode: "api_key",
    keyNote: AI_KEY_NOTE,
  },
  {
    provider: "modelscope",
    label: "ModelScope",
    category: "AI models",
    eyebrow: "Use your own key",
    description:
      "Runs resume parsing or outreach drafts on your own ModelScope account when you point a " +
      "feature at it below. You pay ModelScope's bill and quota for those calls.",
    logoSrc: null,
    authMode: "api_key",
    keyNote: AI_KEY_NOTE,
  },
  {
    provider: "gemini",
    label: "Gemini",
    category: "AI models",
    eyebrow: "Use your own key",
    description:
      "Runs resume parsing or outreach drafts on your own Gemini account when you point a " +
      "feature at it below. You pay Google's bill and quota for those calls.",
    logoSrc: null,
    authMode: "api_key",
    keyNote: AI_KEY_NOTE,
  },
] as const;

export type KnownProvider = (typeof KNOWN_PROVIDERS)[number];

export function labelFor(provider: string | null): string {
  return KNOWN_PROVIDERS.find((entry) => entry.provider === provider)?.label ?? "That provider";
}

export function providersByCategory(): [string, KnownProvider[]][] {
  const groups = new Map<string, KnownProvider[]>();
  for (const provider of KNOWN_PROVIDERS) {
    groups.set(provider.category, [...(groups.get(provider.category) ?? []), provider]);
  }
  return Array.from(groups.entries());
}
