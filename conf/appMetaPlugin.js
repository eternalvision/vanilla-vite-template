/**
 * Vite plugin that keeps project identity in one place.
 *
 * - injects the shared `<head>` (description, Open Graph, icons, manifest) into
 *   every HTML entry, so pages carry only what makes them different
 * - exposes the same data to client code as the `virtual:app-meta` module
 * - fills `%APP_NAME%`, `%APP_DESCRIPTION%`, `%APP_AUTHOR%`, `%APP_BASE%` and
 *   `%APP_URL%` for anything hand-written in an HTML file
 *
 * `%APP_BASE%` is the resolved `base`, so references survive being served from
 * a sub-path. `%APP_URL%` prefixes it with `SITE_URL` when that is set, which
 * social-media crawlers need — they do not resolve relative image URLs.
 */

import { readAppMeta } from './appMeta.js';

const VIRTUAL_ID = 'virtual:app-meta';
const RESOLVED_ID = `\0${VIRTUAL_ID}`;

/**
 * @param {{ root?: string }} [options]
 * @returns {import('vite').Plugin}
 */
export const appMetaPlugin = ({ root = process.cwd() } = {}) => {
  const meta = readAppMeta(root);

  /** Resolved by Vite; always starts and ends with a slash. */
  let base = '/';

  /** Origin of the deployed site, e.g. `https://owner.github.io`; set by CI. */
  const siteUrl = (process.env.SITE_URL ?? '').replace(/\/+$/, '');

  return {
    name: 'app-meta',

    configResolved(config) {
      base = config.base;
    },

    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_ID : undefined;
    },

    load(id) {
      if (id !== RESOLVED_ID) return undefined;

      return `export const APP_META = ${JSON.stringify(meta)};`;
    },

    transformIndexHtml(html) {
      const absolute = `${siteUrl}${base}`;

      /** @type {Record<string, string>} */
      const placeholders = {
        '%APP_NAME%': meta.name,
        '%APP_DESCRIPTION%': meta.description,
        '%APP_AUTHOR%': meta.author,
        '%APP_BASE%': base,
        '%APP_URL%': absolute,
      };

      /** @type {import('vite').HtmlTagDescriptor[]} */
      const tags = [
        // charset must come first in the document; injecting it keeps pages minimal
        { tag: 'meta', attrs: { charset: 'UTF-8' } },
        {
          tag: 'meta',
          attrs: { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        },
        { tag: 'meta', attrs: { name: 'description', content: meta.description } },
        { tag: 'meta', attrs: { name: 'author', content: meta.author } },
        { tag: 'meta', attrs: { name: 'color-scheme', content: 'light dark' } },
        {
          tag: 'meta',
          attrs: {
            name: 'theme-color',
            content: '#ffffff',
            media: '(prefers-color-scheme: light)',
          },
        },
        {
          tag: 'meta',
          attrs: { name: 'theme-color', content: '#020617', media: '(prefers-color-scheme: dark)' },
        },
        { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
        { tag: 'meta', attrs: { property: 'og:title', content: meta.name } },
        { tag: 'meta', attrs: { property: 'og:description', content: meta.description } },
        { tag: 'meta', attrs: { property: 'og:image', content: `${absolute}og-image.png` } },
        { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
        { tag: 'meta', attrs: { name: 'twitter:image', content: `${absolute}og-image.png` } },
        { tag: 'link', attrs: { rel: 'icon', href: `${base}logo.svg`, type: 'image/svg+xml' } },
        { tag: 'link', attrs: { rel: 'manifest', href: `${base}site.webmanifest` } },
      ];

      // a page may set its own <title>; otherwise it gets the project name
      if (!/<title[\s>]/i.test(html)) {
        tags.push({ tag: 'title', children: meta.name });
      }

      const filled = Object.entries(placeholders).reduce(
        (result, [placeholder, value]) => result.replaceAll(placeholder, value),
        html,
      );

      return { html: filled, tags: tags.map((tag) => ({ ...tag, injectTo: 'head-prepend' })) };
    },
  };
};
