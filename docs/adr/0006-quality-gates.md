# ADR-0006: Enforce quality gates in hooks and CI, never inside the build

## Status

Accepted — 2026-08-27

## Context

`prebuild` ran `format:fix && lint:fix`, so every `npm run build` rewrote source files. A build
that mutates its own input cannot be reproduced from a checkout, and in CI it either changes the
tree under test or fails for reasons unrelated to the build.

Related gaps: `npm test` ran Vitest in watch mode (it never exits in CI), `eslint --ext` is a
no-op under flat config, and there was no CI pipeline, no type checking, and no coverage.

## Decision

- `npm run build` only builds.
- `npm test` runs `vitest run`; `npm run test:watch` is the interactive form.
- Formatting and linting run on staged files through Husky + lint-staged (`pre-commit`).
- `pre-push` runs the type checker and the test suite.
- GitHub Actions runs lint, format check, typecheck, coverage, and build on every push and pull
  request.

## Alternatives considered

- **Keep autofix in `prebuild`** — convenient locally, unreproducible everywhere else.
- **Hooks only, no CI** — hooks are bypassable with `--no-verify` and absent for contributors who
  skip `npm install`.
- **CI only, no hooks** — correct but slow: formatting feedback arrives minutes after the commit.

## Consequences

- Positive: builds are reproducible; the same checks run locally and in CI; failures are attributed
  to the step that caused them.
- Negative: commits are slightly slower, and a bad `pre-push` run blocks pushing until fixed.

## Trade-offs

A few seconds per commit in exchange for a build that never edits the working tree.
