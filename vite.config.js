import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// In local preview, open AYRA at "/" (like the live site). Project 49 stays at /project-49/.
const ayraHome = {
  name: 'ayra-home',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url === '/' || req.url === '/index.html') { res.statusCode = 302; res.setHeader('Location', '/ayra.html'); res.end(); return; }
      next();
    });
  },
};

export default defineConfig({
  plugins: [react(), ayraHome],
  build: {
    // the renders are already compressed; don't let Vite inline any of them
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'), // Project 49 app (served at /project-49/ after build)
        ayra: resolve(__dirname, 'ayra.html'), // AYRA home (React + TSX, src/ayra)
      },
    },
  },
});
