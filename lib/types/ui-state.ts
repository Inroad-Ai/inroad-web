/** Frontend-only state types. Unlike the rest of lib/types/, these mirror
 * nothing on the backend. */

/**
 * What a single source card is doing right now. These are internal state
 * names — none of them appear on screen as written.
 */
export type CardState = "idle" | "pending" | "done" | "failed";

/** A research source's progress: a CardState, or "not_collected" when there
 * was nothing to read or collection is off (not a failure). */
export type SourceState = CardState | "not_collected";

/** Onboarding fields the summary screen can badge as "from your resume" vs
 * "you typed this" - only the fields that show up as their own editable row
 * there, not summary/skills/workHistory/education/projects. Internal state
 * only, mirrors nothing on the backend. */
export type FieldSourceKey =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "location"
  | "linkedinUrl"
  | "githubUrl"
  | "portfolioUrl";

export type FieldSource = "resume" | "manual";

export type FieldSourceMap = Partial<Record<FieldSourceKey, FieldSource>>;
