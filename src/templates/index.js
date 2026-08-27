import { html } from '@/lib/html.js';
import { header } from './header.js';
import { main } from './main.js';
import { footer } from './footer.js';

export { header, main, footer };
export { nav } from './nav.js';

/**
 * Full page layout. Kept as a pure function of its props so it can be rendered
 * and asserted on in tests without a browser.
 *
 * @param {{ languages: readonly string[], language: string, year: number }} props
 * @returns {import('@/lib/html.js').RawHtml}
 */
export const layout = ({ languages, language, year }) => html`
  ${header({ languages, language })}${main()}${footer({ year })}
`;
