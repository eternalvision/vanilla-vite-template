/*
 * eslint configuration:
 * 1. targets JavaScript files (js, mjs, cjs) for linting
 * 2. uses the official @eslint/js plugin with recommended rules
 * 3. provides browser global variables for client-side code
 * 4. ignores build and dependency folders to speed up linting
 */

import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';

export default defineConfig([
  { files: ['**/*.{js,mjs,cjs}'], plugins: { js }, extends: ['js/recommended'] },
  { files: ['**/*.{js,mjs,cjs}'], languageOptions: { globals: globals.browser } },
  { ignores: ['dist/**', 'node_modules/**'] },
]);
