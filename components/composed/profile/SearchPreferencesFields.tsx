import { Field } from "@/components/ui/Field";
import { SelectableCard } from "@/components/ui/SelectableCard";
import { TagInput } from "@/components/ui/TagInput";
import { WORK_PREFERENCE_OPTIONS, type WorkPreferenceOption } from "@/lib/onboarding";
import type { FormState, UpdateField, ValidationErrors } from "./profile-form-state";
import { RegionPicker } from "./RegionPicker";

export function SearchPreferencesFields({
  form,
  errors,
  update,
  onToggleWorkPreference,
}: {
  form: FormState;
  errors: ValidationErrors;
  update: UpdateField;
  onToggleWorkPreference: (option: WorkPreferenceOption) => void;
}) {
  return (
    <div className="space-y-6">
      <Field
        label="Target roles"
        hint="Add the roles you would genuinely consider next."
        error={errors.targetRoles}
      >
        <TagInput
          value={form.targetRoles}
          onChange={(targetRoles) => update("targetRoles", targetRoles)}
          placeholder="Founding engineer, backend engineer, ..."
        />
      </Field>
      <div role="group" aria-labelledby="profile-work-preference-label">
        <span id="profile-work-preference-label" className="text-sm font-sans-semibold text-ink">
          Work preference
        </span>
        <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {WORK_PREFERENCE_OPTIONS.map((option) => (
            <SelectableCard
              key={option.value}
              compact
              selected={form.workPreference.includes(option.value)}
              onClick={() => onToggleWorkPreference(option.value)}
            >
              {form.workPreference.includes(option.value) ? "✓ " : ""}
              {option.label}
            </SelectableCard>
          ))}
        </div>
        {errors.workPreference ? (
          <p className="mt-2 text-xs font-sans-semibold text-error" aria-live="polite">
            {errors.workPreference}
          </p>
        ) : null}
      </div>
      {form.workPreference.includes("relocation") ? (
        <RegionPicker selected={form.regions} onChange={(regions) => update("regions", regions)} />
      ) : null}
    </div>
  );
}
