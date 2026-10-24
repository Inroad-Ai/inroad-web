"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

import { answerFor } from "@/lib/landing/ask-answers";
import type { DemoAnswer } from "@/lib/landing/ask-types";
import { useLandingMotion } from "@/lib/landing-motion";

import type { AiMessage, ConsoleMessage, CursorState, RowState } from "./console.types";
import { draftTokens } from "./draft-tokens";

const DEMO_QUESTION = "Find Series B fintechs in Berlin where my ledger work matters";
const CANCELLED = Symbol("cancelled");
const HIDDEN_CURSOR: CursorState = { x: 0, y: 0, visible: false, instant: true };
const CURSOR_START_INSET = { x: 60, y: 40 };

interface Run {
  cancelled: boolean;
}

const jitter = (base: number, spread: number) => base + Math.random() * spread;

/** Drives the hero console: a scripted demo that loops while it is on screen,
 * and canned answers for anything a visitor types. Every step awaits `wait`,
 * which rejects once a newer run starts, so one run never writes over another. */
export function useAskDemo(rootRef: RefObject<HTMLElement>, consoleRef: RefObject<HTMLElement>) {
  const reduceMotion = useLandingMotion();
  const [messages, setMessages] = useState<ConsoleMessage[]>([]);
  const [input, setInput] = useState("");
  const [cursor, setCursor] = useState<CursorState>(HIDDEN_CURSOR);
  const [sendPressed, setSendPressed] = useState(false);

  const reducedRef = useRef(reduceMotion);
  reducedRef.current = reduceMotion;
  const runRef = useRef<Run | null>(null);
  const modeRef = useRef<"demo" | "user">("demo");
  const runningRef = useRef(false);
  const visibleRef = useRef(false);
  const nextIdRef = useRef(0);
  const runDemoRef = useRef<() => void>(() => undefined);

  const wait = useCallback(
    (ms: number, run: Run) =>
      new Promise<void>((resolve, reject) => {
        window.setTimeout(
          () => (run.cancelled ? reject(CANCELLED) : resolve()),
          reducedRef.current ? 0 : ms,
        );
      }),
    [],
  );

  const startRun = useCallback((): Run => {
    if (runRef.current) runRef.current.cancelled = true;
    const run = { cancelled: false };
    runRef.current = run;
    runningRef.current = false;
    setCursor(HIDDEN_CURSOR);
    return run;
  }, []);

  const patchAi = useCallback((id: number, change: (m: AiMessage) => Partial<AiMessage>) => {
    setMessages((all) =>
      all.map((m) => (m.id === id && m.role === "ai" ? { ...m, ...change(m) } : m)),
    );
  }, []);

  const setRow = useCallback(
    (id: number, index: number, state: RowState) =>
      patchAi(id, (m) => ({ rows: m.rows.map((r, i) => (i === index ? state : r)) })),
    [patchAi],
  );

  const runAnswer = useCallback(
    async (question: string, run: Run, opts: { bubble: boolean; fast: boolean }) => {
      const answer: DemoAnswer = answerFor(question);
      const id = ++nextIdRef.current;
      const ai: AiMessage = {
        id,
        role: "ai",
        answer,
        phase: "thinking",
        rows: answer.rows.map(() => "pending"),
        typedTokens: 0,
        sent: false,
        activeChip: null,
        pickedCompany: null,
      };
      setMessages((all) =>
        opts.bubble
          ? [...all, { id: ++nextIdRef.current, role: "user", text: question }, ai]
          : [...all, ai],
      );
      const pace = opts.fast ? 0.55 : 1;
      await wait(1000 * pace, run);
      if (answer.rows.length) {
        patchAi(id, () => ({ phase: "scanning" }));
        for (let i = 0; i < answer.rows.length; i++) {
          await wait(450 * pace, run);
          setRow(id, i, "sync");
          if (i > 0) setRow(id, i - 1, "live");
        }
        await wait(500 * pace, run);
        setRow(id, answer.rows.length - 1, "live");
        await wait(300 * pace, run);
      }
      patchAi(id, () => ({ phase: "answered" }));
      if (answer.draft) {
        const total = draftTokens(answer.draft.body).length;
        if (!reducedRef.current)
          for (let n = 1; n < total; n += 2) {
            patchAi(id, () => ({ typedTokens: n }));
            await wait(opts.fast ? 10 : jitter(26, 30), run);
          }
        patchAi(id, () => ({ typedTokens: total }));
      }
      return { id, answer };
    },
    [patchAi, setRow, wait],
  );

  const moveCursorTo = useCallback(
    async (selector: string, run: Run) => {
      const box = consoleRef.current;
      const target = box?.querySelector(selector);
      if (reducedRef.current || !box || !target) return;
      const outer = box.getBoundingClientRect();
      const rect = target.getBoundingClientRect();
      setCursor({
        x: outer.width - CURSOR_START_INSET.x,
        y: outer.height - CURSOR_START_INSET.y,
        visible: true,
        instant: true,
      });
      await wait(40, run);
      setCursor({
        x: rect.left - outer.left + Math.min(rect.width * 0.6, 40),
        y: rect.top - outer.top + rect.height * 0.55,
        visible: true,
        instant: false,
      });
      await wait(850, run);
    },
    [consoleRef, wait],
  );

  const runDemo = useCallback(async () => {
    const run = startRun();
    modeRef.current = "demo";
    runningRef.current = true;
    try {
      setMessages([]);
      setInput("");
      await wait(900, run);
      if (reducedRef.current) setInput(DEMO_QUESTION);
      else
        for (let i = 1; i <= DEMO_QUESTION.length; i++) {
          setInput(DEMO_QUESTION.slice(0, i));
          await wait(jitter(22, 34), run);
        }
      await wait(380, run);
      setSendPressed(true);
      await wait(140, run);
      setSendPressed(false);
      setInput("");

      const list = await runAnswer(DEMO_QUESTION, run, { bubble: true, fast: false });
      await wait(1500, run);
      const chipIndex = list.answer.chips.findIndex((c) => c.isDraft);
      await moveCursorTo(`[data-demo-target="chip-${list.id}-${chipIndex}"]`, run);
      patchAi(list.id, () => ({ activeChip: chipIndex }));
      await wait(220, run);

      const draft = await runAnswer(list.answer.chips[chipIndex].question, run, {
        bubble: false,
        fast: false,
      });
      await wait(900, run);
      await moveCursorTo(`[data-demo-target="approve-${draft.id}"]`, run);
      patchAi(draft.id, () => ({ sent: true }));
      await wait(500, run);
      setCursor(HIDDEN_CURSOR);
      if (reducedRef.current) {
        runningRef.current = false;
        return;
      }
      await wait(4200, run);
      runningRef.current = false;
      if (visibleRef.current) runDemoRef.current();
    } catch (error) {
      if (error !== CANCELLED) throw error;
    }
  }, [moveCursorTo, patchAi, runAnswer, startRun, wait]);
  runDemoRef.current = runDemo;

  const ask = useCallback(
    (question: string) => {
      const q = question.trim();
      if (!q) return;
      const run = startRun();
      modeRef.current = "user";
      setInput("");
      runAnswer(q, run, { bubble: true, fast: true }).catch((error: unknown) => {
        if (error !== CANCELLED) throw error;
      });
    },
    [runAnswer, startRun],
  );

  const takeOver = useCallback(() => {
    if (modeRef.current !== "demo") return;
    startRun();
    modeRef.current = "user";
    setInput("");
  }, [startRun]);

  const pressChip = useCallback(
    (message: AiMessage, index: number) => {
      patchAi(message.id, () => ({ activeChip: index }));
      ask(message.answer.chips[index].question);
    },
    [ask, patchAi],
  );

  const pickCompany = useCallback(
    (message: AiMessage, companyId: string, name: string) => {
      patchAi(message.id, () => ({ pickedCompany: companyId }));
      ask(`Why does ${name} fit me?`);
    },
    [ask, patchAi],
  );

  const approve = useCallback((id: number) => patchAi(id, () => ({ sent: true })), [patchAi]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry?.isIntersecting ?? false;
      if (visibleRef.current && modeRef.current === "demo" && !runningRef.current)
        runDemoRef.current();
    });
    observer.observe(root);
    return () => {
      observer.disconnect();
      if (runRef.current) runRef.current.cancelled = true;
    };
  }, [rootRef]);

  return {
    messages,
    input,
    setInput,
    cursor,
    sendPressed,
    ask,
    takeOver,
    pressChip,
    pickCompany,
    approve,
    replay: runDemo,
  };
}
