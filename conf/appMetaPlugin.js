/**
 * Vite plugin exposing project identity from `package.json` to both the client
 * bundle (through the `virtual:app-meta` module) and `index.html` (through
 * `%APP_*%` placeholders), so a fork only has to edit `package.json`.
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

  /** @type {Record<string, string>} */
  const htmlPlaceholders = {
    '%APP_NAME%': meta.name,
    '%APP_DESCRIPTION%': meta.description,
    '%APP_AUTHOR%': meta.author,
  };

  return {
    name: 'app-meta',

    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_ID : undefined;
    },

    load(id) {
      if (id !== RESOLVED_ID) return undefined;

      return `export const APP_META = ${JSON.stringify(meta)};`;
    },

    transformIndexHtml(html) {
      return Object.entries(htmlPlaceholders).reduce(
        (result, [placeholder, value]) => result.replaceAll(placeholder, value),
        html,
      );
    },
  };
};
