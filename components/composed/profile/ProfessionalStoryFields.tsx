import { Field } from "@/components/ui/Field";
import { TagInput } from "@/components/ui/TagInput";
import { Textarea } from "@/components/ui/Textarea";
import type { FormState, UpdateField } from "./profile-form-state";

export function ProfessionalStoryFields({
  form,
  update,
}: {
  form: FormState;
  update: UpdateField;
}) {
  return (
    <div className="space-y-6">
      <Field
        label="Summary"
        hint="A concise introduction helps personalize your research and outreach."
        htmlFor="profile-summary"
      >
        <Textarea
          id="profile-summary"
          rows={6}
          value={form.summary}
          onChange={(event) => update("summary", event.target.value)}
          placeholder="A couple of lines on what you do."
        />
      </Field>
      <Field label="Skills" hint="Use specific tools, methods, and areas of expertise.">
        <TagInput
          value={form.skills}
          onChange={(skills) => update("skills", skills)}
          placeholder="Python, PostgreSQL, ..."
        />
      </Field>
    </div>
  );
}
