import { describe, expect, it } from 'vitest';

import { normalizeBasePath } from '../conf/basePath.js';

describe('normalizeBasePath', () => {
  it.each([
    ['my-repo', '/my-repo/'],
    ['/my-repo', '/my-repo/'],
    ['my-repo/', '/my-repo/'],
    ['/my-repo/', '/my-repo/'],
    ['/nested/path/', '/nested/path/'],
    ['  spaced  ', '/spaced/'],
  ])('normalizes %s to %s', (input, expected) => {
    expect(normalizeBasePath(input)).toBe(expected);
  });

  it.each([undefined, '', '   ', '/'])('falls back to the root for %s', (input) => {
    expect(normalizeBasePath(input)).toBe('/');
  });

  it('always yields a value that can be concatenated with a relative path', () => {
    expect(`${normalizeBasePath('repo')}logo.svg`).toBe('/repo/logo.svg');
    expect(`${normalizeBasePath(undefined)}logo.svg`).toBe('/logo.svg');
  });
});
