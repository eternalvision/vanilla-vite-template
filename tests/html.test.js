import { describe, expect, it } from 'vitest';

import { escapeHtml, html, raw, RawHtml } from '@/lib/html.js';

describe('escapeHtml', () => {
  it('escapes every character that can break out of markup', () => {
    expect(escapeHtml(`<a href="x" data-y='z'>&</a>`)).toBe(
      '&lt;a href=&quot;x&quot; data-y=&#39;z&#39;&gt;&amp;&lt;/a&gt;',
    );
  });

  it('leaves plain text untouched', () => {
    expect(escapeHtml('plain text 42')).toBe('plain text 42');
  });
});

describe('html', () => {
  it('escapes interpolated values', () => {
    const payload = '<img src=x onerror=alert(1)>';

    expect(html`<p>${payload}</p>`.value).toBe('<p>&lt;img src=x onerror=alert(1)&gt;</p>');
  });

  it('interpolates raw() values verbatim', () => {
    expect(html`<div>${raw('<b>bold</b>')}</div>`.value).toBe('<div><b>bold</b></div>');
  });

  it('joins arrays and nested templates', () => {
    const items = ['a', 'b'].map((item) => html`<li>${item}</li>`);
    // Prettier reformats html`` literals, so compare without insignificant whitespace
    const markup = html`<ul>
      ${items}
    </ul>`.value.replace(/\s+/g, '');

    expect(markup).toBe('<ul><li>a</li><li>b</li></ul>');
  });

  it('renders nullish and false as empty strings', () => {
    expect(html`[${null}${undefined}${false}]`.value).toBe('[]');
  });

  it('keeps zero and empty string, which are valid content', () => {
    expect(html`[${0}${''}]`.value).toBe('[0]');
  });

  it('returns a RawHtml instance so nesting never double-escapes', () => {
    expect(html`<p>x</p>`).toBeInstanceOf(RawHtml);
  });
});
