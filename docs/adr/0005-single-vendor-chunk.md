# ADR-0005: Emit one vendor chunk

## Status

Accepted — 2026-08-27

## Context

`manualChunks` produced one chunk per npm package. The old build emitted seven vendor chunks for
a page with no features; a real application produces dozens. Each is a separate request on the
critical path, and small chunks compress worse than one larger file.

The stated goal — long-lived caching — is only reached when a chunk changes rarely. Per-package
chunks do get invalidated independently, but that matters only for large dependencies that
version on separate schedules.

## Decision

Put everything from `node_modules` into a single `vendor` chunk (`conf/chunkSplitter.js`).
`build.chunkSizeWarningLimit` is lowered from 2000 kB to 500 kB so growth is noticed instead of
silenced.

## Alternatives considered

- **No `manualChunks` at all** — the bundler decides; simpler, but application changes then
  invalidate dependency code in the same chunk.
- **Per-package chunks** — the previous behaviour; a request waterfall for a caching benefit that
  a template cannot predict.
- **Split only large dependencies by an explicit list** — the right answer for a mature app, and
  the wrong default for a starter: the list would be empty here.

## Consequences

- Positive: two JS requests for the whole page; dependency code stays cached across app releases.
- Negative: updating any dependency invalidates the whole vendor chunk. Projects with a large,
  independently versioned dependency should split it out explicitly.

## Trade-offs

Fewer requests and better compression now, at the cost of coarser cache invalidation later.
