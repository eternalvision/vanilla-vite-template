# ADR-0007: Derive project identity from package.json

## Status

Accepted — 2026-08-27

## Context

The template hard-coded its own identity in five places: the repository URL in the footer, the
author and description in `index.html` (the description three times over), the copyright holder in
`LICENSE`, and the name in `public/site.webmanifest`. Anyone forking the template had to find all
of them, and the copies had already drifted — `LICENSE` credited `s.p.` while the README credited
`Alexander Priadchenko`.

## Decision

`package.json` is the single source of truth for `name`, `description`, `author`, `repository`, and
`license`.

- **Client code** reads it from the `virtual:app-meta` module, produced by a small Vite plugin
  (`conf/appMetaPlugin.js`) and typed in `types/app-meta.d.ts`.
- **`index.html`** uses `%APP_NAME%`, `%APP_DESCRIPTION%`, and `%APP_AUTHOR%` placeholders, filled
  by the same plugin through `transformIndexHtml`.
- **`LICENSE` and `site.webmanifest`** cannot be generated at build time — they are read by tools
  that never run Vite — so `npm run sync:meta` rewrites them, and `npm run sync:meta:check` fails
  the build when they drift. CI runs the check.

The licence year is never regenerated: the start year is a fact about the project, so only the
holder is rewritten.

## Alternatives considered

- **Import `package.json` directly from client code** — no plugin to maintain, but it risks
  bundling the whole file (including the dependency list) into the client if tree-shaking of JSON
  named exports fails.
- **`define` constants in `vite.config.js`** — simpler, but the replacements have to be repeated in
  the Vitest config, and they need hand-written global type declarations rather than a module.
- **Environment variables (`VITE_REPOSITORY_URL`, …)** — moves the duplication into `.env` and
  makes identity a deployment concern rather than a project fact.
- **Generate `LICENSE` and the manifest at build time** — the manifest is reachable, but a `LICENSE`
  that only exists in `dist/` is not a licence anyone can find in the repository.

## Consequences

- Positive: forking the template means editing `package.json` and running `npm run sync:meta`;
  drift is caught by CI rather than discovered by a reader.
- Negative: one more plugin in the build, a virtual module that needs an ambient type declaration,
  and a generated-file check that fails builds when someone edits `LICENSE` by hand.

## Trade-offs

A small amount of build machinery is accepted so that project identity has exactly one home.
