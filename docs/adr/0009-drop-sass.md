# ADR-0009: Drop Sass for plain CSS

## Status

Accepted — 2026-08-27

## Context

`sass-embedded` was installed to compile a single 40-line stylesheet containing font smoothing,
dark-mode body colours, a `prefers-reduced-motion` block, and a `:focus-visible` outline. None of
it used a Sass feature: the only Sass syntax in the project was one `@use` importing one partial.

[ADR-0003](0003-icons-and-flags-out-of-core.md) removed dependencies that were not carrying their
weight. Sass was the same problem inside the template's own source, and it was left in place.

## Decision

Delete `src/sass/`, move the rules to `src/styles/app.css` as plain CSS, and remove `sass-embedded`
and the `css.preprocessorOptions` block from the Vite config.

## Alternatives considered

- **Keep Sass for future use** — a dependency installed against hypothetical need is exactly the
  over-engineering this project's ADRs argue against. Adding it back is one `npm install` and three
  lines of config, documented in the README.
- **Move the rules into `src/tailwind.css`** — one file fewer, but it mixes framework configuration
  with application styles.

## Consequences

- Positive: one fewer dependency and one fewer compilation step; the emitted CSS is byte-identical.
- Negative: nesting beyond what browsers support, `@mixin`, and `@each` are unavailable. Native CSS
  nesting and custom properties cover what this file does; anything beyond that is a signal to
  reconsider, not to reach for a preprocessor by reflex.

## Trade-offs

Native platform features are preferred over a build step until the platform is demonstrably
insufficient.
