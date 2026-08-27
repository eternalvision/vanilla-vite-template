import { APP_META } from 'virtual:app-meta';

import { html } from '@/lib/html.js';

/**
 * @param {{ year: number }} props
 * @returns {import('@/lib/html.js').RawHtml}
 */
export const footer = ({ year }) => html`
  <footer class="border-t border-slate-200 dark:border-slate-800">
    <div
      class="mx-auto flex max-w-3xl flex-col items-center gap-1 px-6 py-8 text-sm
        text-slate-500 sm:flex-row sm:justify-between">
      <p>&copy; ${year} ${APP_META.author}</p>
      ${
        APP_META.repositoryUrl &&
        html`
          <a
            href="${APP_META.repositoryUrl}"
            rel="noopener noreferrer"
            target="_blank"
            class="underline-offset-4 hover:underline"
            data-i18n="footer.source"></a>
        `
      }
    </div>
  </footer>
`;
