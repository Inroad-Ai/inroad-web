import type { ConnectionProvider } from "@/lib/api-client/client";

import type { ConnectStepId } from "./onboarding-steps";

export interface ConnectStepContent {
  title: string;
  /** What connecting this does for the user. */
  why: string;
  /** What happens without it, and where to set it up later. */
  later: string;
  providers: readonly ConnectionProvider[];
}

export const CONNECT_STEPS: Record<ConnectStepId, ConnectStepContent> = {
  gmail: {
    title: "Connect Gmail",
    why:
      "Your outreach goes out from your own inbox, so replies come straight back to you. " +
      "Inroad only creates drafts and sends the messages you approve. It cannot read your mail.",
    later:
      "You'll need this before sending your first message. Skip for now and connect it " +
      "any time from Integrations in the sidebar.",
    providers: ["gmail"],
  },
  aiKey: {
    title: "Use your own AI key",
    why:
      "Inroad writes your outreach drafts with its own model, so there's nothing to set up. " +
      "Add a key if you'd rather drafts run on your own OpenAI, Gemini, Groq or ModelScope " +
      "account: you choose the model and pay that provider directly. Resume parsing and " +
      "company research always use Inroad's model.",
    later:
      "Most people skip this. You can add, change or remove a key any time under " +
      "Integrations, AI models.",
    providers: ["openai", "gemini", "groq", "modelscope"],
  },
  contactData: {
    title: "Find verified emails",
    why:
      "When research finds the right person at a company, Apollo or Hunter looks up their " +
      "work email so your message reaches them. Connect either one, or both. Hunter's free " +
      "plan covers 50 lookups a month.",
    later:
      "Everything else works without one, you'd just find emails yourself. Connect one any " +
      "time from Integrations in the sidebar.",
    providers: ["apollo", "hunter"],
  },
};

export function connectStepFor(provider: string | null): ConnectStepId | null {
  const entry = Object.entries(CONNECT_STEPS).find(([, step]) =>
    step.providers.some((candidate) => candidate === provider),
  );
  return entry ? (entry[0] as ConnectStepId) : null;
}
