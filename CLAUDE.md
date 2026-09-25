# CLAUDE.md

This file defines how you work in this repository. Read it before making any
change. If something you're about to do conflicts with this file, stop and
follow this file, or ask if the conflict seems like it should override these
rules.

## What this project is

Inroad. A platform for people job hunting who have decided the job board is a
dead end: build a profile once, and the platform finds companies that fit,
researches each one properly, and drafts outreach that sounds like a real
person did the homework. This repo is the Next.js frontend (App Router), one
of three repos under the `Inroad-Ai` GitHub org:

- `inroad-api` — FastAPI backend
- `inroad-web` (this repo) — Next.js frontend
- `inroad-docs` — architecture docs, project history, and the enforceable
  rules this file mirrors

This file is a repo-scoped copy of the canonical `CLAUDE.md` in
`inroad-docs`. If the two ever drift, `inroad-docs`'s copy is the one to
trust and this one needs updating, flag it rather than picking whichever is
more convenient.

Reference `inroad-docs`'s `docs/project-overview.md` for the full
architecture rationale, including why each piece of the stack was chosen
over its alternatives. `inroad-docs`'s `docs/code-standards.md` and
`docs/design-tokens.md` hold the code-level and design standards. Read them
before writing any code, not just at the start of the project, before every
task. Clone `inroad-docs` as a sibling of this repo if you don't already
have it locally.

## How we work

Step by step. One piece finished properly beats several pieces half-built.
Don't start a second piece of work before the current one is committed and
passing its tests.

`inroad-docs`'s `project-overview.md` is the project's memory across
sessions, not a one-time planning doc. If a session in this repo makes a
real architectural decision (a new UI pattern that should become a
convention, a library that wasn't already listed), that gets written back
into `project-overview.md` in `inroad-docs` before the session ends. An
undocumented decision did not happen as far as the next session is
concerned.

If a plan for the current session would contradict something already
decided in `project-overview.md`, stop and say so explicitly instead of
quietly building the new thing. Reversing a prior decision is fine, doing it
silently is not.

## Architecture rules, non-negotiable

**Two-tier components (`components/`):**
- `ui/` — design-system primitives only (Button, Input, Card, etc). The only
  components allowed to reference raw design tokens directly.
- `composed/` — feature components, built entirely out of ui/ primitives.
  Never hardcode a color, spacing value, or font size here, use ui/
  primitives and their existing props.

## Design tokens

`styles/tokens.css` is the single source of truth for color, type, and
spacing. Never write a raw hex value, arbitrary pixel value, or inline font
declaration anywhere else in the codebase. If a needed token doesn't exist
yet, add it to tokens.css first, then use it, don't work around it with a
one-off value.

## API client

This app calls the backend (`inroad-api`) exclusively through the generated
typed client in `lib/api-client/`. Never hand-write a `fetch()` call to the
backend. If the client is out of date after a backend change, regenerate it
(`pnpm generate-api-client` or equivalent) against the `inroad-api` repo's
`/openapi.json`, don't work around a stale client with a manual fetch call.

## Naming conventions

- TypeScript/React: PascalCase for components, camelCase for functions and
  variables, kebab-case for file names inside `app/` routes.
- Env vars: `INROAD_` (or `NEXT_PUBLIC_INROAD_` where it must reach the
  browser) prefix for anything custom.

## What not to build without being asked

Still out of scope until a specific, evidenced reason says otherwise:
splitting this repo's `app/(marketing)` route group into its own repo, a
second design-token source, self-hosted infrastructure of any kind. Don't
add infrastructure ahead of the feature that needs it. See `inroad-docs`'s
`CLAUDE.md` for the full list, most of which is backend infrastructure and
doesn't apply here.

## Ambiguity

If a requirement is genuinely unclear, or a decision would lock in something
structural (a new top-level folder, a new dependency, a new external
service), ask before proceeding rather than guessing. Small implementation
details don't need to be asked about, pick the reasonable default and note
the assumption.

## Testing

Confirm `next build` succeeds with zero broken imports before committing.
If the backend's `/openapi.json` changed, regenerate the typed API client
and commit the result before committing anything that depends on it.

## What's tracked vs local only

Tracked in git, every one of these must exist in this repo:
- All source code in `app/`, `components/`, `lib/`, `styles/`, `hooks/`
- `.env.example` (the template, with placeholder values, never real
  secrets)
- `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, config files
  (`tailwind.config.ts`, `next.config.js`, etc)
- `CLAUDE.md`, `README.md`

Never tracked, local only, confirm these are in `.gitignore`:
- `.env`, `.env.local` (the real ones, with real values, actual secrets)
- `node_modules/`, `.next/`
- Any generated file that gets rebuilt from source. `lib/api-client/`
  generated output can go either way, decide once and be consistent, but if
  it's committed, it must be regenerated and re-committed whenever the
  backend schema changes, don't let a stale generated client sit in git
  while the source of truth has moved on.

Before the first commit, run `git status` and confirm nothing in the "never
tracked" list above shows up as staged. If `.env` or `.env.local` ever gets
accidentally committed, that's not something to fix with a follow-up
commit, the secret is already in git history at that point, flag it
immediately rather than quietly patching forward.

## Git workflow

Commit after every completed fix or change, not in one large batch at the
end of a session. Each commit should represent one logical, working change;
the repo should be in a working state at every commit, not just at the end.
A change that also needs backend work (a new endpoint the UI calls) is a
separate commit and PR in `inroad-api`, not something to fold into this
repo. Land the API side first so the generated client has something to
point at.

Before every commit:
1. Run `next build` (see Testing above).
2. Confirm no `.env` / `.env.local` file, secret, or credential is staged.
3. Confirm no debug `console.log()` statements were left in.

Commit message rules:
- Plain, direct, written like an engineer describing what changed and why,
  not like generated documentation.
- Format: short imperative summary line (under ~60 chars), blank line, then
  1-3 sentences of context if the change isn't self-explanatory. No summary
  line needed to restate the obvious.
- No em-dashes. No emojis. No exclamation points.
- Never include any reference to Claude, Anthropic, AI, "generated," or any
  tool attribution anywhere in the commit message. No "Co-Authored-By"
  trailer referencing an AI. Commit messages read exactly as if a human
  engineer wrote them, because they should.
- Bad example: "feat: add routers layer 🤖 Generated with Claude Code"
- Good example: "restructure backend into routers/services/schemas/db layers"

Push after each commit unless told otherwise, don't let work sit unpushed
across a session.

## Code comments

`inroad-docs`'s `docs/code-standards.md` §8 covers what a comment should say
(why, not what). This covers how many and how long, which is the part that
actually goes wrong.

**The default is no comment.** Clear names and small functions are the
first tool; a comment is what's left when those genuinely can't carry the
meaning. Adding a comment to every block is not thoroughness, it's noise,
and it ages badly because nobody updates it.

Write one only when not knowing the fact would cause a bug, or would lead
someone to "fix" correct code into broken code. Concretely, that's:

- A non-obvious constraint in a library or the runtime (a hook that has to
  run in a specific order, a Next.js caching behavior that isn't obvious
  from the code).
- Why a simpler-looking approach was rejected here.
- Why a value that looks arbitrary is that value.
- Why an error is swallowed or treated as recoverable.

**Keep it to one or two lines.** If the explanation needs a paragraph, it
is design rationale, not a comment. It goes in `inroad-docs`'s
`project-overview.md`, and the code gets a one-line pointer at most.

Do not write:

- Comments that restate the code, the function name, or the type
  signature.
- Module or function docstrings that describe the obvious.
- Migration or phase history in code. That is what `project-overview.md`'s
  build log is for. Code describes how things are now, not how they got
  here.
- Apologetic, tentative, or chatty asides. A comment is a technical
  statement, written in the same register as the Voice section below.

If a comment is doing real work, keep it even in a diff that's otherwise
comment-free. Trimming is about removing noise, not hitting a quota.

## Voice, when writing user-facing copy or code comments

Direct, plain, not corporate. No "leverage," "seamless," "revolutionize,"
"AI-powered," "empower." Write like an engineer explaining something to
another engineer. This applies to UI copy, error messages, comments, and
commit messages alike.
