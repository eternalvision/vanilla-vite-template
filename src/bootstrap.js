/**
 * Shared entry-point wiring: global styles, the page shell, translations, and
 * the delegated event listeners. Each HTML entry point supplies its own content
 * and calls `startApp` — see `src/main.js` and `src/about.js`.
 */

import '@/tailwind.css';
import '@/styles/app.css';

import i18next, { i18nReady, SUPPORTED_LANGUAGES } from '@/i18n.js';
import { applyTranslations, bindEvents, markActiveLanguage, render } from '@/app.js';

/**
 * @param {import('@/lib/html.js').RawHtml} content page body between header and footer
 * @param {{ titleKey?: string }} [options]
 * @returns {void}
 */
export const startApp = (content, { titleKey = 'app.title' } = {}) => {
  const root = document.getElementById('app');

  if (!root) {
    throw new Error('Mount point "#app" not found in the HTML entry point');
  }

  render(root, {
    languages: SUPPORTED_LANGUAGES,
    language: i18next.resolvedLanguage ?? i18next.language,
    year: new Date().getFullYear(),
    content,
  });

  bindEvents(root, {
    onLanguageChange: (language) => {
      void i18next.changeLanguage(language);
    },
    translate: (key) => i18next.t(key),
  });

  const syncLanguage = () => {
    const language = i18next.resolvedLanguage ?? i18next.language;

    document.documentElement.lang = language;
    document.title = i18next.t(titleKey);

    applyTranslations(root, (key) => i18next.t(key));
    markActiveLanguage(root, language);
  };

  i18next.on('languageChanged', syncLanguage);

  // the fallback language is bundled, so this usually paints text immediately
  if (i18next.isInitialized) syncLanguage();
  void i18nReady.then(syncLanguage);
};
