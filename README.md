# vanilla-vite-template

A Vite starter for **static, content-first sites** — landing pages, documentation, marketing pages,
small multi-page sites — built without a framework: plain JavaScript templating, Tailwind CSS v4,
i18next, and Vitest, wired together, type-checked, and nothing more.

A production build of the two pages it ships with is **164 kB across 14 files** (22 kB of gzipped
JavaScript, 3.9 kB of gzipped CSS).

### What it is not

It is not an application shell. There is no client-side router, no state management, and no
component model — navigation is real page loads ([ADR-0010](docs/adr/0010-multi-page-by-default.md)),
and state lives in one region that re-renders when it changes
([ADR-0011](docs/adr/0011-region-updates-not-a-renderer.md)). If the thing being built has many
interdependent stateful views, reach for a framework instead; this template will fight you.

## Stack

| Concern    | Choice                                                                        |
| ---------- | ----------------------------------------------------------------------------- |
| Build      | Vite 8 (rolldown bundler, oxc minifier, Lightning CSS), multi-page            |
| Templating | Tagged template literals with automatic escaping (`src/lib/html.js`)          |
| Updates    | Region re-render with focus preservation (`src/lib/dom.js`)                   |
| Styles     | Tailwind CSS v4 via `@tailwindcss/vite`, configured in CSS; plain CSS globals |
| i18n       | i18next, fallback language bundled, the rest fetched on demand                |
| Tests      | Vitest + jsdom, V8 coverage                                                   |
| Types      | JavaScript with JSDoc, checked by `tsc --noEmit`                              |
| Quality    | ESLint 10 (flat config), Prettier, Husky + lint-staged, GitHub Actions        |

Every non-obvious choice is recorded in [`docs/adr/`](docs/adr/); the system view is in
[`docs/architecture.md`](docs/architecture.md).

## Getting started

```bash
git clone https://github.com/eternalvision/vanilla-vite-template.git my-project
cd my-project
npm install
npm run dev
```

The dev server listens on **http://localhost:9999** and is exposed on the local network
(`vite --host`).

Requires Node.js **22.12 or newer**. CI runs the full gate on Node 22 and 24.

## Make it yours

Project identity lives in **`package.json` only** — `name`, `description`, `author`, `repository`,
and `license`. Everything else derives from it
([ADR-0007](docs/adr/0007-project-identity-from-package-json.md)):

| Consumer                                         | How it gets there                                                              |
| ------------------------------------------------ | ------------------------------------------------------------------------------ |
| Footer credit and repository link                | `virtual:app-meta` module, injected by `conf/appMetaPlugin.js`                 |
| HTML title, description, author, Open Graph tags | `%APP_NAME%` / `%APP_DESCRIPTION%` / `%APP_AUTHOR%` / `%APP_URL%` placeholders |
| `LICENSE` copyright holder                       | `npm run sync:meta`                                                            |
| `public/site.webmanifest` name and description   | `npm run sync:meta`                                                            |

So, after forking:

```bash
# 1. edit name / description / author / repository in package.json
# 2. propagate it into the files that cannot read it at runtime
npm run sync:meta
```

`npm run sync:meta:check` fails when those files drift from `package.json`; it runs in
`npm run check` and in CI. The licence _year_ is never rewritten — the start year is a fact about
your project.

Left to change by hand, because they are content rather than identity:

- `app.name` and `app.title` in `public/locales/*/common.json`
- `short_name` in `public/site.webmanifest` (it has its own length limit)
- `public/logo.svg` and `public/og-image.png` (1200×630, used for link previews)

To read the identity from your own code:

```js
import { APP_META } from 'virtual:app-meta';

console.log(APP_META.name, APP_META.repositoryUrl);
```

## Scripts

| Command                          | What it does                                                          |
| -------------------------------- | --------------------------------------------------------------------- |
| `npm run dev`                    | Dev server with HMR on port 9999                                      |
| `npm run build`                  | Production build into `dist/` — builds only, never edits sources      |
| `npm run analyze`                | Build with sourcemaps and a bundle treemap at `dist/stats.html`       |
| `npm run preview`                | Serve `dist/` on port 8888                                            |
| `npm run lint` / `lint:fix`      | ESLint                                                                |
| `npm run format` / `format:fix`  | Prettier check / write                                                |
| `npm run typecheck`              | `tsc --noEmit` over JSDoc-annotated sources                           |
| `npm test`                       | Vitest, single run                                                    |
| `npm run test:watch` / `test:ui` | Interactive Vitest                                                    |
| `npm run test:coverage`          | Coverage report (text, HTML, lcov)                                    |
| `npm run sync:meta`              | Propagate `package.json` identity into `LICENSE` and the web manifest |
| `npm run sync:meta:check`        | Fail if those files drift from `package.json` (runs in CI)            |
| `npm run check`                  | lint + format + typecheck + sync check + test — the gate CI runs      |

## Project structure

```
├── .github/workflows/
│   ├── ci.yml                 # lint, format, typecheck, coverage, build (Node 22 + 24)
│   └── deploy.yml             # build with BASE_PATH and publish to GitHub Pages
├── .husky/                    # pre-commit (lint-staged), pre-push (typecheck + tests)
├── conf/                      # build helpers used by vite.config.js
│   ├── appMeta.js             # project identity read from package.json
│   ├── appMetaPlugin.js       # exposes it as virtual:app-meta and to the HTML entries
│   ├── assetFileNamer.js      # output folder per asset type
│   ├── basePath.js            # BASE_PATH normalization
│   └── chunkSplitter.js       # single vendor chunk
├── docs/
│   ├── architecture.md        # requirements, diagrams, failure modes, risks
│   └── adr/                   # architecture decision records
├── public/
│   ├── locales/{en,uk,ru}/    # translation namespaces, served as static JSON
│   ├── logo.svg
│   ├── og-image.png           # 1200×630 link preview
│   ├── robots.txt
│   └── site.webmanifest
├── scripts/
│   └── syncMeta.js            # writes package.json identity into LICENSE + manifest
├── src/
│   ├── lib/
│   │   ├── html.js            # escaping tagged template literal
│   │   └── dom.js             # region rendering + focus preservation
│   ├── templates/             # header, nav, main (+ demo region), about, footer, layout
│   ├── styles/app.css         # global rules Tailwind's preflight does not cover
│   ├── tailwind.css           # Tailwind entry, @theme tokens
│   ├── i18n.js                # i18next setup, fallback locale bundled
│   ├── app.js                 # render, translate, event delegation
│   ├── bootstrap.js           # shared entry-point wiring
│   ├── main.js                # home page entry
│   └── about.js               # about page entry
├── tests/                     # Vitest specs
├── types/                     # ambient declarations (virtual:app-meta)
├── index.html
├── about.html
├── jsconfig.json              # aliases + checkJs
├── vite.config.js
└── vitest.config.js
```

## Templating

Templates are functions returning markup from the `html` tag. Interpolated values are HTML-escaped
unless wrapped in `raw()`:

```js
import { html } from '@/lib/html.js';

export const card = ({ title, items }) => html`
  <article>
    <h2>${title}</h2>
    <ul>
      ${items.map((item) => html`<li>${item}</li>`)}
    </ul>
  </article>
`;
```

Rules worth knowing:

- `null`, `undefined`, and `false` render as an empty string, so ``${flag && html`…`}`` works.
- Arrays are concatenated — no `.join('')` needed.
- `raw(value)` skips escaping. Use it only for markup you produced yourself.
- The result is a `RawHtml` object; take `.value` when you need the string.
- Prettier formats `html` templates as HTML, so do not depend on their exact whitespace.

## Pages

The template is multi-page: one HTML file per page, each with its own entry module. To add `blog`:

1. Copy `about.html` to `blog.html` and point its `<script>` at `/src/blog.js`.
2. Create `src/blog.js`:

   ```js
   import { startApp } from '@/bootstrap.js';
   import { html } from '@/lib/html.js';

   startApp(html`<main>…</main>`);
   ```

3. Register the HTML file in `vite.config.js`:

   ```js
   input: {
     index: fileURLToPath(new URL('./index.html', import.meta.url)),
     about: fileURLToPath(new URL('./about.html', import.meta.url)),
     blog: fileURLToPath(new URL('./blog.html', import.meta.url)),
   }
   ```

`src/bootstrap.js` holds everything the pages share — styles, the header/footer shell, translation
syncing, event delegation — and Vite code-splits it into a chunk both pages reuse. Link between
pages with the `.html` extension so the URLs resolve on every static host.

## State and updates

The layout is rendered once. When state changes, re-render only the region that owns it — replacing
markup destroys focus, caret position, and scroll state inside it:

```js
import { renderInto, withPreservedFocus } from '@/lib/dom.js';

withPreservedFocus(root, () => {
  renderInto(region, demo(state));
});
```

An element opts into focus restoration with `data-focus-key`; text fields also keep their caret
position. Event listeners are delegated on the root, so a region can be replaced without rebinding
anything. The demo region on the home page re-renders on every keystroke and is covered by tests.

Two consequences to keep in mind: node identity inside a region is not stable, so re-query elements
instead of holding references; and anything without `data-focus-key` loses focus on update.

**When this is not enough** — many stateful regions, list reordering, animation across updates —
swap the render layer for [lit-html](https://lit.dev/docs/libraries/standalone-templates/) (~5 kB).
Its `html` tag is a drop-in replacement for this one at the call sites; `renderInto` becomes
lit-html's `render`, and `data-focus-key` handling can go, because lit-html patches the DOM in place
instead of replacing it.

## Internationalisation

Translations are static JSON under `public/locales/{lng}/{ns}.json`. The fallback language (`en`) is
bundled so the first paint has real text; other languages are fetched on demand
([ADR-0012](docs/adr/0012-bundle-the-fallback-locale.md)).

Mark translatable content in markup:

```html
<h1 data-i18n="hero.title"></h1>
<nav data-i18n-attr="aria-label:nav.languages, title:app.name"></nav>
```

`applyTranslations` fills `[data-i18n]` elements via `textContent` — a translation can never inject
markup — and sets each `attribute:key` pair listed in `[data-i18n-attr]`.

**To add a language:** create `public/locales/<code>/common.json` and add `<code>` to
`SUPPORTED_LANGUAGES` in [`src/i18n.js`](src/i18n.js).

**To remove one:** delete its folder and its entry in that same array. The template ships `en`, `uk`,
and `ru` as sample content, not as a recommendation.

**To remove i18next entirely** (it is 44 kB of the 57 kB vendor chunk): delete `src/i18n.js`, drop
the three `i18next*` dependencies, remove the `syncLanguage` block and the `translate` handler from
`src/bootstrap.js`, and replace `data-i18n` attributes with literal text in the templates.

Detection order is querystring (`?lng=uk`), `localStorage`, cookie, then browser settings, and the
choice is cached. Region subtags are stripped, so `en-GB` resolves to `en`.

## Styling

Tailwind v4 is configured from CSS. Design tokens live in `@theme` in
[`src/tailwind.css`](src/tailwind.css):

```css
@theme {
  --color-brand: oklch(0.62 0.19 258);
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
}
```

There is no `tailwind.config.js` — v4 scans the project automatically and honours `.gitignore`.
Use `@source` to add a directory the scanner would otherwise miss.

[`src/styles/app.css`](src/styles/app.css) holds only what Tailwind's preflight does not: font
smoothing, dark-mode body colours, a `prefers-reduced-motion` block, and a visible `:focus-visible`
outline. It is plain CSS on purpose ([ADR-0009](docs/adr/0009-drop-sass.md)); if a project genuinely
needs Sass, `npm i -D sass-embedded`, rename the file to `.scss`, and Vite compiles it with no
further configuration.

### Adding icons

Icon fonts and flag sprites are deliberately not bundled — imported wholesale they added 5.6 MB to
the build (see [ADR-0003](docs/adr/0003-icons-and-flags-out-of-core.md)). To add them, install the
package and import only the variant you use:

```js
// one variant, not the whole family
import 'material-icons/iconfont/outlined.css';
```

For flags, prefer inlining the handful of SVGs you actually render over importing
`flag-icons/css/flag-icons.min.css`, which pulls in every country.

## Testing

Vitest runs in jsdom with `globals: false`, so imports are explicit:

```js
import { describe, expect, it } from 'vitest';
```

Specs live in `tests/` or beside a module as `*.test.js`. Coverage is collected with V8 and reported
as text, HTML (`coverage/index.html`), and lcov.

## Types

Sources are JavaScript annotated with JSDoc and checked by TypeScript in `--noEmit` mode:

```js
/**
 * @param {{ languages: readonly string[], language: string }} props
 * @returns {import('@/lib/html.js').RawHtml}
 */
export const nav = ({ languages, language }) => html`…`;
```

`npm run typecheck` runs the check; the `pre-push` hook and CI run it for you.
`maxNodeModuleJsDepth: 0` in `jsconfig.json` keeps the checker out of third-party JavaScript —
without it, `@types/node` pulls the untyped `punycode` package into the program.

## Environment variables

Copy `.env.example` to `.env` and prefix anything that must reach the browser with `VITE_`:

```ini
VITE_API_URL=https://api.example.com
```

Read it as `import.meta.env.VITE_API_URL`. Variables without the prefix stay server-side and are
never inlined into the bundle.

Two build-time variables are read by the Vite config itself, not by client code: `BASE_PATH` (see
below) and `SITE_URL`, which turns Open Graph image paths into the absolute URLs crawlers require.

## Build output

`dist/` is organised by asset type: `js/`, `styles/`, `icons/`, `images/`, `fonts/`, and `assets/`
for everything else — all content-hashed. Third-party code lands in a single `vendor` chunk
([ADR-0005](docs/adr/0005-single-vendor-chunk.md)), and code shared between pages is split out
automatically. Chunks above 500 kB trigger a build warning; `npm run analyze` shows what is inside
them.

## Deployment

The build is a static bundle — any static host works. Serve `dist/`.

### Base path

The public base path is a build input, not a constant
([ADR-0008](docs/adr/0008-configurable-base-path-and-pages-deploy.md)):

```bash
npm run build                          # served from the domain root
BASE_PATH=my-repo npm run build        # served from https://host/my-repo/
```

`BASE_PATH` accepts `my-repo`, `/my-repo`, or `/my-repo/` — all normalize to `/my-repo/`.

When referencing files from `public/` inside JavaScript, build the URL from the base rather than
writing a root-absolute path, which breaks under a sub-path:

```js
html`<img src="${import.meta.env.BASE_URL}logo.svg" alt="" />`;
```

In the HTML entry points, use `%APP_BASE%` for the same reason, and `%APP_URL%` where an absolute
URL is required. The web manifest uses paths relative to itself, so it needs no substitution.

### GitHub Pages

`.github/workflows/deploy.yml` builds with `BASE_PATH` set to the repository name and `SITE_URL` set
to the Pages origin, then publishes `dist/` on every push to `main`.

**One-time setup:** in the repository, open **Settings → Pages** and set **Source** to
**GitHub Actions**. Without it, Pages keeps publishing the repository source, which serves the
unbuilt HTML — placeholders in the title and a 404 for `/src/main.js`.

To preview a sub-path build locally:

```bash
BASE_PATH=my-repo npm run build && npx vite preview --base /my-repo/
```

## License

MIT © Alexander Priadchenko
