import { beforeEach, describe, expect, it } from 'vitest';

import { captureFocus, renderInto, restoreFocus, withPreservedView } from '@/lib/dom.js';
import { html } from '@/lib/html.js';

/** @type {HTMLElement} */
let root;

beforeEach(() => {
  document.body.innerHTML = '<div id="app"></div>';
  root = /** @type {HTMLElement} */ (document.getElementById('app'));
});

describe('renderInto', () => {
  it('replaces the contents of the target only', () => {
    root.innerHTML = '<section id="region"><p>old</p></section><footer>kept</footer>';

    renderInto(/** @type {Element} */ (root.querySelector('#region')), html`<p>new</p>`);

    expect(root.querySelector('#region')?.innerHTML).toBe('<p>new</p>');
    expect(root.querySelector('footer')?.textContent).toBe('kept');
  });
});

describe('captureFocus', () => {
  it('returns null when nothing opted in with data-focus-key', () => {
    root.innerHTML = '<button id="plain"></button>';
    /** @type {HTMLElement} */ (root.querySelector('#plain')).focus();

    expect(captureFocus()).toBeNull();
  });

  it('records the key and the caret range of a text field', () => {
    root.innerHTML = '<input data-focus-key="name" value="Ada" />';
    const input = /** @type {HTMLInputElement} */ (root.querySelector('input'));
    input.focus();
    input.setSelectionRange(1, 3);

    expect(captureFocus()).toEqual({ key: 'name', start: 1, end: 3 });
  });

  it('records no caret range for a non-text element', () => {
    root.innerHTML = '<button data-focus-key="go"></button>';
    /** @type {HTMLElement} */ (root.querySelector('button')).focus();

    expect(captureFocus()).toEqual({ key: 'go', start: null, end: null });
  });
});

describe('restoreFocus', () => {
  it('does nothing when there was no captured focus', () => {
    root.innerHTML = '<button data-focus-key="go"></button>';

    restoreFocus(root, null);

    expect(document.activeElement).toBe(document.body);
  });

  it('ignores a key that no longer exists in the DOM', () => {
    root.innerHTML = '<button data-focus-key="other"></button>';

    expect(() => restoreFocus(root, { key: 'gone', start: null, end: null })).not.toThrow();
    expect(document.activeElement).toBe(document.body);
  });

  it('escapes the key, so an attribute-breaking value cannot inject a selector', () => {
    root.innerHTML = '<button data-focus-key="a&quot;]:x"></button>';

    expect(() => restoreFocus(root, { key: 'a"]:x', start: null, end: null })).not.toThrow();
  });
});

describe('withPreservedView', () => {
  it('moves focus onto the replacement node', () => {
    root.innerHTML = '<div id="region"><button data-focus-key="go">a</button></div>';
    const region = /** @type {Element} */ (root.querySelector('#region'));
    const before = root.querySelector('[data-focus-key="go"]');
    /** @type {HTMLElement} */ (before).focus();

    withPreservedView(root, () => {
      renderInto(region, html`<button data-focus-key="go">b</button>`);
    });

    const after = root.querySelector('[data-focus-key="go"]');
    expect(after).not.toBe(before);
    expect(document.activeElement).toBe(after);
  });

  it('runs the update even when nothing was focused', () => {
    root.innerHTML = '<div id="region">old</div>';

    withPreservedView(root, () => {
      renderInto(/** @type {Element} */ (root.querySelector('#region')), html`new`);
    });

    expect(root.querySelector('#region')?.textContent).toBe('new');
  });
});
