# ADR-0012: Bundle the fallback locale

## Status

Accepted — 2026-08-27

## Context

Every translation, including the fallback language, was fetched over HTTP after the bundle
executed. The page therefore painted with empty `[data-i18n]` elements and filled them one round
trip later — a visible flash of missing text on a slow connection, on the very first paint.

## Decision

Import `public/locales/en/common.json` into the bundle and pass it to i18next as `resources`, with
`partialBundledLanguages: true` so the HTTP backend still fetches every other language on demand.
i18next resolves its init synchronously when resources are present, so `main` can translate the
first render immediately.

The file is imported from `public/` on purpose: the same JSON is both served statically for the
backend and inlined for the first paint.

## Alternatives considered

- **Keep everything on the network** — the previous state, and the cause of the flash.
- **Inline every language** — no flash in any language, but every visitor downloads translations
  they will never read; the cost grows with each language added.
- **Server-render the first paint** — outside the scope of a static template.
- **Keep the source of truth in `src/` and copy it to `public/` at build time** — removes the
  duplication, adds a build step and a way for the two copies to disagree.

## Consequences

- Positive: no flash of untranslated markup for the fallback language, and one fewer render-blocking
  request. Costs about 0.4 kB gzipped.
- Negative: the fallback locale exists twice in the output (bundled and served), and editing it
  invalidates the JavaScript bundle hash. Visitors whose language is not the fallback still see the
  fallback briefly before their language loads — better than empty elements.

## Trade-offs

A small, bounded duplication is accepted to remove a visible defect on first paint.
