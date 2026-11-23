import type { FormState } from "./profile-form-state";

function line(parts: (string | null | undefined)[]): string {
  return parts.filter(Boolean).join(" · ");
}

/** What a recruiter would see: the profile as plain text, with nothing to edit. */
export function summaryText(form: FormState): string {
  const name = `${form.firstName} ${form.lastName}`.trim();
  const lines = [name, line([form.targetRoles.join(", "), form.location]), "", form.summary];
  if (form.skills.length > 0) lines.push("", `Skills: ${form.skills.join(", ")}`);
  for (const job of form.workHistory) {
    lines.push("", line([job.title, job.company]));
  }
  return lines.join("\n").trim();
}

export function RecruiterView({ form }: { form: FormState }) {
  const name = `${form.firstName} ${form.lastName}`.trim();

  return (
    <div style={{ maxWidth: 720 }}>
      <div className="note teal" style={{ marginBottom: 24 }}>
        You are seeing your profile the way a recruiter would. Nothing here can be edited.
      </div>
      <h2 style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-.03em" }}>{name}</h2>
      <div className="muted" style={{ marginTop: 4 }}>
        {line([form.targetRoles.join(", "), form.location])}
      </div>
      {form.summary ? (
        <p style={{ marginTop: 18, fontSize: 15.5, lineHeight: 1.75 }}>{form.summary}</p>
      ) : (
        <p className="faint" style={{ marginTop: 18 }}>
          No summary yet. A couple of lines here is the first thing a recruiter reads.
        </p>
      )}
      {form.skills.length > 0 ? (
        <div className="row wrap" style={{ gap: 8, marginTop: 18 }}>
          {form.skills.map((skill) => (
            <span key={skill} className="tag">
              {skill}
            </span>
          ))}
        </div>
      ) : null}
      {form.workHistory.length > 0 ? (
        <div style={{ marginTop: 24 }}>
          <div className="b" style={{ marginBottom: 8 }}>
            Experience
          </div>
          <div className="list">
            {form.workHistory.map((job, index) => (
              <div key={`${job.company}-${index}`}>
                <div style={{ flex: 1 }}>
                  <div className="m">{job.title}</div>
                  <div className="xs faint">{job.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
