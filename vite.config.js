/*
 * vite configuration file:
 * 1. defines project root, base path, and public directory
 * 2. sets a global variable for compatibility
 * 3. specifies cache directory for faster rebuilds
 * 4. configures CSS processing with Tailwind, Autoprefixer, and Sass paths
 * 5. resolves '@' alias to the 'src' directory
 * 6. configures dev server port and filesystem permissions
 * 7. defines build output directory, sourcemaps, minification, and target
 * 8. customizes asset output naming and splits vendor modules into chunks
 * 9. sets a warning limit for large chunk sizes
 * 10. configures vitest for unit testing with jsdom and global APIs
 */

import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import tailwindConfig from './tailwind.config.js';

import { assetFileNamer, chunkSplitter } from './conf';

// derive __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  root: '.', // project root directory
  base: '/', // base public path
  publicDir: 'public', // directory for static assets

  define: {
    global: 'window', // polyfill global for legacy libraries
  },

  cacheDir: 'node_modules/.vite', // directory for Vite cache

  css: {
    postcss: {
      plugins: [
        tailwindcss({ config: tailwindConfig }), // tailwind CSS
        autoprefixer(), // vendor prefixing
      ],
    },
    preprocessorOptions: {
      scss: {
        includePaths: ['src/sass'], // sass include directory
      },
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // shortcut to src folder
    },
  },

  server: {
    port: 9999, // dev server port
    fs: {
      allow: ['src', 'public', 'node_modules'], // allow serving files from parent directory
    },
  },

  preview: {
    port: 8888, // preview port
  },

  build: {
    outDir: 'dist', // build output folder
    emptyOutDir: true, // clean outDir before building
    sourcemap: false, // generate source maps
    minify: 'esbuild', // minification tool
    target: 'es2024', // JS target for transpilation
    esbuild: {
      legalComments: 'none', // remove license comments
    },
    commonjsOptions: {
      transformMixedEsModules: true, // support mixed ES/CommonJS
    },
    rollupOptions: {
      output: {
        entryFileNames: 'js/[name]/[hash].js', // entry chunk naming
        chunkFileNames: 'js/[name]/[hash].js', // code-split chunk naming
        assetFileNames: ({ name }) => assetFileNamer({ name }), // asset naming based on type
        manualChunks: (id) => chunkSplitter(id), // custom chunk splitting for vendor modules
      },
    },
    chunkSizeWarningLimit: 2000, // warn if chunk > 2000kB
  },

  envDir: '.', // directory where .env files are loaded from
  envPrefix: 'VITE_', // prefix to filter and expose env variables

  test: {
    globals: true, // using (describe, it, expect) without import
    environment: 'jsdom', // need for a DOM testing
    exclude: [...configDefaults.exclude, 'e2e/*'],
  },
});
