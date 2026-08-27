/**
 * Single source of truth for project identity: everything a fork has to change
 * lives in `package.json`, and the rest of the project reads it from here.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * @typedef {object} AppMeta
 * @property {string} name package name, used as the visible app name
 * @property {string} description one-line description used for meta tags
 * @property {string} author copyright holder
 * @property {string} repositoryUrl browsable repository URL, or an empty string
 * @property {string} license SPDX identifier
 */

/**
 * Turns any of the shorthands npm accepts in `repository` into a URL a browser
 * can open. Returns an empty string when there is nothing usable.
 *
 * @param {unknown} repository value of the `repository` field
 * @returns {string}
 */
export const normalizeRepositoryUrl = (repository) => {
  const raw =
    typeof repository === 'string'
      ? repository
      : typeof repository === 'object' && repository !== null && 'url' in repository
        ? String(/** @type {{ url: unknown }} */ (repository).url)
        : '';

  if (!raw) return '';

  // git@github.com:owner/repo.git
  const sshMatch = raw.match(/^git@([^:]+):(.+)$/);
  const url = sshMatch ? `https://${sshMatch[1]}/${sshMatch[2]}` : raw;

  return url
    .replace(/^git\+/, '')
    .replace(/^git:\/\//, 'https://')
    .replace(/\.git$/, '');
};

/**
 * Reads the author name out of the string or object form npm allows.
 *
 * @param {unknown} author value of the `author` field
 * @returns {string}
 */
export const normalizeAuthor = (author) => {
  if (typeof author === 'string') return author.replace(/\s*[<(].*$/, '').trim();
  if (typeof author === 'object' && author !== null && 'name' in author) {
    return String(/** @type {{ name: unknown }} */ (author).name);
  }

  return '';
};

/**
 * @param {Record<string, unknown>} pkg parsed package.json
 * @returns {AppMeta}
 */
export const createAppMeta = (pkg) => ({
  name: String(pkg.name ?? ''),
  description: String(pkg.description ?? ''),
  author: normalizeAuthor(pkg.author),
  repositoryUrl: normalizeRepositoryUrl(pkg.repository),
  license: String(pkg.license ?? ''),
});

/**
 * @param {string} rootDir directory holding package.json
 * @returns {AppMeta}
 */
export const readAppMeta = (rootDir) =>
  createAppMeta(JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8')));

/**
 * Rewrites the copyright holder in an MIT-style licence, leaving the year (or
 * year range) untouched — the start year is a fact about the project, not
 * something to regenerate.
 *
 * @param {string} licenseText
 * @param {string} holder
 * @returns {string}
 */
export const applyLicenseHolder = (licenseText, holder) =>
  licenseText.replace(
    /^(Copyright \(c\) )([0-9]{4}(?:\s*[-–]\s*[0-9]{4})?)(\s+).*$/m,
    (_match, prefix, years, gap) => `${prefix}${years}${gap}${holder}`,
  );

/**
 * Applies project identity to a web app manifest. Only `name` and `description`
 * are derived — icons, colours, display mode and `short_name` (which has its own
 * length constraints) stay whatever the project set.
 *
 * @param {Record<string, unknown>} manifest
 * @param {AppMeta} meta
 * @returns {Record<string, unknown>}
 */
export const applyManifestMeta = (manifest, meta) => ({
  ...manifest,
  name: meta.name,
  description: meta.description,
});
