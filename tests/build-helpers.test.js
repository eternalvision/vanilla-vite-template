import { describe, expect, it } from 'vitest';

import { assetFileNamer, chunkSplitter } from '../conf/index.js';

describe('assetFileNamer', () => {
  it.each([
    ['styles/index.css', 'styles/'],
    ['logo.svg', 'icons/'],
    ['photo.WEBP', 'images/'],
    ['inter.woff2', 'fonts/'],
    ['data.bin', 'assets/'],
  ])('routes %s into %s', (name, expected) => {
    expect(assetFileNamer({ names: [name] })).toMatch(new RegExp(`^${expected}`));
  });

  it('falls back to assets/ when the bundler emits no name', () => {
    expect(assetFileNamer({})).toMatch(/^assets\//);
  });
});

describe('chunkSplitter', () => {
  it('puts third-party modules into one vendor chunk', () => {
    expect(chunkSplitter('/repo/node_modules/i18next/dist/esm/i18next.js')).toBe('vendor');
  });

  it('leaves application modules to the bundler', () => {
    expect(chunkSplitter('/repo/src/app.js')).toBeUndefined();
  });
});
