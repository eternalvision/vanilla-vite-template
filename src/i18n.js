/**
 * i18next setup for the browser.
 *
 * - loads namespaces over HTTP from `/locales/{{lng}}/{{ns}}.json`
 * - detects the language from querystring, localStorage, cookie, then navigator
 * - debug output is enabled in dev only
 */

import i18next from 'i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

/** Languages shipped with the template. Add a folder under `public/locales` to extend. */
export const SUPPORTED_LANGUAGES = /** @type {const} */ (['en', 'uk', 'ru']);

export const FALLBACK_LANGUAGE = 'en';

/** @type {Promise<import('i18next').TFunction>} */
export const i18nReady = i18next
  .use(HttpBackend)
  .use(LanguageDetector)
  .init({
    fallbackLng: FALLBACK_LANGUAGE,
    supportedLngs: [...SUPPORTED_LANGUAGES],
    // strips region subtags, so `en-US` resolves to `en`
    load: 'languageOnly',
    ns: ['common'],
    defaultNS: 'common',
    debug: import.meta.env.DEV,
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
