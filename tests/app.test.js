import { beforeEach, describe, expect, it, vi } from 'vitest';

import { applyTranslations, bindEvents, markActiveLanguage, render } from '@/app.js';

/** @type {HTMLElement} */
let root;

const PROPS = { languages: ['en', 'uk'], language: 'en', year: 2026 };

/** @param {string} key */
const translate = (key) => `t:${key}`;

beforeEach(() => {
  document.body.innerHTML = '<div id="app"></div>';
  root = /** @type {HTMLElement} */ (document.getElementById('app'));
});

describe('render', () => {
  it('mounts header, main and footer', () => {
    render(root, PROPS);

    expect(root.querySelector('header')).not.toBeNull();
    expect(root.querySelector('main')).not.toBeNull();
    expect(root.querySelector('footer')).not.toBeNull();
  });

  it('renders one button per supported language', () => {
    render(root, PROPS);

    const codes = [...root.querySelectorAll('[data-language]')].map(
      (element) => /** @type {HTMLElement} */ (element).dataset.language,
    );

    expect(codes).toEqual(['en', 'uk']);
  });

  it('replaces previous content instead of appending', () => {
    render(root, PROPS);
    render(root, PROPS);

    expect(root.querySelectorAll('main')).toHaveLength(1);
  });
});

describe('applyTranslations', () => {
  it('fills text for every data-i18n element', () => {
    root.innerHTML = '<h1 data-i18n="hero.title"></h1>';

    applyTranslations(root, translate);

    expect(root.querySelector('h1')?.textContent).toBe('t:hero.title');
  });

  it('fills attributes listed in data-i18n-attr', () => {
    root.innerHTML = '<nav data-i18n-attr="aria-label:nav.languages, title:app.name"></nav>';

    applyTranslations(root, translate);

    const nav = root.querySelector('nav');
    expect(nav?.getAttribute('aria-label')).toBe('t:nav.languages');
    expect(nav?.getAttribute('title')).toBe('t:app.name');
  });

  it('writes through textContent, so a translation cannot inject markup', () => {
    root.innerHTML = '<p data-i18n="x"></p>';

    applyTranslations(root, () => '<script>alert(1)</script>');

    expect(root.querySelector('script')).toBeNull();
    expect(root.querySelector('p')?.textContent).toBe('<script>alert(1)</script>');
  });
});

describe('markActiveLanguage', () => {
  it('marks exactly one button as current', () => {
    render(root, PROPS);

    markActiveLanguage(root, 'uk');

    expect(root.querySelector('[data-language="uk"]')?.getAttribute('aria-current')).toBe('true');
    expect(root.querySelector('[data-language="en"]')?.getAttribute('aria-current')).toBe('false');
  });
});

describe('bindEvents', () => {
  it('reports the clicked language', () => {
    render(root, PROPS);
    const onLanguageChange = vi.fn();
    bindEvents(root, { onLanguageChange });

    /** @type {HTMLElement | null} */ (root.querySelector('[data-language="uk"]'))?.click();

    expect(onLanguageChange).toHaveBeenCalledWith('uk');
  });

  it('increments the counter on each click', () => {
    render(root, PROPS);
    bindEvents(root, { onLanguageChange: vi.fn() });

    const button = /** @type {HTMLElement} */ (root.querySelector('[data-counter]'));
    button.click();
    button.click();

    expect(root.querySelector('[data-counter-value]')?.textContent).toBe('2');
  });

  it('stops handling clicks after unsubscribe', () => {
    render(root, PROPS);
    const onLanguageChange = vi.fn();
    const unbind = bindEvents(root, { onLanguageChange });

    unbind();
    /** @type {HTMLElement | null} */ (root.querySelector('[data-language="uk"]'))?.click();

    expect(onLanguageChange).not.toHaveBeenCalled();
  });
});
