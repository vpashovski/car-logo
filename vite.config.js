import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// base може да се подаде при build за хостване под под-път (2.1):
//   BASE_PATH=/car-logo/ npm run build
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  base,
  build: {
    sourcemap: false, // NFR-006: без публични source maps
  },
  plugins: [
    tailwindcss(),
    VitePWA({
      // PWA-005: контролирано обновяване — новата версия не прекъсва сесия,
      // прилага се от родителския бутон „Обнови приложението“ (PWA-006).
      registerType: 'prompt',
      manifest: {
        id: base,
        name: 'Коли — уча марките',
        short_name: 'Коли',
        description: 'Детска игра за учене и разпознаване на автомобилни марки',
        lang: 'bg',
        display: 'fullscreen',
        display_override: ['fullscreen', 'standalone'],
        orientation: 'landscape', // KIOSK-005: таблет на стойка
        start_url: base,
        scope: base,
        theme_color: '#0284c7',
        background_color: '#f0f9ff',
        icons: [
          { src: 'icons/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // PWA-002: precache на shell, данни, емблеми и аудио — пълен offline
        globPatterns: ['**/*.{js,css,html,png,svg,mp3,webmanifest}'],
        cleanupOutdatedCaches: true,
        navigateFallback: base + 'index.html',
      },
    }),
  ],
});
