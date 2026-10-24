// Shared by every text-entry control so Input, Textarea, Select and TagInput
// cannot drift apart. TagInput styles a wrapper, hence the focus-within set.
const CONTROL_SURFACE =
  "w-full rounded-nest border border-ink/15 bg-ink/5 font-sans text-base font-sans-medium text-ink transition duration-fast ease-standard placeholder:text-ink-faint";

const INVALID =
  "aria-[invalid=true]:border-muted-rose aria-[invalid=true]:ring-4 aria-[invalid=true]:ring-muted-rose/15";

export const CONTROL_CLASSES = `${CONTROL_SURFACE} px-4 py-3 focus:border-signal-amber focus:bg-ink/10 focus:outline-none focus:ring-4 focus:ring-signal-amber/15 disabled:cursor-not-allowed disabled:opacity-50 ${INVALID}`;

export const CONTROL_WRAPPER_CLASSES = `${CONTROL_SURFACE} px-3 py-2 focus-within:border-signal-amber focus-within:bg-ink/10 focus-within:ring-4 focus-within:ring-signal-amber/15`;
