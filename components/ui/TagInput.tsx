import { useState, type KeyboardEvent } from "react";

import { CloseIcon } from "./Icons";
import { CONTROL_WRAPPER_CLASSES } from "./control-styles";

/**
 * Freeform tags: type something, press Enter or comma to turn it into a
 * chip. Backspace on an empty field pops the last chip, same as most tag
 * inputs people already know.
 */
export function TagInput({
  value,
  onChange,
  placeholder,
  addLabel,
  autoFocus,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  addLabel?: string;
  autoFocus?: boolean;
}) {
  const [draft, setDraft] = useState("");

  function commitDraft() {
    const tag = draft.trim();
    setDraft("");
    if (!tag || value.includes(tag)) return;
    onChange([...value, tag]);
  }

  function removeTag(tag: string) {
    onChange(value.filter((existing) => existing !== tag));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commitDraft();
      return;
    }
    if (event.key === "Backspace" && draft === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div className={CONTROL_WRAPPER_CLASSES}>
      <div className="flex flex-wrap items-center gap-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex h-7 items-center gap-1 rounded-sm bg-ink/10 pl-2.5 pr-1 text-xs font-sans-semibold text-ink"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={`Remove ${tag}`}
              className="grid h-5 w-5 place-items-center rounded-full text-ink-muted transition-colors duration-fast hover:bg-ink/10 hover:text-ink"
            >
              <CloseIcon />
            </button>
          </span>
        ))}
        <div className="flex min-w-48 flex-1 items-center gap-2">
          <input
            value={draft}
            autoFocus={autoFocus}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={commitDraft}
            placeholder={value.length === 0 ? placeholder : undefined}
            className="min-w-32 flex-1 bg-transparent px-1 py-1 placeholder:text-ink-faint focus:outline-none"
          />
          {addLabel ? (
            <button
              type="button"
              disabled={!draft.trim()}
              onPointerDown={(event) => event.preventDefault()}
              onClick={commitDraft}
              className="shrink-0 rounded-full px-2 py-1 text-sm font-sans-semibold text-signal-teal transition-colors duration-fast hover:bg-ink/5 hover:text-signal-teal-hover disabled:pointer-events-none disabled:text-ink-faint"
            >
              + {addLabel}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
