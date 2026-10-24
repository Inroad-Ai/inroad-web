import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { ContactLocationEditor } from "./ContactLocationEditor";
import type { FormState, UpdateField, ValidationErrors } from "./profile-form-state";

export function PersonalDetailsFields({
  form,
  errors,
  update,
}: {
  form: FormState;
  errors: ValidationErrors;
  update: UpdateField;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="First name"
          htmlFor="profile-first-name"
          error={errors.firstName}
          errorId="profile-first-name-error"
        >
          <Input
            id="profile-first-name"
            aria-invalid={errors.firstName ? true : undefined}
            aria-describedby={errors.firstName ? "profile-first-name-error" : undefined}
            value={form.firstName}
            onChange={(event) => update("firstName", event.target.value)}
          />
        </Field>
        <Field
          label="Last name"
          htmlFor="profile-last-name"
          error={errors.lastName}
          errorId="profile-last-name-error"
        >
          <Input
            id="profile-last-name"
            aria-invalid={errors.lastName ? true : undefined}
            aria-describedby={errors.lastName ? "profile-last-name-error" : undefined}
            value={form.lastName}
            onChange={(event) => update("lastName", event.target.value)}
          />
        </Field>
      </div>
      <Field
        label="Email"
        hint="Use the same contact email you confirmed in onboarding."
        htmlFor="profile-email"
        error={errors.email}
        errorId="profile-email-error"
      >
        <Input
          id="profile-email"
          type="email"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "profile-email-error" : undefined}
          value={form.email}
          onChange={(event) => update("email", event.target.value)}
          placeholder="you@example.com"
        />
      </Field>
      <ContactLocationEditor
        location={form.location}
        phone={form.phone}
        locationError={errors.location}
        phoneError={errors.phone}
        onLocationChange={(location) => update("location", location)}
        onPhoneChange={(phone) => update("phone", phone)}
      />
    </div>
  );
}
