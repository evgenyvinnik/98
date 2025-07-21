import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 1998,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
