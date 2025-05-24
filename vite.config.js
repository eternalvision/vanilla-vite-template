import { defineConfig } from 'vite';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import tailwindConfig from './tailwind.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  root: '.',
  base: '/',
  publicDir: 'public',
  define: {
    global: 'window',
  },
  cacheDir: 'node_modules/.vite',
  css: {
    postcss: {
      plugins: [tailwindcss({ config: tailwindConfig }), autoprefixer()],
    },
    preprocessorOptions: {
      scss: { includePaths: ['src/sass'] },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 9999,
    fs: {
      allow: ['..'],
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    minify: 'esbuild',
    target: 'es2024',
    esbuild: {
      legalComments: 'none',
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        entryFileNames: 'js/[name]/[hash].js',
        chunkFileNames: 'js/[name]/[hash].js',
        assetFileNames: ({ name }) => {
          if (!name) return 'assets/[name]/[hash][extname]';
          if (name.endsWith('.css')) {
            return 'styles/[name]/[hash][extname]';
          }
          if (/\.(svg)$/i.test(name)) {
            return 'icons/[name]/[hash][extname]';
          }
          if (/\.(png|jpe?g|gif|webp)$/i.test(name)) {
            return 'images/[name]/[hash][extname]';
          }
          if (/\.(ttf|woff|woff2)$/i.test(name)) {
            return 'fonts/[name]/[hash][extname]';
          }
          return 'assets/[name]/[hash][extname]';
        },
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const parts = id.split('node_modules/')[1].split('/');
            const pkgName = parts[0].startsWith('@') ? `${parts[0]}_${parts[1]}` : parts[0];
            return `vendor/${pkgName}`;
          }
        },
      },
    },
    chunkSizeWarningLimit: 2000,
  },
});
