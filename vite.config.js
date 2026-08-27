/**
 * Vite configuration.
 *
 * Tailwind runs through its official Vite plugin (no PostCSS chain, no
 * Autoprefixer — v4 handles prefixing itself). Minification is left to Vite 8's
 * defaults: oxc for JavaScript, Lightning CSS for stylesheets. `npm run analyze`
 * builds with a bundle treemap written to `dist/stats.html`.
 */

import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';

import { assetFileNamer, chunkSplitter } from './conf/index.js';

const srcDir = fileURLToPath(new URL('./src', import.meta.url));

export default defineConfig(({ mode }) => {
  const isAnalyze = mode === 'analyze';

  return {
    base: '/',
    publicDir: 'public',
    cacheDir: 'node_modules/.vite',

    plugins: [
      tailwindcss(),
      isAnalyze &&
        visualizer({
          filename: 'dist/stats.html',
          template: 'treemap',
          gzipSize: true,
          brotliSize: true,
        }),
    ],

    resolve: {
      alias: {
        '@': srcDir,
      },
    },

    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: ['src/sass'],
        },
      },
    },

    server: {
      port: 9999,
    },

    preview: {
      port: 8888,
    },

    build: {
      outDir: 'dist',
      emptyOutDir: true,
      // keeps the analyze report meaningful without shipping maps to production
      sourcemap: isAnalyze,
      // Vite 8 defaults: oxc for JS, Lightning CSS for CSS
      minify: 'oxc',
      cssMinify: 'lightningcss',
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        output: {
          entryFileNames: 'js/[name]-[hash].js',
          chunkFileNames: 'js/[name]-[hash].js',
          assetFileNames: assetFileNamer,
          manualChunks: chunkSplitter,
        },
      },
    },

    envDir: '.',
    envPrefix: 'VITE_',
  };
});
