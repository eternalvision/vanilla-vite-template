import { describe, expect, it } from 'vitest';

import { about, home, layout } from '@/templates';

/** Stand-in for i18next: echoes the key, plus any interpolation values. */
const t = /** @type {import('i18next').TFunction} */ (
  /** @type {unknown} */ (
    (/** @type {string} */ key, /** @type {Record<string, unknown>} */ options) =>
      options ? `${key}(${Object.values(options).join(',')})` : key
  )
);

const SHELL = { t, languages: ['en', 'uk'], language: 'en', year: 2026 };

describe('layout', () => {
  it('wraps the given content in the shared shell', () => {
    const markup = layout({ ...SHELL, content: about({ t }) }).value;

    expect(markup).toContain('<header');
    expect(markup).toContain('<footer');
    expect(markup).toContain('about.title');
    expect(markup).not.toContain('hero.title');
  });

  it('marks the active language and only that one', () => {
    const markup = layout({ ...SHELL, language: 'uk', content: about({ t }) }).value;

    expect(markup).toMatch(/data-language="uk"\s+aria-current="true"/);
    expect(markup).toMatch(/data-language="en"\s+aria-current="false"/);
  });
});

describe('home', () => {
  it('renders the state it is given', () => {
    const markup = home({ t, state: { name: 'Ada', count: 3 } }).value;

    expect(markup).toContain('value="Ada"');
    expect(markup).toContain('demo.greeting(Ada)');
    expect(markup).toContain('demo.clicks(3)');
  });

  it('escapes state, so a name cannot inject markup', () => {
    const markup = home({ t, state: { name: '"><img src=x onerror=alert(1)>', count: 0 } }).value;

    expect(markup).not.toContain('<img src=x');
    expect(markup).toContain('&quot;&gt;&lt;img');
  });

  it('shows a placeholder instead of an empty greeting', () => {
    expect(home({ t, state: { name: '', count: 0 } }).value).toContain('demo.greeting(…)');
  });
});
