#!/usr/bin/env node
/**
 * Propagates project identity from package.json into the files that cannot read
 * it at runtime: LICENSE and public/site.webmanifest.
 *
 * Usage:
 *   node scripts/syncMeta.js          rewrite the files
 *   node scripts/syncMeta.js --check  fail if they are out of date (used by CI)
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { applyLicenseHolder, applyManifestMeta, readAppMeta } from '../conf/appMeta.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const meta = readAppMeta(root);
const isCheck = process.argv.includes('--check');

/** @type {{ path: string, current: string, next: string }[]} */
const targets = [];

const licensePath = new URL('../LICENSE', import.meta.url);
const licenseText = readFileSync(licensePath, 'utf8');
targets.push({
  path: 'LICENSE',
  current: licenseText,
  next: applyLicenseHolder(licenseText, meta.author),
});

const manifestPath = new URL('../public/site.webmanifest', import.meta.url);
const manifestText = readFileSync(manifestPath, 'utf8');
targets.push({
  path: 'public/site.webmanifest',
  current: manifestText,
  next: `${JSON.stringify(applyManifestMeta(JSON.parse(manifestText), meta), null, 2)}\n`,
});

const stale = targets.filter(({ current, next }) => current !== next);

if (isCheck) {
  if (stale.length > 0) {
    console.error(
      `Out of sync with package.json: ${stale.map(({ path }) => path).join(', ')}\n` +
        'Run `npm run sync:meta` and commit the result.',
    );
    process.exit(1);
  }

  console.log('LICENSE and site.webmanifest match package.json.');
} else {
  for (const { path, next } of stale) {
    writeFileSync(new URL(`../${path}`, import.meta.url), next);
    console.log(`updated ${path}`);
  }

  if (stale.length === 0) console.log('Already in sync with package.json.');
}
