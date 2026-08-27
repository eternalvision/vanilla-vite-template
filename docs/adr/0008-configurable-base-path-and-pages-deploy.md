# ADR-0008: Make the public base path a build input, and deploy Pages from Actions

## Status

Accepted — 2026-08-27

## Context

`base` was hard-coded to `/`, and several references bypassed it entirely: `index.html` linked
`/logo.svg` and `/site.webmanifest`, the header template embedded `/logo.svg` inside a template
literal (which no bundler can rewrite), and the web manifest declared `start_url` and `scope` as
`/`.

GitHub project pages serve from `https://<owner>.github.io/<repo>/`. With no deployment workflow,
Pages published the repository as-is, so the deployed page was the _source_ `index.html`: the tab
title read `%APP_NAME%` and the browser requested `/src/main.js`, which does not exist in a
published build.

## Decision

- `base` is read from the `BASE_PATH` environment variable and normalized by
  `conf/basePath.js`, so `my-repo`, `/my-repo`, and `/my-repo/` all produce `/my-repo/`.
- `index.html` references assets through a `%APP_BASE%` placeholder filled by the app-meta plugin
  from the resolved `base`.
- Templates build asset URLs from `import.meta.env.BASE_URL`, which Vite guarantees ends in a
  slash.
- The web manifest uses paths relative to itself (`start_url: "."`, `scope: "./"`,
  `icons[].src: "logo.svg"`), so it needs no build-time substitution at all.
- `.github/workflows/deploy.yml` builds with `BASE_PATH: ${{ github.event.repository.name }}` and
  publishes `dist/` through `actions/deploy-pages`.

## Alternatives considered

- **Hard-code the repository name as `base`** — breaks local preview and any other host, and
  silently breaks again when the repository is renamed or forked, which contradicts
  [ADR-0007](0007-project-identity-from-package-json.md).
- **Derive `base` from `package.json` `repository`** — couples the deployment target to project
  identity; the same repository may deploy to a custom domain at the root.
- **Use relative (`base: './'`) URLs everywhere** — works for a flat single page, but breaks as
  soon as the app is served from a nested route.
- **Keep deploying from a branch and commit `dist/`** — build output in version control, merge
  conflicts on every deploy, and no guarantee it matches the source.

## Consequences

- Positive: one build works at a domain root, under a project-pages sub-path, and under any other
  prefix; deployment is reproducible from source; a rename only changes the workflow input, which
  is already derived from the repository.
- Negative: asset references in templates must go through `import.meta.env.BASE_URL` — plain
  `/asset.png` is a bug that only shows up under a sub-path. Enabling this requires setting the
  repository's Pages source to **GitHub Actions**, which is a one-time manual step.

## Trade-offs

A little ceremony around asset URLs is accepted so the deployment target stops being baked into
the source.
