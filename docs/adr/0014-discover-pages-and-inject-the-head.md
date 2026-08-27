# ADR-0014: Discover pages, inject the shared head

## Status

Accepted — 2026-08-27. Amends [ADR-0010](0010-multi-page-by-default.md).

## Context

Adding a page took three steps: create the HTML file, create the entry module, and register the
HTML file under `build.rollupOptions.input`. Skipping the third step failed silently — the build
succeeded, printed no warning, and simply omitted the page.

Each HTML file also carried about thirty lines of duplicated `<head>`: description, Open Graph tags,
icons, manifest link, theme colours. Two pages already disagreed about some of it.

## Decision

- `conf/htmlEntries.js` builds the Rollup input map by reading every `*.html` in the project root.
  Adding a page means adding a file.
- The app-meta plugin injects the shared `<head>` — charset, viewport, description, author, Open
  Graph, Twitter, icon, manifest — from `package.json`, so a page's HTML is nine lines: the shell
  and its own `<script>`. A page that sets its own `<title>` keeps it.

## Alternatives considered

- **Keep the explicit input map** — one file to look at, but a silent failure mode is worse than
  the indirection.
- **A `pages/` directory convention** — cleaner root, but it moves the HTML away from where Vite
  expects entry points and complicates dev-server URLs.
- **An HTML partial included at build time** — needs a templating step for HTML, which the project
  deliberately does not have.

## Consequences

- Positive: adding a page is two files and no configuration; meta tags have one definition; renaming
  the project updates every page's metadata.
- Negative: any stray `*.html` in the root becomes a page, and the head is no longer visible in the
  source of the page itself — it appears in the built output and in `conf/appMetaPlugin.js`.

## Trade-offs

Convention over configuration, accepted specifically because the configuration it replaces failed
silently.
