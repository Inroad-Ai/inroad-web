import type { DemoAnswer } from "@/lib/landing/ask-types";

export type RowState = "pending" | "sync" | "live";

export interface UserMessage {
  id: number;
  role: "user";
  text: string;
}

export interface AiMessage {
  id: number;
  role: "ai";
  answer: DemoAnswer;
  phase: "thinking" | "scanning" | "answered";
  rows: readonly RowState[];
  typedTokens: number;
  sent: boolean;
  activeChip: number | null;
  pickedCompany: string | null;
}

export type ConsoleMessage = UserMessage | AiMessage;

export interface CursorState {
  x: number;
  y: number;
  visible: boolean;
  /** Jump without animating, used to park the cursor before it travels. */
  instant: boolean;
}
