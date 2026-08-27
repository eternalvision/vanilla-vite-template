# ADR-0004: Type-check JavaScript through JSDoc instead of adopting TypeScript

## Status

Accepted — 2026-08-27

## Context

`jsconfig.json` declared `strict`, `noImplicitAny`, `noUnusedLocals`, and friends while
`checkJs` was `false`, so none of those flags did anything. The project advertised strictness it
never enforced, and no `typecheck` script existed.

## Decision

Keep the source in JavaScript, set `checkJs: true`, annotate public functions with JSDoc, and
enforce it with `npm run typecheck` (`tsc --noEmit -p jsconfig.json`) in the pre-push hook and CI.
`maxNodeModuleJsDepth: 0` keeps the checker out of third-party JavaScript.

## Alternatives considered

- **Migrate to TypeScript** — better inference and a richer type vocabulary, but it adds a compile
  step, `.ts` sources, and stops the project from being a _vanilla JavaScript_ template, which is
  its reason to exist.
- **Drop the strict flags and stay untyped** — honest about the previous state, but gives up
  cheap error detection that costs only comments.

## Consequences

- Positive: type errors surface in the editor and in CI without changing the language or adding a
  build step; the published source stays runnable as-is.
- Negative: JSDoc is more verbose than TypeScript syntax, and casts (`/** @type {...} */ (value)`)
  are awkward around DOM queries.

## Trade-offs

Verbosity in comments is accepted to keep the template dependency-light and buildless at the
source level.
