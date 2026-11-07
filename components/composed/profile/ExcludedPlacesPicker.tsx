"use client";

import { allCountries } from "country-region-data";

import { SelectableCard } from "@/components/ui/SelectableCard";
import { Select } from "@/components/ui/Select";
import { EXCLUDED_REGION_OPTIONS } from "@/lib/profile";

const countries = [...allCountries]
  .map(([name, code]) => ({ name, code }))
  .sort((left, right) => left.name.localeCompare(right.name));
const countryNames = new Map<string, string>(countries.map(({ name, code }) => [code, name]));

/** Countries and regions whose roles are never shown. Regions are click-only;
 * countries are added from a list and removed by clicking them. */
export function ExcludedPlacesPicker({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const chosenCountries = selected.filter((place) => countryNames.has(place));

  function toggle(place: string) {
    onChange(
      selected.includes(place) ? selected.filter((value) => value !== place) : [...selected, place],
    );
  }

  return (
    <div role="group" aria-labelledby="excluded-places-label">
      <span id="excluded-places-label" className="text-sm font-sans-semibold text-ink">
        Places to leave out
      </span>
      <p className="mt-1 text-sm text-ink-muted">
        Roles there are never shown: onsite, relocation, or remote only there.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-3">
        {EXCLUDED_REGION_OPTIONS.map((option) => (
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
        {chosenCountries.map((code) => (
          <SelectableCard key={code} compact selected onClick={() => toggle(code)}>
            ✓ {countryNames.get(code)}
          </SelectableCard>
        ))}
      </div>
      <Select
        className="mt-3 w-full sm:w-72"
        aria-label="Add a country to leave out"
        value=""
        onChange={(event) => {
          if (event.target.value) toggle(event.target.value);
        }}
      >
        <option value="">Add a country</option>
        {countries
          .filter(({ code }) => !selected.includes(code))
          .map(({ name, code }) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
      </Select>
    </div>
  );
}
