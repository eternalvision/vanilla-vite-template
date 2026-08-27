import { describe, expect, it } from 'vitest';

import i18next, { FALLBACK_LANGUAGE, SUPPORTED_LANGUAGES } from '@/i18n.js';

describe('i18n', () => {
  it('is initialized synchronously, because the fallback language is bundled', () => {
    // this is what removes the flash of untranslated markup on first paint
    expect(i18next.isInitialized).toBe(true);
  });

  it('resolves fallback keys without a network round trip', () => {
    expect(i18next.t('hero.title')).not.toBe('hero.title');
    expect(i18next.t('app.name')).toBe('vanilla-vite-template');
  });

  it('returns the key itself for something that does not exist', () => {
    expect(i18next.t('nope.missing')).toBe('nope.missing');
  });

  it('declares the fallback among the supported languages', () => {
    expect(SUPPORTED_LANGUAGES).toContain(FALLBACK_LANGUAGE);
  });
});
