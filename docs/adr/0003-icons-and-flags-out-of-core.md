# ADR-0003: Ship no icon or flag packs by default

## Status

Accepted — 2026-08-27

## Context

`material-icons` and `flag-icons` were imported unconditionally from the entry point. In a
production build of the _empty_ template this produced 1.8 MB of fonts (all five Material Icons
variants) and 3.8 MB of flag SVGs plus a 422 kB stylesheet — 5.6 MB of the 6.2 MB output, none of
it referenced by any markup.

CSS-delivered icon fonts and flag sprites cannot be tree-shaken: the stylesheet references every
glyph, so the bundler must emit every asset.

## Decision

Remove both packages from the template. Document how to add them, subset them, and reference only
the variants a project actually uses.

## Alternatives considered

- **Keep them but import a single variant and safelist a few flags** — around 400 kB, still paid by
  every project that never renders an icon.
- **Keep everything** — convenience at 6.2 MB, and it teaches the wrong default.

## Consequences

- Positive: the production build drops from 6.2 MB / 166 files to ~108 kB / 10 files.
- Negative: projects that want icons must install and wire them up. The README carries the recipe.

## Trade-offs

A starter template sets the defaults a project inherits. Paying megabytes up front for assets that
may never be used is the wrong default; a documented three-line addition is cheap.
