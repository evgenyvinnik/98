import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import styleX from 'vite-plugin-stylex';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    // The StyleX plugin must be placed before the React plugin
    styleX(),
    react({
      babel: {
        // This is the key: we tell the React plugin to use the StyleX babel plugin
        plugins: [
          [
            '@stylexjs/babel-plugin',
            {
              dev: mode === 'development',
              genConditionalClasses: true,
              treeshakeCompensation: true,
              unstable_moduleResolution: {
                type: 'commonJS',
                rootDir: __dirname,
              },
            },
          ],
        ],
      },
    }),
  ],
  server: {
    port: 1998,
  },
}));
