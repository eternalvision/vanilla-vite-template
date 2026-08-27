import { html } from '@/lib/html.js';
import { header } from './header.js';
import { footer } from './footer.js';

export { about } from './about.js';
export { home } from './home.js';
export { header } from './header.js';
export { nav } from './nav.js';
export { footer } from './footer.js';

/**
 * Page shell shared by every entry point. A pure function of its props, so a
 * test can render it and assert on the markup directly.
 *
 * @param {{
 *   t: import('i18next').TFunction,
 *   languages: readonly string[],
 *   language: string,
 *   year: number,
 *   content: import('@/lib/html.js').RawHtml,
 * }} props
 * @returns {import('@/lib/html.js').RawHtml}
 */
export const layout = ({ t, languages, language, year, content }) => html`
  ${header({ t, languages, language })}${content}${footer({ t, year })}
`;
