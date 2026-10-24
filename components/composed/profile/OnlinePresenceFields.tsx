import { Field } from "@/components/ui/Field";
import { UrlInput } from "@/components/ui/UrlInput";
import type { FormState, UpdateField, ValidationErrors } from "./profile-form-state";

type LinkField = "linkedinUrl" | "githubUrl" | "portfolioUrl" | "xUrl";

const LINKS: readonly { field: LinkField; id: string; label: string; placeholder: string }[] = [
  {
    field: "linkedinUrl",
    id: "profile-linkedin",
    label: "LinkedIn",
    placeholder: "https://linkedin.com/in/you",
  },
  {
    field: "githubUrl",
    id: "profile-github",
    label: "GitHub",
    placeholder: "https://github.com/you",
  },
  {
    field: "portfolioUrl",
    id: "profile-portfolio",
    label: "Portfolio or site",
    placeholder: "https://yoursite.com",
  },
  { field: "xUrl", id: "profile-x", label: "X profile", placeholder: "https://x.com/you" },
];

export function OnlinePresenceFields({
  form,
  errors,
  update,
}: {
  form: FormState;
  errors: ValidationErrors;
  update: UpdateField;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {LINKS.map(({ field, id, label, placeholder }) => {
        const errorId = `${id}-error`;
        return (
          <Field key={field} label={label} htmlFor={id} error={errors[field]} errorId={errorId}>
            <UrlInput
              id={id}
              aria-invalid={errors[field] ? true : undefined}
              aria-describedby={errors[field] ? errorId : undefined}
              value={form[field]}
              onChange={(event) => update(field, event.target.value)}
              placeholder={placeholder}
            />
          </Field>
        );
      })}
    </div>
  );
}
