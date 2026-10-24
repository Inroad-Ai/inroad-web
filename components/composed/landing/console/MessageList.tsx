"use client";

import { useEffect, useRef } from "react";

import { AiMessage } from "./AiMessage";
import type { AiMessage as AiMessageData, ConsoleMessage } from "./console.types";

function EmptyState() {
  return (
    <div className="grid h-full place-items-center text-center">
      <div>
        <div
          aria-hidden
          className="relative mx-auto mb-4 h-14 w-14 rounded-full bg-gradient-to-br from-signal-amber via-signal-teal to-signal-amber-hover shadow-amber before:absolute before:inset-1 before:rounded-full before:bg-surface after:absolute after:inset-4 after:rounded-full after:bg-gradient-to-br after:from-signal-amber-hover after:via-signal-amber after:to-signal-teal"
        />
        <h3 className="text-2xl font-sans-semibold tracking-heading text-ink sm:text-3xl">
          How can I help today?
        </h3>
        <p className="mt-1.5 text-sm text-ink-muted">Ask about any company, person or draft.</p>
      </div>
    </div>
  );
}

/** The scrolling conversation. Scrolls itself, never the page. */
export function MessageList({
  messages,
  onChip,
  onPickCompany,
  onApprove,
}: {
  messages: readonly ConsoleMessage[];
  onChip: (message: AiMessageData, index: number) => void;
  onPickCompany: (message: AiMessageData, companyId: string, name: string) => void;
  onApprove: (id: number) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain scroll-smooth px-3.5 pb-3 pt-5 sm:px-7 sm:pt-6"
    >
      {messages.length === 0 ? <EmptyState /> : null}
      {messages.map((message) =>
        message.role === "user" ? (
          <div key={message.id} className="mb-5 flex justify-end">
            <p className="max-w-bubble rounded-2xl rounded-br-sm bg-ink px-4 py-2.5 text-sm text-paper sm:max-w-lg sm:text-base">
              {message.text}
            </p>
          </div>
        ) : (
          <AiMessage
            key={message.id}
            message={message}
            onChip={(index) => onChip(message, index)}
            onPickCompany={(id, name) => onPickCompany(message, id, name)}
            onApprove={() => onApprove(message.id)}
          />
        ),
      )}
    </div>
  );
}
