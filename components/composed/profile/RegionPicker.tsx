"use client";

import { SelectableCard } from "@/components/ui/SelectableCard";
import { REGION_OPTIONS, type RegionOption } from "@/lib/onboarding";

/** Click-only relocation regions, shown once "Open to relocation" is picked. */
export function RegionPicker({
  selected,
  onChange,
}: {
  selected: RegionOption[];
  onChange: (next: RegionOption[]) => void;
}) {
  function toggle(region: RegionOption) {
    onChange(
      selected.includes(region)
        ? selected.filter((value) => value !== region)
        : [...selected, region],
    );
  }

  return (
    <div role="group" aria-labelledby="relocation-regions-label">
      <span id="relocation-regions-label" className="text-sm font-sans-semibold text-ink">
        Where would you move?
      </span>
      <p className="mt-1 text-sm text-ink-muted">
        Pick any that apply. Leave them all off to consider anywhere.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-3">
        {REGION_OPTIONS.map((option) => (
          <SelectableCard
            key={option.value}
            compact
            selected={selected.includes(option.value)}
            onClick={() => toggle(option.value)}
          >
            {selected.includes(option.value) ? "✓ " : ""}
            {option.label}
          </SelectableCard>
        ))}
      </div>
    </div>
  );
}
