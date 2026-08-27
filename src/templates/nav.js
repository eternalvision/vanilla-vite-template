import { html } from '@/lib/html.js';

/**
 * Language switcher. The active language is marked with `aria-current` so the
 * state is exposed to assistive tech, not only through colour.
 *
 * @param {{ languages: readonly string[], language: string }} props
 * @returns {import('@/lib/html.js').RawHtml}
 */
export const nav = ({ languages, language }) => html`
  <nav class="flex items-center gap-1" data-i18n-attr="aria-label:nav.languages">
    ${languages.map(
      (code) => html`
        <button
          type="button"
          data-language="${code}"
          aria-current="${code === language ? 'true' : 'false'}"
          class="rounded-md px-2.5 py-1 text-sm font-medium uppercase transition-colors
            aria-[current=true]:bg-slate-900 aria-[current=true]:text-white
            aria-[current=false]:text-slate-500 aria-[current=false]:hover:bg-slate-200
            dark:aria-[current=true]:bg-slate-100 dark:aria-[current=true]:text-slate-900
            dark:aria-[current=false]:text-slate-400 dark:aria-[current=false]:hover:bg-slate-800">
          ${code}
        </button>
      `,
    )}
  </nav>
`;
