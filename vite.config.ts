import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      // Proxy Internet Archive API requests to avoid CORS issues during development
      proxy: {
        '/api/ia-text': {
          target: 'https://archive.org',
          changeOrigin: true,
          rewrite: (path) => {
            const identifier = path.replace('/api/ia-text/', '');
            return `/download/${identifier}/${identifier}_djvu.txt`;
          },
        },
        '/api/ia-metadata': {
          target: 'https://archive.org',
          changeOrigin: true,
          rewrite: (path) => {
            const identifier = path.replace('/api/ia-metadata/', '');
            return `/metadata/${identifier}`;
          },
        },
      },
    },
  };
});
