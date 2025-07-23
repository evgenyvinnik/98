import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  plugins: [react()],
  server: {
    port: 1998,
    open: true
  }
});
