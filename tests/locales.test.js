import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { FALLBACK_LANGUAGE, SUPPORTED_LANGUAGES } from '@/i18n.js';

// jsdom rewrites import.meta.url to an http URL, so resolve from the project root
const localesDir = join(process.cwd(), 'public', 'locales');

/** i18next appends these to a key to select a plural form; they differ per language. */
const PLURAL_SUFFIX = /_(zero|one|two|few|many|other)$/;

/**
 * @param {Record<string, unknown>} value
 * @param {string} [prefix]
 * @returns {Set<string>}
 */
const collectKeys = (value, prefix = '') => {
  const keys = new Set();

  for (const [key, child] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;

    if (child && typeof child === 'object') {
      for (const nested of collectKeys(/** @type {Record<string, unknown>} */ (child), path)) {
        keys.add(nested);
      }
    } else {
      keys.add(path.replace(PLURAL_SUFFIX, ''));
    }
  }

  return keys;
};

/** @param {string} language */
const readCommon = (language) =>
  JSON.parse(readFileSync(`${localesDir}/${language}/common.json`, 'utf8'));

const languages = readdirSync(localesDir);
const reference = collectKeys(readCommon(FALLBACK_LANGUAGE));

describe('locales', () => {
  it('ships a folder for every supported language, and nothing else', () => {
    expect(languages.toSorted()).toEqual([...SUPPORTED_LANGUAGES].toSorted());
  });

  it.each(languages)('%s defines exactly the keys the fallback defines', (language) => {
    const keys = collectKeys(readCommon(language));

    // an untranslated key silently falls back to English, which looks like a
    // forgotten translation months later — fail here instead
    expect({ missing: [...reference].filter((key) => !keys.has(key)).toSorted() }).toEqual({
      missing: [],
    });
    expect({ unused: [...keys].filter((key) => !reference.has(key)).toSorted() }).toEqual({
      unused: [],
    });
  });

  it.each(languages)('%s leaves no value empty', (language) => {
    const flat = JSON.stringify(readCommon(language));

    expect(flat).not.toMatch(/""\s*[,}]/);
  });
});
