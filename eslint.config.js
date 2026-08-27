/**
 * Flat ESLint config.
 *
 * - `js/recommended` as the baseline for every JavaScript file
 * - browser globals for `src/`, Node globals for build config and helpers
 * - `eslint-config-prettier` last, so formatting is Prettier's job alone
 */

import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier/flat';

export default defineConfig([
  globalIgnores(['dist/**', 'coverage/**', 'node_modules/**']),

  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
      eqeqeq: ['error', 'smart'],
      'prefer-const': 'error',
      'object-shorthand': 'error',
    },
  },

  {
    files: ['src/**/*.js'],
    languageOptions: { globals: globals.browser },
  },

  {
    files: ['conf/**/*.js', 'scripts/**/*.js', '*.config.js'],
    languageOptions: { globals: globals.node },
  },

  {
    // CLI scripts report to stdout — that is their interface
    files: ['scripts/**/*.js'],
    rules: { 'no-console': 'off' },
  },

  {
    files: ['tests/**/*.js', 'src/**/*.test.js'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },

  prettier,
]);
