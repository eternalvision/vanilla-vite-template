import { html } from '@/lib/html.js';

/**
 * Second page. Its only job is to prove the template is multi-page: an HTML
 * file plus an entry module, with the shell reused and no config to edit.
 *
 * @param {{ t: import('i18next').TFunction }} props
 * @returns {import('@/lib/html.js').RawHtml}
 */
export const about = ({ t }) => html`
  <main class="mx-auto max-w-3xl px-6 py-16">
    <h1 class="text-4xl font-bold tracking-tight text-balance">${t('about.title')}</h1>
    <p class="mt-4 text-lg text-slate-600 dark:text-slate-400">${t('about.body')}</p>

    <ol
      class="mt-10 space-y-3 border-l border-slate-200 pl-6 text-slate-600
        dark:border-slate-800 dark:text-slate-400">
      <li>${t('about.steps.html')}</li>
      <li>${t('about.steps.entry')}</li>
    </ol>

    <a
      href="${import.meta.env.BASE_URL}"
      class="mt-10 inline-block underline-offset-4 hover:underline">
      ${t('about.back')}
    </a>
  </main>
`;
