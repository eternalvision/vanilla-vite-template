# vanilla-vite-template

A Vite starter for projects that do not want a framework: plain JavaScript templating, Tailwind
CSS v4, Sass, i18next, and Vitest — wired together, type-checked, and nothing more.

A production build of the starting page is **~108 kB across 10 files** (18 kB of gzipped
JavaScript, 3.6 kB of gzipped CSS).

## Stack

| Concern    | Choice                                                                            |
| ---------- | --------------------------------------------------------------------------------- |
| Build      | Vite 8 (rolldown bundler, oxc minifier, Lightning CSS)                            |
| Templating | Tagged template literals with automatic escaping (`src/lib/html.js`)              |
| Styles     | Tailwind CSS v4 via `@tailwindcss/vite`, configured in CSS; Sass for global rules |
| i18n       | i18next with HTTP backend and language detection                                  |
| Tests      | Vitest + jsdom, V8 coverage                                                       |
| Types      | JavaScript with JSDoc, checked by `tsc --noEmit`                                  |
| Quality    | ESLint 10 (flat config), Prettier, Husky + lint-staged, GitHub Actions            |

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

Requires Node.js **22.12 or newer**.

## Make it yours

Project identity lives in **`package.json` only** — `name`, `description`, `author`, `repository`,
and `license`. Everything else derives from it
([ADR-0007](docs/adr/0007-project-identity-from-package-json.md)):

| Consumer                                                 | How it gets there                                                |
| -------------------------------------------------------- | ---------------------------------------------------------------- |
| Footer credit and repository link                        | `virtual:app-meta` module, injected by `conf/appMetaPlugin.js`   |
| `index.html` title, description, author, Open Graph tags | `%APP_NAME%` / `%APP_DESCRIPTION%` / `%APP_AUTHOR%` placeholders |
| `LICENSE` copyright holder                               | `npm run sync:meta`                                              |
| `public/site.webmanifest` name and description           | `npm run sync:meta`                                              |

So, after forking:

```bash
# 1. edit name / description / author / repository in package.json
# 2. propagate it into the files that cannot read it at runtime
npm run sync:meta
```

`npm run sync:meta:check` fails when those files drift from `package.json`; it runs in `npm run
check` and in CI, so the two cannot silently disagree. The licence _year_ is never rewritten — the
start year is a fact about your project.

Left to change by hand, because they are content rather than identity: `app.name` and `app.title`
in `public/locales/*/common.json`, `short_name` in the manifest (it has its own length limit), and
`public/logo.svg`.

To read the identity from your own code:

```js
import { APP_META } from 'virtual:app-meta';

console.log(APP_META.name, APP_META.repositoryUrl);
```

## Scripts

| Command                          | What it does                                                     |
| -------------------------------- | ---------------------------------------------------------------- |
| `npm run dev`                    | Dev server with HMR on port 9999                                 |
| `npm run build`                  | Production build into `dist/` — builds only, never edits sources |
| `npm run analyze`                | Build with sourcemaps and a bundle treemap at `dist/stats.html`  |
| `npm run preview`                | Serve `dist/` on port 8888                                       |
| `npm run lint` / `lint:fix`      | ESLint                                                           |
| `npm run format` / `format:fix`  | Prettier check / write                                           |
| `npm run typecheck`              | `tsc --noEmit` over JSDoc-annotated sources                      |
| `npm test`                       | Vitest, single run                                               |
| `npm run test:watch` / `test:ui` | Interactive Vitest                                               |
| `npm run test:coverage`          | Coverage report (text, HTML, lcov)                               |
| `npm run check`                  | lint + format + typecheck + test, the same gate CI runs          |

## Project structure

```
├── .github/workflows/
│   ├── ci.yml                 # lint, format, typecheck, coverage, build
│   └── deploy.yml             # build with BASE_PATH and publish to GitHub Pages
├── .husky/                    # pre-commit (lint-staged), pre-push (typecheck + tests)
├── conf/                      # build helpers used by vite.config.js
│   ├── appMeta.js             # project identity read from package.json
│   ├── basePath.js            # BASE_PATH normalization
│   ├── appMetaPlugin.js       # exposes it as virtual:app-meta and to index.html
│   ├── assetFileNamer.js      # output folder per asset type
│   └── chunkSplitter.js       # single vendor chunk
├── docs/
│   ├── architecture.md        # requirements, diagrams, failure modes, risks
│   └── adr/                   # architecture decision records
├── public/
│   ├── locales/{en,uk,ru}/    # translation namespaces, served as static JSON
│   ├── logo.svg
│   ├── robots.txt
│   └── site.webmanifest
├── src/
│   ├── lib/html.js            # escaping tagged template literal
│   ├── templates/             # header, nav, main, footer, layout
│   ├── sass/                  # global styles Tailwind's preflight does not cover
│   ├── tailwind.css           # Tailwind entry, @theme tokens
│   ├── i18n.js                # i18next setup
│   ├── app.js                 # render, translate, event binding
│   └── main.js                # entry point
├── scripts/
│   └── syncMeta.js            # writes package.json identity into LICENSE + manifest
├── tests/                     # Vitest specs
├── types/                     # ambient declarations (virtual:app-meta)
├── index.html
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

- `null`, `undefined`, and `false` render as an empty string, so `${flag && html`…`}` works.
- Arrays are concatenated — no `.join('')` needed.
- `raw(value)` skips escaping. Use it only for markup you produced yourself.
- The result is a `RawHtml` object; take `.value` when you need the string (as `render` does).

Compose in `src/templates/index.js` and render with `render(root, props)` from `src/app.js`.

## Internationalisation

Translations are static JSON under `public/locales/{lng}/{ns}.json`, loaded on demand. Mark
translatable content in markup:

```html
<h1 data-i18n="hero.title"></h1>
<nav data-i18n-attr="aria-label:nav.languages, title:app.name"></nav>
```

`applyTranslations` fills `[data-i18n]` elements via `textContent` — a translation can never inject
markup — and sets each `attribute:key` pair listed in `[data-i18n-attr]`.

To add a language:

1. Create `public/locales/<code>/common.json`.
2. Add `<code>` to `SUPPORTED_LANGUAGES` in [`src/i18n.js`](src/i18n.js).

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

`src/sass/_app.scss` holds only what Tailwind's preflight does not: font smoothing, the dark-mode
body colours, a `prefers-reduced-motion` block, and a visible `:focus-visible` outline. Component
styling belongs in utility classes.

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

Specs live in `tests/` or beside a module as `*.test.js`. Coverage is collected with V8 and
reported as text, HTML (`coverage/index.html`), and lcov.

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

## Environment variables

Copy `.env.example` to `.env` and prefix anything that must reach the browser with `VITE_`:

```ini
VITE_API_URL=https://api.example.com
```

Read it as `import.meta.env.VITE_API_URL`. Variables without the prefix stay server-side and are
never inlined into the bundle.

## Build output

`dist/` is organised by asset type: `js/`, `styles/`, `icons/`, `images/`, `fonts/`, and `assets/`
for everything else — all content-hashed. Third-party code lands in a single `vendor` chunk
([ADR-0005](docs/adr/0005-single-vendor-chunk.md)). Chunks above 500 kB trigger a build warning;
`npm run analyze` shows what is inside them.

## Deployment

The build is a static bundle — any static host works. Serve `dist/`, and for a single-page setup
rewrite unknown paths to `/index.html`.

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

In `index.html`, use the `%APP_BASE%` placeholder for the same reason. The web manifest already
uses paths relative to itself, so it needs no substitution.

### GitHub Pages

`.github/workflows/deploy.yml` builds with `BASE_PATH` set to the repository name and publishes
`dist/` on every push to `main`.

**One-time setup:** in the repository, open **Settings → Pages** and set **Source** to
**GitHub Actions**. Without it, Pages keeps publishing the repository source, which serves the
unbuilt `index.html` — placeholders in the title and a 404 for `/src/main.js`.

To preview a sub-path build locally:

```bash
BASE_PATH=my-repo npm run build && npx vite preview --base /my-repo/
```

## License

MIT © Alexander Priadchenko
