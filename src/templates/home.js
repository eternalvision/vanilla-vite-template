import { html } from '@/lib/html.js';

/**
 * Feature cards. Each id maps to a `features.<id>.*` key in the locale files.
 *
 * @type {readonly string[]}
 */
const FEATURE_IDS = ['build', 'styles', 'i18n', 'quality'];

/**
 * @typedef {object} HomeState
 * @property {string} name
 * @property {number} count
 */

/**
 * Home page. Everything it shows comes from its arguments, so rendering it in a
 * test needs no browser and no globals.
 *
 * @param {{ t: import('i18next').TFunction, state: HomeState }} props
 * @returns {import('@/lib/html.js').RawHtml}
 */
export const home = ({ t, state }) => html`
  <main class="mx-auto max-w-3xl px-6 py-16">
    <section class="text-center">
      <h1 class="text-4xl font-bold tracking-tight text-balance sm:text-5xl">${t('hero.title')}</h1>
      <p class="mx-auto mt-4 max-w-xl text-lg text-slate-600 dark:text-slate-400">
        ${t('hero.subtitle')}
      </p>
    </section>

    <section class="mt-14 grid gap-4 sm:grid-cols-2">
      ${FEATURE_IDS.map(
        (id) => html`
          <article
            class="rounded-xl border border-slate-200 p-5 transition-colors
              hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700">
            <h2 class="font-semibold">${t(`features.${id}.title`)}</h2>
            <p class="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
              ${t(`features.${id}.body`)}
            </p>
          </article>
        `,
      )}
    </section>

    <section
      class="mt-14 flex flex-col items-center gap-3 rounded-xl bg-slate-100 p-8 text-center
        dark:bg-slate-900">
      <p class="text-sm text-slate-600 dark:text-slate-400">${t('demo.hint')}</p>

      <input
        type="text"
        data-field="name"
        data-focus-key="name"
        value="${state.name}"
        autocomplete="off"
        spellcheck="false"
        placeholder="${t('demo.label')}"
        aria-label="${t('demo.label')}"
        class="w-full max-w-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-center
          dark:border-slate-700 dark:bg-slate-950" />

      <p class="text-lg font-medium">${t('demo.greeting', { name: state.name || '…' })}</p>

      <button
        type="button"
        data-action="increment"
        data-focus-key="counter"
        class="rounded-lg bg-slate-900 px-5 py-2.5 font-medium text-white transition-transform
          hover:scale-105 active:scale-95 dark:bg-slate-100 dark:text-slate-900">
        ${t('demo.clicks', { count: state.count })}
      </button>
    </section>
  </main>
`;
