import type { InputHTMLAttributes } from "react";

import { ExternalLinkIcon } from "./Icons";
import { Input } from "./Input";

function isOpenable(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * URL field with a button that opens the current value in a new tab.
 * `className` lands on the wrapper, not the input, so the button can be
 * positioned against it.
 */
export function UrlInput({
  className = "",
  value,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  const openable = typeof value === "string" && isOpenable(value);

  return (
    <div className={`relative ${className}`}>
      <Input type="url" className="pr-12" value={value} {...props} />
      <button
        type="button"
        onClick={() => window.open(value as string, "_blank", "noopener,noreferrer")}
        disabled={!openable}
        tabIndex={-1}
        aria-label="Open link in new tab"
        className="absolute inset-y-0 right-0 flex items-center px-4 text-text-secondary transition-colors hover:text-ink focus-visible:text-ink focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40"
      >
        <ExternalLinkIcon />
      </button>
    </div>
  );
}
