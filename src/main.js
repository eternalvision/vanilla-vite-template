/**
 * Entry point: loads global styles, renders the layout into `#app`, and keeps
 * it translated as the language changes.
 */

import '@/tailwind.css';
import '@/sass/styles.scss';

import i18next, { i18nReady, SUPPORTED_LANGUAGES } from '@/i18n.js';
import { applyTranslations, bindEvents, markActiveLanguage, render } from '@/app.js';

const root = document.getElementById('app');

if (!root) {
  throw new Error('Mount point "#app" not found in index.html');
}

render(root, {
  languages: SUPPORTED_LANGUAGES,
  language: i18next.resolvedLanguage ?? i18next.language,
  year: new Date().getFullYear(),
});

bindEvents(root, {
  onLanguageChange: (language) => {
    void i18next.changeLanguage(language);
  },
});

const syncLanguage = () => {
  const language = i18next.resolvedLanguage ?? i18next.language;

  document.documentElement.lang = language;
  document.title = i18next.t('app.title');

  applyTranslations(root, (key) => i18next.t(key));
  markActiveLanguage(root, language);
};

i18next.on('languageChanged', syncLanguage);
void i18nReady.then(syncLanguage);
