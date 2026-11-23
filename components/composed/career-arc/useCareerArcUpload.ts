"use client";

import { useEffect, useRef, useState } from "react";

import {
  ApiError,
  fetchCareerArcParseRun,
  parseCareerArc,
  type CareerArcDocument,
  type CareerArcWarning,
} from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import { validateCareerArcFile } from "@/lib/career-arc";

const POLL_MS = 2000;
const MAX_POLL_FAILURES = 3;
// Lets a refresh or a visit to another page pick a long read back up.
const RUN_KEY = "inroad-career-arc-run";

export type UploadPhase = "idle" | "uploading" | "reading" | "done" | "error";

interface Progress {
  stage: string | null;
  done: number;
  total: number;
}

interface View {
  phase: UploadPhase;
  fileName: string | null;
  fileSize: number | null;
  error: string | null;
  errorCode: string | null;
  progress: Progress;
}

const NO_PROGRESS: Progress = { stage: null, done: 0, total: 0 };
const IDLE: View = {
  phase: "idle",
  fileName: null,
  fileSize: null,
  error: null,
  errorCode: null,
  progress: NO_PROGRESS,
};

interface ParsedArc {
  document: CareerArcDocument;
  warnings: CareerArcWarning[];
}

interface StoredRun {
  runId: string;
  fileName: string | null;
  fileSize: number | null;
}

function readStoredRun(): StoredRun | null {
  try {
    const raw = sessionStorage.getItem(RUN_KEY);
    return raw ? (JSON.parse(raw) as StoredRun) : null;
  } catch {
    return null;
  }
}

function writeStoredRun(run: StoredRun | null): void {
  try {
    if (run) sessionStorage.setItem(RUN_KEY, JSON.stringify(run));
    else sessionStorage.removeItem(RUN_KEY);
  } catch {
    // Storage blocked: a refresh just loses the read in flight.
  }
}

function wait(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      resolve();
    });
  });
}

/** Uploads a career arc file, then follows the background read until it is
 * done. Hands the result to `onParsed` and keeps only the upload's own
 * progress, so the screen using it decides where the roles live. */
export function useCareerArcUpload(onParsed: (parsed: ParsedArc) => void) {
  const [view, setView] = useState<View>(IDLE);
  const controller = useRef<AbortController | null>(null);
  const onParsedRef = useRef(onParsed);
  onParsedRef.current = onParsed;

  function fail(base: Partial<View>, error: string, errorCode: string | null = null) {
    writeStoredRun(null);
    setView({ ...IDLE, ...base, phase: "error", error, errorCode });
  }

  async function follow(run: StoredRun, current: AbortController) {
    const base = { fileName: run.fileName, fileSize: run.fileSize };
    setView({ ...IDLE, ...base, phase: "reading" });
    let failures = 0;

    while (!current.signal.aborted) {
      try {
        const token = await ensureValidAccessToken();
        if (!token)
          return fail(base, "Your session expired. Sign in again to upload your career arc.");
        const state = await fetchCareerArcParseRun(run.runId, token, current.signal);
        if (current.signal.aborted) return;
        failures = 0;

        if (state.status === "completed" && state.result) {
          writeStoredRun(null);
          setView({ ...IDLE, ...base, phase: "done" });
          onParsedRef.current({
            document: state.result.document,
            warnings: state.result.warnings ?? [],
          });
          return;
        }
        if (state.status === "failed") {
          return fail(base, state.error ?? "Reading the file failed.", state.error_code ?? null);
        }
        setView((previous) => ({
          ...previous,
          progress: { stage: state.stage ?? null, done: state.done, total: state.total },
        }));
      } catch (error) {
        if (current.signal.aborted) return;
        failures += 1;
        if (failures >= MAX_POLL_FAILURES) {
          return fail(
            base,
            error instanceof Error ? error.message : "Lost contact while reading the file.",
            error instanceof ApiError ? error.code : null,
          );
        }
      }
      await wait(POLL_MS, current.signal);
    }
  }

  function begin(run: StoredRun) {
    controller.current?.abort();
    const current = new AbortController();
    controller.current = current;
    writeStoredRun(run);
    void follow(run, current);
  }

  async function select(file: File) {
    const base = { fileName: file.name, fileSize: file.size };
    const invalid = validateCareerArcFile(file);
    if (invalid) return fail(base, invalid);

    controller.current?.abort();
    const current = new AbortController();
    controller.current = current;
    setView({ ...IDLE, ...base, phase: "uploading" });

    try {
      const token = await ensureValidAccessToken();
      if (!token)
        return fail(base, "Your session expired. Sign in again to upload your career arc.");
      const runId = await parseCareerArc(file, token, current.signal);
      if (current.signal.aborted) return;
      begin({ runId, ...base });
    } catch (error) {
      if (current.signal.aborted) return;
      fail(
        base,
        error instanceof Error ? error.message : "Upload failed. Try again.",
        error instanceof ApiError ? error.code : null,
      );
    }
  }

  function reset() {
    controller.current?.abort();
    controller.current = null;
    writeStoredRun(null);
    setView(IDLE);
  }

  useEffect(() => {
    const stored = readStoredRun();
    if (stored) begin(stored);
    return () => controller.current?.abort();
    // Once, on mount: picks up a read this page started before a refresh.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ...view, select, reset };
}
