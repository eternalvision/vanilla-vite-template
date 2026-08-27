import { html } from '@/lib/html.js';

/**
 * Feature cards. Each entry maps to a `features.<id>.*` key in the locale files.
 *
 * @type {readonly string[]}
 */
const FEATURE_IDS = ['build', 'styles', 'i18n', 'quality'];

/**
 * @typedef {object} DemoState
 * @property {string} name
 * @property {number} count
 */

/**
 * The one region of the page that owns state. It is re-rendered wholesale on
 * every change — cheap, and correct as long as focus is preserved around it
 * (see `src/lib/dom.js`).
 *
 * @param {DemoState} state
 * @returns {import('@/lib/html.js').RawHtml}
 */
export const demo = ({ name, count }) => html`
  <p class="text-sm text-slate-600 dark:text-slate-400" data-i18n="demo.hint"></p>

  <input
    type="text"
    data-focus-key="name"
    data-state="name"
    value="${name}"
    autocomplete="off"
    spellcheck="false"
    data-i18n-attr="placeholder:demo.label, aria-label:demo.label"
    class="w-full max-w-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-center
      dark:border-slate-700 dark:bg-slate-950" />

  <p class="text-lg font-medium">
    <span data-i18n="demo.greeting"></span>
    <span>${name || '…'}</span>
  </p>

  <button
    type="button"
    data-counter
    data-focus-key="counter"
    class="rounded-lg bg-slate-900 px-5 py-2.5 font-medium text-white transition-transform
      hover:scale-105 active:scale-95 dark:bg-slate-100 dark:text-slate-900">
    <span data-i18n="counter.label"></span>
    <span data-counter-value class="tabular-nums">${count}</span>
  </button>
`;

/**
 * @param {{ demoState?: DemoState }} [props]
 * @returns {import('@/lib/html.js').RawHtml}
 */
export const main = ({ demoState = { name: '', count: 0 } } = {}) => html`
  <main class="mx-auto max-w-3xl px-6 py-16">
    <section class="text-center">
      <h1
        class="text-4xl font-bold tracking-tight text-balance sm:text-5xl"
        data-i18n="hero.title"></h1>
      <p
        class="mx-auto mt-4 max-w-xl text-lg text-slate-600 dark:text-slate-400"
        data-i18n="hero.subtitle"></p>
    </section>

    <section class="mt-14 grid gap-4 sm:grid-cols-2">
      ${FEATURE_IDS.map(
        (id) => html`
          <article
            class="rounded-xl border border-slate-200 p-5 transition-colors
              hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700">
            <h2 class="font-semibold" data-i18n="features.${id}.title"></h2>
            <p
              class="mt-1.5 text-sm text-slate-600 dark:text-slate-400"
              data-i18n="features.${id}.body"></p>
          </article>
        `,
      )}
    </section>

    <section
      data-region="demo"
      class="mt-14 flex flex-col items-center gap-3 rounded-xl bg-slate-100 p-8 text-center
        dark:bg-slate-900">
      ${demo(demoState)}
    </section>
  </main>
`;
