# ADR-0010: Multi-page by default, no client-side router

## Status

Accepted — 2026-08-27

## Context

The template shipped a single page and no guidance on adding a second one. That is the first thing
almost any real project needs, and leaving it undecided pushed the choice — multi-page build inputs
versus a client-side router — onto every user of the template.

## Decision

The template is multi-page: each page is an HTML file at the project root with its own entry module,
registered under `build.rollupOptions.input`. `src/bootstrap.js` holds the wiring every page shares
(styles, shell, translations, event delegation); a page module supplies only its content.

`about.html` ships as a working example, and links carry the `.html` extension so they resolve
identically on every static host.

## Alternatives considered

- **A small client-side router** — roughly 40 lines, but it brings history handling, scroll
  restoration, focus management on navigation, and a server rewrite rule. That is a framework
  concern, and every page would then need JavaScript to render at all.
- **Stay single-page and say so** — honest, but it makes the template useless for the common case
  of a site with a few pages.
- **A file-system routing convention** — more machinery than a starter should impose.

## Consequences

- Positive: each page is a real URL that a static host serves directly; no rewrite rules, no
  history API, and a failed script leaves a page that still has its HTML shell.
- Negative: navigation is a full page load, and adding a page means touching two files (the HTML
  entry and the Vite input map). Shared code is code-split automatically, so the second load is
  mostly cached.

## Trade-offs

Boring, host-agnostic navigation is preferred over the smoother transitions a router would give.
