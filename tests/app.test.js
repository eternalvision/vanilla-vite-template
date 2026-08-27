import { beforeEach, describe, expect, it, vi } from 'vitest';

import { APP_META } from 'virtual:app-meta';

import { about } from '@/templates';

import { applyTranslations, bindEvents, markActiveLanguage, render } from '@/app.js';

/** @type {HTMLElement} */
let root;

const PROPS = { languages: ['en', 'uk'], language: 'en', year: 2026 };

/** @param {string} key */
const translate = (key) => `t:${key}`;

/** Clicks the counter by re-querying it, since the region replaces the node. */
const clickCounter = () =>
  /** @type {HTMLElement | null} */ (root.querySelector('[data-counter]'))?.click();

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

  it('links the footer to the repository from package.json', () => {
    render(root, PROPS);

    const link = root.querySelector('footer a');

    expect(link?.getAttribute('href')).toBe(APP_META.repositoryUrl);
    expect(APP_META.repositoryUrl).toMatch(/^https:\/\//);
  });

  it('credits the author from package.json', () => {
    render(root, PROPS);

    expect(root.querySelector('footer')?.textContent).toContain(APP_META.author);
  });

  it('renders the page content it is given, keeping the shared shell', () => {
    render(root, { ...PROPS, content: about() });

    expect(root.querySelector('[data-i18n="about.title"]')).not.toBeNull();
    expect(root.querySelector('[data-region="demo"]')).toBeNull();
    expect(root.querySelector('header')).not.toBeNull();
    expect(root.querySelector('footer')).not.toBeNull();
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

    // the region is re-rendered, so the button node is replaced between clicks
    clickCounter();
    clickCounter();

    expect(root.querySelector('[data-counter-value]')?.textContent).toBe('2');
  });

  it('keeps focus on the counter across the re-render it triggers', () => {
    render(root, PROPS);
    bindEvents(root, { onLanguageChange: vi.fn() });

    const button = /** @type {HTMLElement} */ (root.querySelector('[data-counter]'));
    button.focus();
    button.click();

    expect(document.activeElement).toBe(root.querySelector('[data-counter]'));
    expect(document.activeElement).not.toBe(button);
  });

  it('re-renders the region on input and keeps the caret where it was', () => {
    render(root, PROPS);
    bindEvents(root, { onLanguageChange: vi.fn() });

    const input = /** @type {HTMLInputElement} */ (root.querySelector('[data-state="name"]'));
    input.focus();
    input.value = 'Ada';
    input.setSelectionRange(2, 2);
    input.dispatchEvent(new Event('input', { bubbles: true }));

    const current = /** @type {HTMLInputElement} */ (root.querySelector('[data-state="name"]'));
    expect(current.value).toBe('Ada');
    expect(document.activeElement).toBe(current);
    expect(current.selectionStart).toBe(2);
  });

  it('translates freshly rendered region markup', () => {
    render(root, PROPS);
    bindEvents(root, { onLanguageChange: vi.fn(), translate: (key) => `t:${key}` });

    clickCounter();

    expect(root.querySelector('[data-i18n="counter.label"]')?.textContent).toBe('t:counter.label');
  });

  it('stops handling input after unsubscribe', () => {
    render(root, PROPS);
    const unbind = bindEvents(root, { onLanguageChange: vi.fn() });

    unbind();
    clickCounter();

    expect(root.querySelector('[data-counter-value]')?.textContent).toBe('0');
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
