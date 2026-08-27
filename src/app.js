/**
 * Application wiring: render the layout once, then keep the DOM in sync with
 * the active language. Every export takes its root element explicitly so the
 * whole module is testable in jsdom without touching globals.
 */

import { renderInto, withPreservedFocus } from '@/lib/dom.js';
import { demo, layout } from '@/templates';

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
 * @param {{
 *   languages: readonly string[],
 *   language: string,
 *   year: number,
 *   content?: import('@/lib/html.js').RawHtml,
 * }} props
 * @returns {void}
 */
export const render = (root, props) => {
  root.innerHTML = layout(props).value;
};

/**
 * Wires the demo interactions through delegated listeners on the root, so no
 * handler has to be rebound when the stateful region re-renders.
 *
 * @param {Element} root
 * @param {{
 *   onLanguageChange: (language: string) => void,
 *   translate?: (key: string) => string,
 * }} handlers
 * @returns {() => void} unsubscribe
 */
export const bindEvents = (root, { onLanguageChange, translate = (key) => key }) => {
  /** @type {import('@/templates/main.js').DemoState} */
  const state = { name: '', count: 0 };

  const updateDemoRegion = () => {
    const region = root.querySelector('[data-region="demo"]');

    if (!region) return;

    withPreservedFocus(root, () => {
      renderInto(region, demo(state));
      applyTranslations(region, translate);
    });
  };

  /** @param {Event} event */
  const onClick = (event) => {
    const target = /** @type {Element | null} */ (event.target);
    if (!(target instanceof Element)) return;

    const languageButton = /** @type {HTMLElement | null} */ (target.closest('[data-language]'));
    if (languageButton?.dataset.language) {
      onLanguageChange(languageButton.dataset.language);
      return;
    }

    if (target.closest('[data-counter]')) {
      state.count += 1;
      updateDemoRegion();
    }
  };

  /** @param {Event} event */
  const onInput = (event) => {
    const target = event.target;

    if (!(target instanceof HTMLInputElement) || target.dataset.state !== 'name') return;

    state.name = target.value;
    updateDemoRegion();
  };

  root.addEventListener('click', onClick);
  root.addEventListener('input', onInput);

  return () => {
    root.removeEventListener('click', onClick);
    root.removeEventListener('input', onInput);
  };
};
