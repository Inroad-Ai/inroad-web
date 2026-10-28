// Resume first, so every screen after it can be answered by correcting a
// parsed value instead of typing from nothing.
export const STEP_IDS = [
  "welcome",
  "resume",
  "name",
  "email",
  "contact",
  "links",
  "workPreference",
  "targetRole",
  "summary",
] as const;

export type StepId = (typeof STEP_IDS)[number];

// Run on their own page after the profile is saved, so an OAuth round trip
// can land back on them (see connect-steps.ts).
export const CONNECT_STEP_IDS = ["gmail", "aiKey", "contactData"] as const;

export type ConnectStepId = (typeof CONNECT_STEP_IDS)[number];

export const TOTAL_STEPS = STEP_IDS.length + CONNECT_STEP_IDS.length;

// The sections in the order they actually happen: resume before contact, as above.
export const PHASES = ["Resume", "Contact", "Preferences", "Review", "Connect"] as const;

export const CONNECT_PHASE_INDEX = PHASES.indexOf("Connect");

// -1 is welcome: an intro screen, not part of any section.
export const STEP_PHASE_INDEX: Record<StepId, number> = {
  welcome: -1,
  resume: 0,
  name: 1,
  email: 1,
  contact: 1,
  links: 1,
  workPreference: 2,
  targetRole: 2,
  summary: 3,
};

/** How full each phase's segment is at a step: done phases 1, the current one by steps reached. */
export function phaseFill(stepIndex: number): number[] {
  const current = STEP_PHASE_INDEX[STEP_IDS[stepIndex]];
  return PHASES.map((_, phase) => {
    if (phase < current) return 1;
    if (phase > current) return 0;
    const inPhase = STEP_IDS.filter((id) => STEP_PHASE_INDEX[id] === phase);
    const reached = STEP_IDS.slice(0, stepIndex + 1).filter((id) => STEP_PHASE_INDEX[id] === phase);
    return reached.length / inPhase.length;
  });
}

/** Every profile phase done, Connect filled by connect steps reached. */
export function connectPhaseFill(connectIndex: number): number[] {
  return PHASES.map((_, phase) =>
    phase < CONNECT_PHASE_INDEX ? 1 : (connectIndex + 1) / CONNECT_STEP_IDS.length,
  );
}

/** Steps where the "profile so far" card sits beside the form; welcome and review don't need it. */
export const showsProfileCard = (step: StepId): boolean => step !== "welcome" && step !== "summary";
