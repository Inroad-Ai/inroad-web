"use client";

import { useState, type ReactNode } from "react";

import { Views } from "@/components/composed/dashboard/v2/kit";
import type { CareerArcDocument } from "@/lib/api-client/client";
import { describeSize, hasContent } from "@/lib/career-arc";
import { REGION_OPTIONS } from "@/lib/onboarding";
import { EXCLUDED_REGION_OPTIONS } from "@/lib/profile";

import type { FormState } from "./profile-form-state";

export type EditTarget = "story" | "projects" | "search" | "documents";

type Lens = "glance" | "matching" | "outreach";

const SHOWN_SKILLS = 12;

interface Gap {
  text: string;
  target: EditTarget;
}

function filled(value: string | null | undefined): boolean {
  return Boolean(value?.trim());
}

function join(parts: (string | null | undefined)[], separator = " · "): string {
  return parts.filter((part) => filled(part)).join(separator);
}

function dates(start?: string | null, end?: string | null): string {
  return join([start, end], " to ");
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).replaceAll("_", " ");
}

/** Only what is actually empty, each with the tab where it gets filled in. */
function gapsFor(lens: Lens, form: FormState, hasArc: boolean): Gap[] {
  const checks: [boolean, Gap, Lens[]][] = [
    [
      form.targetRoles.length === 0,
      { text: "No target roles yet.", target: "search" },
      ["glance", "matching", "outreach"],
    ],
    [
      !filled(form.summary),
      { text: "No summary yet.", target: "story" },
      ["glance", "matching", "outreach"],
    ],
    [
      form.skills.length === 0,
      { text: "No skills yet.", target: "story" },
      ["glance", "matching", "outreach"],
    ],
    [
      !filled(form.location),
      { text: "No location yet.", target: "story" },
      ["glance", "matching", "outreach"],
    ],
    [
      form.workPreference.length === 0,
      { text: "No work preference yet.", target: "search" },
      ["matching", "outreach"],
    ],
    [
      form.workHistory.length === 0,
      { text: "No work experience yet.", target: "story" },
      ["glance", "matching", "outreach"],
    ],
    [
      form.projects.length === 0,
      { text: "No projects yet.", target: "projects" },
      ["glance", "matching", "outreach"],
    ],
    [form.education.length === 0, { text: "No education yet.", target: "story" }, ["glance"]],
    [!hasArc, { text: "No career arc yet.", target: "documents" }, ["outreach"]],
  ];
  return checks.filter(([missing, , lenses]) => missing && lenses.includes(lens)).map(([, g]) => g);
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginTop: 26 }}>
      <h3 className="b" style={{ marginBottom: 8 }}>
        {title}
      </h3>
      {children}
    </section>
  );
}

function Chips({ values, empty }: { values: string[]; empty: string }) {
  if (values.length === 0) return <p className="sm faint">{empty}</p>;
  return (
    <div className="row wrap" style={{ gap: 8 }}>
      {values.map((value) => (
        <span key={value} className="tag">
          {value}
        </span>
      ))}
    </div>
  );
}

function Entries({
  items,
  empty,
}: {
  items: { title: string; meta?: string; text?: string | null }[];
  empty: string;
}) {
  if (items.length === 0) return <p className="sm faint">{empty}</p>;
  return (
    <div className="list">
      {items.map((item, index) => (
        <div key={`${item.title}-${index}`}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="m">{item.title}</div>
            {item.meta ? <div className="xs faint">{item.meta}</div> : null}
            {filled(item.text) ? (
              <div className="sm muted" style={{ marginTop: 4, whiteSpace: "pre-line" }}>
                {item.text}
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function experienceOf(form: FormState) {
  return form.workHistory.map((job) => ({
    title: join([job.title, job.company], " at ") || "Untitled role",
    meta: dates(job.start_date, job.end_date),
    text: job.description,
  }));
}

function projectsOf(form: FormState) {
  return form.projects.map((project) => ({
    title: project.name || "Untitled project",
    meta: join([project.company, project.url]),
    text: project.description,
  }));
}

function educationOf(form: FormState) {
  return form.education.map((entry) => ({
    title: join([entry.degree, entry.field], ", ") || entry.institution || "Education",
    meta: join([entry.institution, dates(entry.start_date, entry.end_date)]),
  }));
}

function AtAGlance({ form }: { form: FormState }) {
  // With no work history yet, projects and education say the most, so they lead.
  const early = form.workHistory.length === 0;
  const languages = form.languages.map((entry) =>
    join([entry.language, entry.proficiency ? capitalize(entry.proficiency) : null], ", "),
  );

  const experience = (
    <Block title={early ? "Experience" : "Latest role"}>
      <Entries items={experienceOf(form).slice(0, 1)} empty="Nothing here yet." />
    </Block>
  );
  const projects = (
    <Block title="Projects">
      <Entries items={projectsOf(form).slice(0, 3)} empty="Nothing here yet." />
    </Block>
  );
  const education = (
    <Block title="Education">
      <Entries items={educationOf(form)} empty="Nothing here yet." />
    </Block>
  );

  return (
    <>
      <p style={{ marginTop: 20, fontSize: 15.5, lineHeight: 1.75 }}>
        {filled(form.summary) ? form.summary : <span className="faint">No summary yet.</span>}
      </p>
      <Block title="Top skills">
        <Chips values={form.skills.slice(0, SHOWN_SKILLS)} empty="Nothing here yet." />
      </Block>
      {early ? (
        <>
          {projects}
          {education}
          {experience}
        </>
      ) : (
        <>
          {experience}
          {projects}
          {education}
        </>
      )}
      {form.certificates.length > 0 ? (
        <Block title="Certificates and achievements">
          <Entries
            items={form.certificates.map((entry) => ({
              title: entry.name || "Certificate",
              meta: join([entry.issuer, entry.date]),
            }))}
            empty=""
          />
        </Block>
      ) : null}
      {languages.length > 0 ? (
        <Block title="Languages">
          <Chips values={languages.filter(Boolean)} empty="" />
        </Block>
      ) : null}
    </>
  );
}

function ForMatching({ form }: { form: FormState }) {
  const moves = form.regions.map(
    (value) => REGION_OPTIONS.find((option) => option.value === value)?.label ?? value,
  );
  const leftOut = form.excludedPlaces.map(
    (value) => EXCLUDED_REGION_OPTIONS.find((option) => option.value === value)?.label ?? value,
  );
  const relocating = form.workPreference.includes("relocation");

  return (
    <>
      <p className="sm muted" style={{ marginTop: 20 }}>
        Matching reads your target roles, skills, location, work preference, places, summary,
        experience and projects. These are the choices that narrow or widen what you see.
      </p>
      <Block title="Target roles">
        <Chips values={form.targetRoles} empty="None yet." />
      </Block>
      <Block title="Skills">
        <Chips values={form.skills} empty="None yet." />
      </Block>
      <Block title="Where you are">
        <p className="sm">{form.location || <span className="faint">Not set.</span>}</p>
      </Block>
      <Block title="Work preference">
        <Chips values={form.workPreference.map(capitalize)} empty="Not set." />
      </Block>
      {relocating ? (
        <Block title="Where you would move">
          <Chips values={moves} empty="No places picked, so anywhere is considered." />
        </Block>
      ) : null}
      <Block title="Places left out">
        <Chips values={leftOut} empty="Nothing is left out." />
      </Block>
      <Block title="Also read">
        <p className="sm muted">
          Your summary, {form.workHistory.length} experience{" "}
          {form.workHistory.length === 1 ? "entry" : "entries"} and {form.projects.length}{" "}
          {form.projects.length === 1 ? "project" : "projects"}.
        </p>
      </Block>
    </>
  );
}

function ForOutreach({
  form,
  careerArc,
}: {
  form: FormState;
  careerArc: CareerArcDocument | null;
}) {
  return (
    <>
      <p className="sm muted" style={{ marginTop: 20 }}>
        Drafts are written from your name, location, target roles, work preference, summary, skills,
        experience, projects and career arc. Your email address and phone number are not part of it.
      </p>
      <Block title="Summary">
        <p className="sm" style={{ lineHeight: 1.7 }}>
          {filled(form.summary) ? form.summary : <span className="faint">None yet.</span>}
        </p>
      </Block>
      <Block title="Skills">
        <Chips values={form.skills} empty="None yet." />
      </Block>
      <Block title="Experience">
        <Entries items={experienceOf(form)} empty="None yet." />
      </Block>
      <Block title="Projects">
        <Entries items={projectsOf(form)} empty="None yet." />
      </Block>
      <Block title="Career arc">
        {hasContent(careerArc) ? (
          <p className="sm">
            {describeSize(careerArc)}. A draft can use the few stories that best fit that company.
          </p>
        ) : (
          <p className="sm faint">Not added.</p>
        )}
      </Block>
    </>
  );
}

/** A read-only look at the profile through the thing it will be used for,
 * with what is still empty and where to fill it in. */
export function ProfilePreview({
  form,
  careerArc,
  unsaved,
  onEdit,
}: {
  form: FormState;
  careerArc: CareerArcDocument | null;
  unsaved: boolean;
  onEdit: (target: EditTarget) => void;
}) {
  const [lens, setLens] = useState<Lens>("glance");
  const gaps = gapsFor(lens, form, hasContent(careerArc));

  return (
    <div style={{ maxWidth: 760 }}>
      <Views
        items={[
          { l: "At a glance", on: lens === "glance", onSelect: () => setLens("glance") },
          { l: "For matching", on: lens === "matching", onSelect: () => setLens("matching") },
          { l: "For outreach", on: lens === "outreach", onSelect: () => setLens("outreach") },
        ]}
      />

      {unsaved ? (
        <p className="sm amber" style={{ marginTop: 14 }} role="status">
          This includes changes you have not saved yet.
        </p>
      ) : null}

      {gaps.length > 0 ? (
        <div
          className="note"
          style={{ marginTop: 18, display: "block" }}
          aria-label="Still missing"
          role="group"
        >
          <div className="xs faint" style={{ marginBottom: 4 }}>
            Still missing
          </div>
          {gaps.map((gap) => (
            <div key={gap.text} className="row" style={{ padding: "3px 0" }}>
              <span style={{ flex: 1 }}>{gap.text}</span>
              <button type="button" className="amber m sm" onClick={() => onEdit(gap.target)}>
                Add
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {lens === "glance" ? <AtAGlance form={form} /> : null}
      {lens === "matching" ? <ForMatching form={form} /> : null}
      {lens === "outreach" ? <ForOutreach form={form} careerArc={careerArc} /> : null}
    </div>
  );
}
