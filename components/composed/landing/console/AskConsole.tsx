"use client";

import { useRef } from "react";

import { AskComposer } from "./AskComposer";
import { CitationProvider } from "./CitationContext";
import { ConsoleFrame } from "./ConsoleFrame";
import { ConsoleSidebar } from "./ConsoleSidebar";
import { DemoCursor } from "./DemoCursor";
import { MessageList } from "./MessageList";
import { useAskDemo } from "./useAskDemo";

export const CONSOLE_ANCHOR = "console";

/** The hero's working preview of Ask: plays a scripted run while on screen,
 * and answers a visitor's own questions from static sample data. */
export function AskConsole() {
  const rootRef = useRef<HTMLDivElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);
  const demo = useAskDemo(rootRef, consoleRef);

  return (
    <div
      id={CONSOLE_ANCHOR}
      ref={rootRef}
      className="relative isolate mx-auto mt-10 w-full max-w-6xl scroll-mt-24 text-left sm:mt-12 sm:px-6"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-12 -top-10 -z-10 h-3/4 bg-glow-amber blur-3xl"
      />
      <CitationProvider>
        <ConsoleFrame onReplay={demo.replay}>
          <ConsoleSidebar />
          <div ref={consoleRef} className="relative flex min-h-0 min-w-0 flex-col">
            <MessageList
              messages={demo.messages}
              onChip={demo.pressChip}
              onPickCompany={demo.pickCompany}
              onApprove={demo.approve}
            />
            <AskComposer
              value={demo.input}
              sendPressed={demo.sendPressed}
              onChange={demo.setInput}
              onFocus={demo.takeOver}
              onAsk={demo.ask}
            />
            <DemoCursor cursor={demo.cursor} />
          </div>
        </ConsoleFrame>
      </CitationProvider>
    </div>
  );
}
