# ADR-0001: Replace Handlebars with tagged template literals

## Status

Accepted — 2026-08-27

## Context

Templates were authored as `.hbs` files, imported with `?raw`, and compiled in the browser by the
full Handlebars distribution. A production build of the empty template shipped 78 kB of Handlebars
plus 27 kB of `source-map` (pulled in by the compiler) to render four empty tags.

Runtime compilation also generates functions from strings, which forces `unsafe-eval` in any
Content-Security-Policy the template is deployed under.

## Decision

Drop Handlebars. Templates are plain JavaScript modules that return markup from an `html` tagged
template literal (`src/lib/html.js`), which escapes every interpolated value unless it is wrapped
in `raw()`.

## Alternatives considered

- **Precompile `.hbs` at build time** — keeps the Handlebars authoring syntax and drops the bundle
  cost to `handlebars/runtime` (~20 kB), but requires a custom Vite plugin to maintain and still
  keeps a dependency for a feature set (partials, helpers, block expressions) that a starter
  template does not need.
- **Keep runtime compilation** — the only option that allows loading templates from the network at
  runtime. No use case in a static starter, and it costs 105 kB plus `unsafe-eval`.
- **lit-html** — a real templating library with efficient DOM diffing, but it introduces a
  rendering model (parts, directives) that a "vanilla" template should not impose.

## Consequences

- Positive: 105 kB removed from the bundle; no `unsafe-eval`; templates are ordinary modules that
  IDEs, ESLint, and the type checker understand; escaping is explicit and unit-tested.
- Negative: no partials, helpers, or block expressions — composition happens through function
  calls and `Array.map`. Interpolating untrusted markup requires calling `raw()` deliberately,
  which is the point, but a careless `raw()` is an XSS hole.

## Trade-offs

Bundle size, tooling support, and CSP compatibility are prioritised over template-language
ergonomics. Composition through functions covers everything the template demonstrated.
