import { html } from '@/lib/html.js';
import { nav } from './nav.js';

/**
 * @param {{ languages: readonly string[], language: string }} props
 * @returns {import('@/lib/html.js').RawHtml}
 */
export const header = ({ languages, language }) => html`
  <header
    class="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur
      dark:border-slate-800 dark:bg-slate-950/80">
    <div class="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4">
      <a href="${import.meta.env.BASE_URL}" class="flex items-center gap-2">
        <img src="${import.meta.env.BASE_URL}logo.svg" alt="" width="28" height="28" />
        <span
          class="text-sm font-semibold tracking-tight whitespace-nowrap sm:text-base"
          data-i18n="app.name"></span>
      </a>
      ${nav({ languages, language })}
    </div>
  </header>
`;
