import { describe, expect, it } from 'vitest';

import {
  applyLicenseHolder,
  applyManifestMeta,
  createAppMeta,
  normalizeAuthor,
  normalizeRepositoryUrl,
} from '../conf/appMeta.js';

describe('normalizeRepositoryUrl', () => {
  it.each([
    ['git+https://github.com/owner/repo.git', 'https://github.com/owner/repo'],
    ['https://github.com/owner/repo', 'https://github.com/owner/repo'],
    ['git://github.com/owner/repo.git', 'https://github.com/owner/repo'],
    ['git@github.com:owner/repo.git', 'https://github.com/owner/repo'],
  ])('normalizes %s', (input, expected) => {
    expect(normalizeRepositoryUrl(input)).toBe(expected);
  });

  it('reads the object form npm allows', () => {
    expect(normalizeRepositoryUrl({ type: 'git', url: 'git+https://example.com/a/b.git' })).toBe(
      'https://example.com/a/b',
    );
  });

  it('returns an empty string when there is no repository', () => {
    expect(normalizeRepositoryUrl(undefined)).toBe('');
    expect(normalizeRepositoryUrl({})).toBe('');
  });
});

describe('normalizeAuthor', () => {
  it('strips the email and url from the string form', () => {
    expect(normalizeAuthor('Ada Lovelace <ada@example.com> (https://example.com)')).toBe(
      'Ada Lovelace',
    );
  });

  it('reads the object form', () => {
    expect(normalizeAuthor({ name: 'Ada Lovelace', email: 'ada@example.com' })).toBe(
      'Ada Lovelace',
    );
  });

  it('returns an empty string when absent', () => {
    expect(normalizeAuthor(undefined)).toBe('');
  });
});

describe('createAppMeta', () => {
  it('collects every field a fork has to change', () => {
    expect(
      createAppMeta({
        name: 'my-app',
        description: 'Does things',
        author: 'Ada Lovelace <ada@example.com>',
        repository: 'git+https://github.com/ada/my-app.git',
        license: 'MIT',
      }),
    ).toEqual({
      name: 'my-app',
      description: 'Does things',
      author: 'Ada Lovelace',
      repositoryUrl: 'https://github.com/ada/my-app',
      license: 'MIT',
    });
  });

  it('degrades to empty strings on a bare package.json', () => {
    expect(createAppMeta({})).toEqual({
      name: '',
      description: '',
      author: '',
      repositoryUrl: '',
      license: '',
    });
  });
});

describe('applyLicenseHolder', () => {
  const license = 'MIT License\n\nCopyright (c) 2025 Old Name\n\nPermission is hereby granted…\n';

  it('replaces the holder and keeps the year', () => {
    expect(applyLicenseHolder(license, 'Ada Lovelace')).toContain(
      'Copyright (c) 2025 Ada Lovelace',
    );
  });

  it('keeps a year range intact', () => {
    const ranged = license.replace('2025', '2019-2025');

    expect(applyLicenseHolder(ranged, 'Ada Lovelace')).toContain(
      'Copyright (c) 2019-2025 Ada Lovelace',
    );
  });

  it('leaves the rest of the licence untouched', () => {
    expect(applyLicenseHolder(license, 'Ada Lovelace')).toContain('Permission is hereby granted…');
  });
});

describe('applyManifestMeta', () => {
  it('sets name and description without touching anything else', () => {
    const manifest = { name: 'old', short_name: 'old', display: 'standalone', icons: [] };

    expect(
      applyManifestMeta(manifest, {
        name: 'my-app',
        description: 'Does things',
        author: 'Ada',
        repositoryUrl: '',
        license: 'MIT',
      }),
    ).toEqual({
      name: 'my-app',
      short_name: 'old',
      description: 'Does things',
      display: 'standalone',
      icons: [],
    });
  });
});
