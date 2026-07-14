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
      // Автоматично обновяване: при отваряне новата версия се сваля във
      // фонов режим и се активира — без родителско действие. Текущата
      // сесия не се прекъсва; новите файлове се виждат при следващото
      // отваряне/презареждане (PWA-005 остава спазено).
      registerType: 'autoUpdate',
      manifest: {
        id: base,
        name: 'Коли — уча марките',
        short_name: 'Коли',
        description: 'Детска игра за учене и разпознаване на автомобилни марки',
        lang: 'bg',
        // standalone вместо fullscreen: fullscreen WebAPK крашва при
        // стартиране на стари Android устройства (напр. Android 7);
        // цял екран за kiosk таблета се осигурява от Fully Kiosk.
        display: 'standalone',
        // Без фиксирана ориентация — върти се със системата (телефон и таблет).
        // При kiosk употреба ориентацията се заключва от Fully Kiosk (KIOSK-005).
        orientation: 'any',
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
        // PWA-002: precache на shell, данни, емблеми и аудио — пълен offline.
        // manifest.webmanifest нарочно НЕ е в precache: инсталацията трябва
        // винаги да вижда актуалния manifest (ориентация, икони), не кеширан.
        globPatterns: ['**/*.{js,css,html,png,svg,mp3}'],
        cleanupOutdatedCaches: true,
        navigateFallback: base + 'index.html',
      },
    }),
  ],
});
