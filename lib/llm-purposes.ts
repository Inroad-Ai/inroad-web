/** The features a user may point at their own provider key, in one place so
 * the picker, labels and copy never drift. Mirrors app/schemas/llm.py's
 * LLMPurpose; resume parsing is not one, it always runs on Inroad's model. */

import type { LlmAssignmentProvider, LlmPurpose } from "@/lib/api-client/client";

export interface LlmPurposeMeta {
  id: LlmPurpose;
  label: string;
  hint: string;
}

export const LLM_PURPOSES: LlmPurposeMeta[] = [
  {
    id: "outreach_draft",
    label: "Outreach drafts",
    hint: "Writes your outreach emails and LinkedIn messages.",
  },
];

/** Display names for the providers a user can bring a key for. */
export const LLM_PROVIDER_LABELS: Record<LlmAssignmentProvider, string> = {
  openai: "OpenAI",
  groq: "Groq",
  modelscope: "ModelScope",
  gemini: "Gemini",
};
