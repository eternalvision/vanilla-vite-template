/**
 * Discovers the project's HTML pages so adding one never means editing the
 * build config: drop `blog.html` next to `index.html` and it is a page.
 */

import { readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Turns a list of file names into Rollup's input map.
 *
 * @param {readonly string[]} fileNames
 * @param {string} rootDir absolute path the names are relative to
 * @returns {Record<string, string>} entry name to absolute path
 */
export const toEntryMap = (fileNames, rootDir) =>
  Object.fromEntries(
    fileNames
      .filter((name) => name.endsWith('.html'))
      .sort()
      .map((name) => [name.slice(0, -'.html'.length), join(rootDir, name)]),
  );

/**
 * Every `*.html` file in the project root, as a Rollup input map.
 *
 * @param {string} rootDir
 * @returns {Record<string, string>}
 */
export const findHtmlEntries = (rootDir) =>
  toEntryMap(
    readdirSync(rootDir, { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name),
    rootDir,
  );
