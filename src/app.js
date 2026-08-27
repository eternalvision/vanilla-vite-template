/**
 * Application wiring: render the layout once, then keep the DOM in sync with
 * the active language. Every export takes its root element explicitly so the
 * whole module is testable in jsdom without touching globals.
 */

import { layout } from '@/templates';

/**
 * Fills elements carrying `data-i18n` (text) and `data-i18n-attr` (attributes,
 * as a comma-separated `attribute:key` list).
 *
 * @param {ParentNode} root
 * @param {(key: string) => string} translate
 * @returns {void}
 */
export const applyTranslations = (root, translate) => {
  root.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = /** @type {HTMLElement} */ (element).dataset.i18n;
    if (key) element.textContent = translate(key);
  });

  root.querySelectorAll('[data-i18n-attr]').forEach((element) => {
    const pairs = /** @type {HTMLElement} */ (element).dataset.i18nAttr ?? '';

    for (const pair of pairs.split(',')) {
      const [attribute, key] = pair.split(':').map((part) => part.trim());
      if (attribute && key) element.setAttribute(attribute, translate(key));
    }
  });
};

/**
 * Marks the active language button. Mirrors what the template renders so the
 * markup never has to be rebuilt on a language change.
 *
 * @param {ParentNode} root
 * @param {string} language
 * @returns {void}
 */
export const markActiveLanguage = (root, language) => {
  root.querySelectorAll('[data-language]').forEach((element) => {
    const code = /** @type {HTMLElement} */ (element).dataset.language;
    element.setAttribute('aria-current', String(code === language));
  });
};

/**
 * Renders the layout into `root`, replacing whatever was there.
 *
 * @param {Element} root
 * @param {{ languages: readonly string[], language: string, year: number }} props
 * @returns {void}
 */
export const render = (root, props) => {
  root.innerHTML = layout(props).value;
};

/**
 * Wires the demo interactions through a single delegated listener.
 *
 * @param {Element} root
 * @param {{ onLanguageChange: (language: string) => void }} handlers
 * @returns {() => void} unsubscribe
 */
export const bindEvents = (root, { onLanguageChange }) => {
  let count = 0;

  /** @param {Event} event */
  const onClick = (event) => {
    const target = /** @type {Element | null} */ (event.target);
    if (!target || !('closest' in target)) return;

    const languageButton = /** @type {HTMLElement | null} */ (target.closest('[data-language]'));
    if (languageButton?.dataset.language) {
      onLanguageChange(languageButton.dataset.language);
      return;
    }

    if (target.closest('[data-counter]')) {
      count += 1;
      const output = root.querySelector('[data-counter-value]');
      if (output) output.textContent = String(count);
    }
  };

  root.addEventListener('click', onClick);

  return () => root.removeEventListener('click', onClick);
};
