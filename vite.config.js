import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  build: {
    // the renders are already compressed; don't let Vite inline any of them
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'), // Project 49 app
        ayra: resolve(__dirname, 'ayra.html'), // AYRA home (React + TSX, src/ayra)
      },
    },
  },
});
