import type { SelectHTMLAttributes } from "react";

import { ChevronDownIcon } from "./Icons";
import { CONTROL_CLASSES } from "./control-styles";

/** Native select with the platform arrow replaced, so it matches the other
 * controls. `className` lands on the wrapper, which is what gets sized. */
export function Select({ className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={`relative inline-flex ${className}`}>
      <select
        className={`${CONTROL_CLASSES} cursor-pointer appearance-none pr-10 [&>option]:bg-surface [&>option]:text-ink`}
        {...props}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-ink-muted"
      >
        <ChevronDownIcon open={false} />
      </span>
    </div>
  );
}
