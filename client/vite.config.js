import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          maximumFileSizeToCacheInBytes: 4 * 1024 * 1024
        },
        manifest: {
          name: 'Bitclub Crypto Wallet',
          short_name: 'Bitclub',
          description: 'Bitclub Crypto Wallet App!',
          theme_color: '#11150F',
          background_color: '#25C866',
          display: 'standalone',
          orientation: 'portrait',
          icons: [
            { src: "/logo/40.png", sizes: "40x40", type: "image/png" },
            { src: "/logo/48.png", sizes: "48x48", type: "image/png" },
            { src: "/logo/72.png", sizes: "72x72", type: "image/png" },
            { src: "/logo/96.png", sizes: "96x96", type: "image/png" },
            { src: "/logo/logo144.png", sizes: "144x144", type: "image/png" },
            { src: "/logo/168.png", sizes: "168x168", type: "image/png" },
            { src: "/logo/512.png", sizes: "512x512", type: "image/png" }
          ],
        },
      }),
    ],
    server: {
      port: 3000,
      proxy: {
        '/ws': {
          target: env.VITE_API_URL, 
          ws: true,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    base: '/', // Needed for SPA routing
  };
});
