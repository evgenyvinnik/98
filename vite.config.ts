import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// @ts-ignore
import babelConfig from './babel.config.cjs';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: babelConfig,
    }),
  ],
});
