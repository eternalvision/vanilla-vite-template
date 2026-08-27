import { html } from '@/lib/html.js';

/**
 * One switcher button.
 *
 * `current` is a string because `false` interpolates as an empty string — see
 * the escaping rules in `src/lib/html.js`.
 *
 * @param {{ code: string, current: 'true' | 'false' }} props
 * @returns {import('@/lib/html.js').RawHtml}
 */
const languageButton = ({ code, current }) => html`
  <button
    type="button"
    data-language="${code}"
    aria-current="${current}"
    class="rounded-md px-2.5 py-1 text-sm font-medium uppercase transition-colors
      aria-[current=true]:bg-slate-900 aria-[current=true]:text-white
      aria-[current=false]:text-slate-500 aria-[current=false]:hover:bg-slate-200
      dark:aria-[current=true]:bg-slate-100 dark:aria-[current=true]:text-slate-900
      dark:aria-[current=false]:text-slate-400 dark:aria-[current=false]:hover:bg-slate-800">
    ${code}
  </button>
`;

/**
 * Language switcher. The active language is marked with `aria-current`, so the
 * state reaches assistive tech and not only the eye.
 *
 * @param {{ t: import('i18next').TFunction, languages: readonly string[], language: string }} props
 * @returns {import('@/lib/html.js').RawHtml}
 */
export const nav = ({ t, languages, language }) => html`
  <nav class="flex items-center gap-1" aria-label="${t('nav.languages')}">
    ${languages.map((code) =>
      languageButton({ code, current: code === language ? 'true' : 'false' }),
    )}
  </nav>
`;
