/**
 * Vitest configuration, kept separate from the build config so test-only
 * settings never leak into a production bundle. Only the `@` alias is shared —
 * tests need no Tailwind, no asset pipeline, no dev server.
 */

import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    globals: false,
    environment: 'jsdom',
    include: ['tests/**/*.test.js', 'src/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.js', 'conf/**/*.js'],
      exclude: ['src/main.js'],
    },
  },
});
