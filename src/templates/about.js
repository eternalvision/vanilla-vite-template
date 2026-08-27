import { html } from '@/lib/html.js';

/**
 * Second page. Its only job is to prove the template is multi-page: a new
 * entry point in `vite.config.js` plus an HTML file, with the shell reused.
 *
 * @returns {import('@/lib/html.js').RawHtml}
 */
export const about = () => html`
  <main class="mx-auto max-w-3xl px-6 py-16">
    <h1 class="text-4xl font-bold tracking-tight text-balance" data-i18n="about.title"></h1>
    <p class="mt-4 text-lg text-slate-600 dark:text-slate-400" data-i18n="about.body"></p>

    <ol
      class="mt-10 space-y-3 border-l border-slate-200 pl-6 text-slate-600
        dark:border-slate-800 dark:text-slate-400">
      <li data-i18n="about.steps.html"></li>
      <li data-i18n="about.steps.entry"></li>
      <li data-i18n="about.steps.input"></li>
    </ol>

    <a
      href="${import.meta.env.BASE_URL}"
      class="mt-10 inline-block underline-offset-4 hover:underline"
      data-i18n="about.back"></a>
  </main>
`;
