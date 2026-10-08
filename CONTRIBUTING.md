# Contributing to Inroad Web

Thanks for helping out. This guide explains how to get a change from your
machine into production. It is short on purpose, so please read all of it once.

## The branch flow

We use two long-lived branches:

| Branch    | Purpose                                                 |
| --------- | ------------------------------------------------------- |
| `staging` | Where all work lands first. This is the default branch. |
| `main`    | Production. It only receives merges from `staging`.     |

The rules:

1. Every branch you create starts from `staging`.
2. Every pull request you open targets `staging`.
3. Nobody pushes directly to `main` or `staging`. Use a pull request.
4. A pull request needs **one approval** before it is merged.
5. `main` is updated by a release pull request from `staging` into `main`.
   Only a maintainer opens and merges that one.
6. CI runs on every pull request and on every push to `staging` and `main`. It
   must pass before merging.

CI also rejects any pull request into `main` that does not come from `staging`.

## Getting set up

You need Node 18.17 or newer and pnpm 11. The README has the full steps for
running the backend and this app locally.

```bash
git clone https://github.com/Inroad-Ai/inroad-web.git
cd inroad-web
git checkout staging
pnpm install
cp .env.example .env.local
pnpm dev
```

Optional but recommended, install the pre-commit hooks:

```bash
pre-commit install --hook-type pre-commit --hook-type pre-push
```

## Making a change

1. Update your local `staging`:

   ```bash
   git checkout staging
   git pull origin staging
   ```

2. Create a branch from it. Use a short name with one of these prefixes:

   | Prefix      | Use it for                            |
   | ----------- | ------------------------------------- |
   | `feat/`     | A new feature                         |
   | `fix/`      | A bug fix                             |
   | `refactor/` | A change that does not alter behavior |
   | `chore/`    | Tooling, dependencies, config         |
   | `docs/`     | Documentation only                    |

   ```bash
   git checkout -b feat/short-description
   ```

3. Make your change. Keep it focused. One pull request should do one thing.

4. Check your work before pushing:

   ```bash
   pnpm format:check
   pnpm typecheck
   pnpm lint
   pnpm build
   ```

   If `inroad-api`'s `/openapi.json` changed, also run `pnpm generate-api-client`
   and commit the result.

5. Commit with a clear message that says what changed and why. Present tense,
   short first line, for example `Add retry button to the research page`.

6. Push and open a pull request into `staging`:

   ```bash
   git push -u origin feat/short-description
   ```

## Pull requests

- Fill in the pull request template. Explain what changed and why.
- Link the issue or task if there is one.
- Keep the diff small enough to review in one sitting. Split large work.
- Make sure the base branch is `staging`.
- Reply to review comments and push fixes to the same branch. Do not open a new
  pull request.
- Once you have one approval and CI is green, the change can be merged.

## Code guidelines

- Follow the conventions in the README and in `CLAUDE.md`.
- Only `ui/` primitives use raw design tokens. Composed components do not
  hardcode colors, spacing or fonts.
- Do not leave `console.log()` statements behind.
- Prettier and ESLint decide formatting. Do not argue with them in review.

## Security

- Never commit `.env` files, keys, tokens or passwords. CI scans for secrets and
  will block the pull request.
- Report vulnerabilities privately. Do not open a public issue. See
  [`SECURITY.md`](SECURITY.md).

## Reporting bugs and asking for features

Use the issue templates under the Issues tab. Include the steps to reproduce a
bug, what you expected, and what happened instead.
