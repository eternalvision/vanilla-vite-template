# ADR-0002: Configure Tailwind v4 from CSS, through the Vite plugin

## Status

Accepted — 2026-08-27

## Context

The project ran Tailwind v4 through a hand-written PostCSS chain
(`@tailwindcss/postcss` + `autoprefixer`), while also declaring `@config` in the CSS entry and
passing the same JS config object to the PostCSS plugin. `@tailwindcss/vite` was installed but
never used. Autoprefixer duplicates work Tailwind v4 already does, and `normalize.css` was loaded
on top of Tailwind's own preflight.

## Decision

Use the official `@tailwindcss/vite` plugin. Configure the design system from CSS with `@theme`
and `@source`. Remove `tailwind.config.js`, the PostCSS chain, `autoprefixer`, `postcss`, and
`normalize.css`.

## Alternatives considered

- **Keep the PostCSS chain** — one extra transform step per file, slower builds, and two sources of
  truth for the Tailwind config.
- **Keep `tailwind.config.js` alongside the plugin with `@config`** — supported for migration, but
  it splits theme tokens across two files with no benefit for a new project.

## Consequences

- Positive: one configuration surface; faster builds; three fewer dependencies; no duplicate reset.
- Negative: plugins and presets published for the v3 JS-config format need the `@plugin`/`@config`
  escape hatch. Anyone used to `tailwind.config.js` has to learn the CSS-first syntax.

## Trade-offs

Following the framework's current, supported path is worth breaking familiarity with the v3 layout.
