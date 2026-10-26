/** The request-scoped features a user may point at their own provider key,
 * in one place so the picker, labels and copy never drift. Mirrors the
 * purpose literal in app/schemas/llm.py (resume_parse, outreach_draft). */

import type { LlmAssignmentProvider, LlmPurpose } from "@/lib/api-client/client";

export interface LlmPurposeMeta {
  id: LlmPurpose;
  label: string;
  hint: string;
}

export const LLM_PURPOSES: LlmPurposeMeta[] = [
  {
    id: "resume_parse",
    label: "Resume parsing",
    hint: "Reads an uploaded resume into structured profile fields.",
  },
  {
    id: "outreach_draft",
    label: "Outreach drafts",
    hint: "Writes the first draft of an outreach email.",
  },
];

/** Display names for the providers a user can bring a key for. */
export const LLM_PROVIDER_LABELS: Record<LlmAssignmentProvider, string> = {
  openai: "OpenAI",
  groq: "Groq",
  modelscope: "ModelScope",
  gemini: "Gemini",
};
