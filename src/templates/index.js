import { html } from '@/lib/html.js';
import { header } from './header.js';
import { main } from './main.js';
import { footer } from './footer.js';

export { header, main, footer };
export { demo } from './main.js';
export { nav } from './nav.js';

export { about } from './about.js';

/**
 * Page shell shared by every entry point. Kept as a pure function of its props
 * so it can be rendered and asserted on in tests without a browser.
 *
 * @param {{
 *   languages: readonly string[],
 *   language: string,
 *   year: number,
 *   content?: import('@/lib/html.js').RawHtml,
 * }} props
 * @returns {import('@/lib/html.js').RawHtml}
 */
export const layout = ({ languages, language, year, content = main() }) => html`
  ${header({ languages, language })}${content}${footer({ year })}
`;
