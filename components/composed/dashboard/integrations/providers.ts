import { LLM_PROVIDER_LABELS } from "@/lib/llm-purposes";
import type { LlmAssignmentProvider } from "@/lib/api-client/client";

// Lusha and ContactOut append here later - authMode "api_key" for either,
// unless they turn out to offer OAuth too. No backend change required, see
// schemas/connection.py's ConnectionProvider literal on the API side.
export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  Outreach: "Send outreach from your own accounts with full transparency and control.",
  "Contact data": "Enrich people found during research with verified email addresses.",
  "AI models":
    "Optional. Run your outreach drafts on your own AI provider account instead of Inroad's " +
    "model. Resume parsing and company research always use Inroad's model.",
};

// Kept out of the card body, which stays short.
const AI_KEY_NOTE =
  "Inroad uses this key only for your outreach drafts. It is encrypted, stored write-only " +
  "and never shown again. You pay the provider directly for those calls.";

function aiModelProvider<P extends LlmAssignmentProvider>(provider: P) {
  const label = LLM_PROVIDER_LABELS[provider];
  return {
    provider,
    label,
    category: "AI models",
    eyebrow: "Use your own key",
    description: `Writes your outreach drafts on your own ${label} account, with the model you pick.`,
    logoSrc: null,
    authMode: "api_key",
    keyNote: AI_KEY_NOTE,
  } as const;
}

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
  aiModelProvider("openai"),
  aiModelProvider("gemini"),
  aiModelProvider("groq"),
  aiModelProvider("modelscope"),
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
