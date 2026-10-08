## Target branch

- [ ] This pull request targets `staging` (all normal work)
- [ ] This is a release pull request from `staging` into `main` (maintainers only)

## What & Why

<!-- What changed and why? -->

## Related Issue / Task

<!-- Example: Closes #123 -->

## Changes

<!-- List the important changes made in this PR. -->

-
-
-

## How was this implemented?

<!--
Briefly explain the important technical decisions.
Mention any new component, hook, route, or significant change to the
existing flow.
-->

## Checklist

- [ ] `pnpm typecheck && pnpm lint && pnpm build` all pass
- [ ] `pnpm format:check` passes
- [ ] Regenerated `lib/api-client/` (`pnpm generate-api-client`) and committed the result, if `inroad-api`'s `/openapi.json` changed
- [ ] Only `ui/` primitives reference raw design tokens; `composed/` components don't hardcode colors, spacing, or fonts
- [ ] No `.env`, secret, or credential staged
- [ ] No leftover `console.log()` statements
- [ ] `inroad-docs`'s `docs/project-overview.md` updated if this makes an architectural decision (new UI pattern that should become a convention, a new library, a decision reversal)

## Notes

<!-- Anything important for reviewers. -->
