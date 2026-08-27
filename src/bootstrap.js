/**
 * Shared page wiring: global styles, the shell, translations, and the language
 * switcher. Every page calls `startApp` with its own content and gets back an
 * `update()` to call whenever its state changes.
 */

import '@/tailwind.css';
import '@/styles/app.css';

import i18next, { SUPPORTED_LANGUAGES } from '@/i18n.js';
import { renderInto, withPreservedView } from '@/lib/dom.js';
import { layout } from '@/templates';

/**
 * @typedef {object} PageContext
 * @property {import('i18next').TFunction} t translate, with interpolation and plurals
 * @property {string} language active language code
 * @property {readonly string[]} languages languages offered by the switcher
 * @property {number} year current year, for the footer
 */

/**
 * Renders a page and keeps it in sync with the active language.
 *
 * @param {(context: PageContext) => import('@/lib/html.js').RawHtml} renderContent
 * @param {{ titleKey?: string }} [options]
 * @returns {{ root: HTMLElement, update: () => void }}
 */
export const startApp = (renderContent, { titleKey = 'app.title' } = {}) => {
  const root = document.getElementById('app');

  if (!root) {
    throw new Error('Mount point "#app" not found in the HTML entry point');
  }

  /** @returns {PageContext} */
  const context = () => ({
    t: i18next.t.bind(i18next),
    language: i18next.resolvedLanguage ?? i18next.language,
    languages: SUPPORTED_LANGUAGES,
    year: new Date().getFullYear(),
  });

  const update = () => {
    const page = context();

    document.documentElement.lang = page.language;
    document.title = page.t(titleKey);

    withPreservedView(root, () => {
      renderInto(root, layout({ ...page, content: renderContent(page) }));
    });
  };

  root.addEventListener('click', (event) => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const button = /** @type {HTMLElement | null} */ (target.closest('[data-language]'));

    if (button?.dataset.language) void i18next.changeLanguage(button.dataset.language);
  });

  i18next.on('languageChanged', update);
  update();

  return { root, update };
};
