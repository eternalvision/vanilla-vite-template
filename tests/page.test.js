import { beforeEach, describe, expect, it, vi } from 'vitest';

import i18next from '@/i18n.js';
import { startApp } from '@/bootstrap.js';
import { home } from '@/templates';

/** @type {import('@/templates/home.js').HomeState} */
let state;

/** @returns {{ root: HTMLElement, update: () => void }} */
const start = () => startApp(({ t }) => home({ t, state }));

beforeEach(() => {
  document.body.innerHTML = '<div id="app"></div>';
  state = { name: '', count: 0 };
});

describe('startApp', () => {
  it('refuses to start without a mount point', () => {
    document.body.innerHTML = '';

    expect(() => start()).toThrow(/#app/);
  });

  it('renders the shell and the page on the first call', () => {
    const { root } = start();

    expect(root.querySelector('header')).not.toBeNull();
    expect(root.querySelector('main')).not.toBeNull();
    expect(root.querySelector('footer')).not.toBeNull();
  });

  it('translates through the bundled fallback, not through key strings', () => {
    const { root } = start();

    expect(root.querySelector('h1')?.textContent?.trim()).toBe(
      'A Vite starter without the framework tax',
    );
  });

  it('reflects state changes on update()', () => {
    const app = start();

    state.count = 2;
    app.update();

    expect(app.root.querySelector('[data-action="increment"]')?.textContent?.trim()).toBe(
      '2 clicks',
    );
  });

  it('keeps focus, caret and scroll position across an update', () => {
    const app = start();
    const field = /** @type {HTMLInputElement} */ (app.root.querySelector('[data-field="name"]'));

    field.focus();
    state.name = 'Ada';
    app.update();
    const restored = /** @type {HTMLInputElement} */ (
      app.root.querySelector('[data-field="name"]')
    );
    restored.setSelectionRange(2, 2);

    state.name = 'Adam';
    app.update();

    const current = /** @type {HTMLInputElement} */ (app.root.querySelector('[data-field="name"]'));
    expect(current).not.toBe(restored);
    expect(document.activeElement).toBe(current);
    expect(current.selectionStart).toBe(2);
  });

  it('asks i18next to switch language when a switcher button is clicked', () => {
    const changeLanguage = vi.spyOn(i18next, 'changeLanguage').mockResolvedValue(i18next.t);
    const { root } = start();

    /** @type {HTMLElement | null} */ (root.querySelector('[data-language="uk"]'))?.click();

    expect(changeLanguage).toHaveBeenCalledWith('uk');
    changeLanguage.mockRestore();
  });

  it('sets the document language and title', () => {
    start();

    expect(document.documentElement.lang).toBe('en');
    expect(document.title).toBe('vanilla-vite-template — a lightweight Vite starter');
  });
});
