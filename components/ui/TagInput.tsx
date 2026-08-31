import { useState, type KeyboardEvent } from "react";

/**
 * Freeform tags: type something, press Enter or comma to turn it into a
 * chip. Backspace on an empty field pops the last chip, same as most tag
 * inputs people already know.
 */
export function TagInput({
  value,
  onChange,
  placeholder,
  autoFocus,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
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
    <div className="w-full rounded-sm border border-line bg-surface px-3 py-2.5 focus-within:border-signal-teal">
      <div className="flex flex-wrap items-center gap-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="utility-label inline-flex items-center gap-2 rounded-full border border-signal-teal/40 bg-signal-teal/10 px-2.5 py-1 text-signal-teal"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={`Remove ${tag}`}
              className="text-signal-teal hover:text-signal-teal-hover"
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={draft}
          autoFocus={autoFocus}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commitDraft}
          placeholder={value.length === 0 ? placeholder : undefined}
          className="min-w-[8rem] flex-1 bg-transparent px-1 py-1 font-sans text-base text-ink placeholder:text-ink-muted/50 focus:outline-none"
        />
      </div>
    </div>
  );
}
