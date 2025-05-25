/*
 * i18next configuration for browser environment:
 * 1. uses HttpBackend to load translation files from `/locales/{{lng}}/{{ns}}.json`
 * 2. detects user language via querystring, localStorage, cookies, or browser settings
 * 3. caches detected language in localStorage and cookies
 * 4. falls back to English ('en') when no translation is available
 * 5. enables debug mode to assist during development
 */

import i18next from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18next
  .use(Backend)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    ns: ['common'],
    debug: true,
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['querystring', 'localStorage', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18next;
