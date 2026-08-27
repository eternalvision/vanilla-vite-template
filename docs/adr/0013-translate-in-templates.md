# ADR-0013: Translate in templates, re-render the page

## Status

Accepted — 2026-08-27. Amends [ADR-0011](0011-region-updates-not-a-renderer.md).

## Context

Translations were applied after rendering: templates emitted `data-i18n="hero.title"` on empty
elements, and a pass over the DOM filled them in. That meant three bespoke concepts to learn
(`data-i18n`, `data-i18n-attr`, and the pass that reads them), and it could only ever produce
static strings — no interpolation, no plurals, and attributes needed a second attribute language of
their own. The demo greeting had to be split across two elements to work around it.

[ADR-0012](0012-bundle-the-fallback-locale.md) removed the reason the indirection existed:
translations are now available synchronously at first render.

## Decision

Templates call `t()` directly:

```js
html`<h1>${t('hero.title')}</h1>
  <p>${t('demo.greeting', { name })}</p>
  <button>${t('demo.clicks', { count })}</button>`;
```

Pages re-render on language change and on state change, through one `update()` that preserves
focus, caret, and scroll position. `data-i18n`, `data-i18n-attr`, `applyTranslations`,
`markActiveLanguage`, and `src/app.js` are deleted.

## Alternatives considered

- **Keep the attribute protocol and extend it** — interpolation values would have to be encoded in
  markup (`data-i18n-vars='{"name":"Ada"}'`), which is a worse version of a function call.
- **Region-only updates, as ADR-0011 described** — still available through `renderInto`, but making
  it the default means every page needs a region map. Re-rendering a content page is cheap;
  preservation is what makes it correct.

## Consequences

- Positive: one concept instead of three; interpolation, plurals, and translated attributes come
  free from i18next; templates read as what they produce; the shell lost a module.
- Negative: a language change re-renders the page rather than patching text nodes, and everything a
  template renders must come through its arguments — there is no ambient `t`. Node identity is not
  stable across an update, so code re-queries elements instead of holding references.

## Trade-offs

A slightly larger unit of work per update, in exchange for deleting a bespoke templating protocol.
