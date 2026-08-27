/**
 * i18next setup for the browser.
 *
 * The fallback language is bundled, so the first paint has real text instead of
 * empty elements waiting on a network round trip. Every other language is
 * fetched from `/locales/{{lng}}/{{ns}}.json` on demand.
 *
 * The bundled copy is imported from `public/` on purpose: the same file is both
 * served statically (for the HTTP backend) and inlined (for the first paint).
 * It costs about 0.4 kB gzipped and removes a render-blocking request.
 */

import i18next from 'i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

import fallbackCommon from '../public/locales/en/common.json';

/** Languages shipped with the template. Add a folder under `public/locales` to extend. */
export const SUPPORTED_LANGUAGES = /** @type {const} */ (['en', 'uk', 'ru']);

export const FALLBACK_LANGUAGE = 'en';

export const DEFAULT_NAMESPACE = 'common';

/** @type {Promise<import('i18next').TFunction>} */
export const i18nReady = i18next
  .use(HttpBackend)
  .use(LanguageDetector)
  .init({
    fallbackLng: FALLBACK_LANGUAGE,
    supportedLngs: [...SUPPORTED_LANGUAGES],
    // strips region subtags, so `en-US` resolves to `en`
    load: 'languageOnly',
    ns: [DEFAULT_NAMESPACE],
    defaultNS: DEFAULT_NAMESPACE,
    // noisy in dev, silent in tests
    debug: import.meta.env.DEV && import.meta.env.MODE !== 'test',
    resources: {
      [FALLBACK_LANGUAGE]: { [DEFAULT_NAMESPACE]: fallbackCommon },
    },
    // bundled resources cover the fallback only; the backend still fetches the rest
    partialBundledLanguages: true,
    interpolation: {
      // the DOM is written through textContent, so i18next escaping is redundant
      escapeValue: false,
    },
    backend: {
      loadPath: `${import.meta.env.BASE_URL}locales/{{lng}}/{{ns}}.json`,
    },
    detection: {
      order: ['querystring', 'localStorage', 'cookie', 'navigator'],
      lookupQuerystring: 'lng',
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18next;
