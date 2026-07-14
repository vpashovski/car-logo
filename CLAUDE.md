# CLAUDE.md

Детско PWA за учене на автомобилни марки (2–4 г.). Alpine.js + Tailwind v4 +
Vite 7 + vite-plugin-pwa, client-only, пълен offline. Подробности: README.md.

## Работен процес

- Комуникация и commit съобщения: на български.
- Commit само при изрична команда от потребителя. Push прави той (SSH ключ с
  passphrase, недостъпен за неинтерактивни сесии).
- Deploy: автоматичен при push към main — GitHub Pages (deploy.yml) и
  собствен сървър през rsync (deploy-server.yml, конфигуриран през secrets).
- Нова марка: запис в src/data/brands.js → npm run fetch-logos →
  npm run generate-audio → build. Файловите имена са стабилни, lowercase.

## Научени уроци — НЕ ги „поправяй“ обратно

- msedge-tts трябва да е v2+ — v1.x е с мъртъв endpoint (Connect Error).
  Гласът е bg-BG-KalinaNeural, генерира се еднократно build-time.
- manifest.webmanifest НАРОЧНО не е в SW precache (vite.config.js) —
  инсталацията трябва винаги да вижда актуален manifest.
- display: standalone, НЕ fullscreen — fullscreen WebAPK крашва при
  стартиране на стари Android устройства (Android 7).
- Без емоджи за интерактивни икони (стрелки, говорител, ✓/✗) — емоджитата
  се оцветяват различно на всяко устройство; ползвай inline SVG с текущите
  design tokens (src/styles.css @theme).
- Марките НЕ се изговарят автоматично в „Учим“ — само при натискане на 🔊.
  Въпросът в „Познай“ се изговаря автоматично. Това е съзнателно решение.
- Последният екран е в sessionStorage (ново стартиране = начален екран);
  настройки/любими/напредък са в localStorage със schemaVersion.
- Родителският вход: задържане 3 сек + математическа задача. Екранът
  parent никога не се възстановява след рестарт (KIOSK-004).

## Ограничения по спецификация (docs при потребителя, PDF)

- Никакви външни runtime заявки, CDN, реклами, тракери (DATA-004).
- Без наказателни звуци/съобщения при грешен отговор (FR-023).
- Touch елементи ≥ 64px; текст за марка ≥ 28px на таблет (UX-001/002).
- Анимациите уважават prefers-reduced-motion и родителската настройка.
