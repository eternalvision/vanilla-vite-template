# ADR-0011: Update regions, do not build a renderer

## Status

Accepted — 2026-08-27

## Context

[ADR-0001](0001-drop-handlebars-for-tagged-templates.md) replaced Handlebars with an escaping
tagged template literal. That covers producing markup, but not updating it: `render()` replaced the
entire page through `innerHTML`, which discards focus, caret position, and scroll state. The
template had no answer for state changes, and its own risk register admitted as much.

Leaving that gap has one predictable outcome: every project built on the template either re-renders
everything and lives with the glitches, or grows an ad-hoc mini-framework.

## Decision

Provide the smallest thing that makes stateful updates correct, and stop there:

- `renderInto(target, markup)` replaces the contents of one region rather than the page.
- `captureFocus` / `restoreFocus` / `withPreservedFocus` restore focus and the caret across a
  replacement, for elements that opt in with `data-focus-key`.
- Event listeners stay delegated on the root, so replacing a region never unbinds a handler.

There is no diffing, no reactivity, and no component lifecycle. The demo region on the home page
exercises the pattern: it re-renders on every keystroke while the caret stays put.

## Alternatives considered

- **Adopt lit-html (~5 kB)** — real diffing, event bindings, keyed lists. The honest upgrade once an
  app has many stateful regions, and the README documents the swap. Making it the default would
  hand every project a rendering model it may not need.
- **Write a diffing algorithm** — the mini-framework this decision exists to avoid.
- **Do nothing and document the limitation** — the previous state; it left the most common real
  requirement unanswered.

## Consequences

- Positive: state changes no longer destroy the page; the pattern is ~60 lines, testable, and easy
  to read out of the codebase.
- Negative: node identity inside a region is not stable, so code must re-query elements after an
  update rather than holding references. Anything not marked `data-focus-key` loses focus. Large or
  frequently updated regions will re-render more than a diffing renderer would.

## Trade-offs

Correctness for small stateful regions is bought cheaply; anything larger is a signal to bring in a
renderer rather than to grow this one.
