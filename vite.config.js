import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// @ts-ignore
import babelConfig from './babel.config.cjs';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    port: 1998,
    open: true
  }
  plugins: [
    react({
      babel: babelConfig,
    }),
  ],
});
