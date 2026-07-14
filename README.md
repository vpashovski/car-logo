# Коли — уча марките 🚗

Детско PWA приложение за учене и разпознаване на автомобилни марки (2–4 г.).
Стек: **Alpine.js + Tailwind CSS + Vite + vite-plugin-pwa**. Client-only, без
външни услуги, реклами и проследяване. Пълен offline след първото зареждане.

## Команди

```bash
npm install          # зависимости
npm run dev          # разработка на http://localhost:5173
npm run build        # production build в dist/
npm run preview      # локален преглед на production build-а

npm run fetch-logos  # еднократно: сваля 50-те емблеми в public/logos/
npm run generate-icons  # еднократно: PWA икони от public/icons/icon.svg
npm run generate-audio  # TTS произношение (виж „Аудио“ по-долу)
```

## Инсталиране на таблета

1. Качи съдържанието на `dist/` на HTTPS хостинг (Cloudflare Pages / Netlify /
   GitHub Pages). При хостване под под-път: `BASE_PATH=/car-logo/ npm run build`.
2. Отвори адреса в Chrome на таблета и изчакай пълното зареждане.
3. Меню ⋮ → **Инсталиране на приложение** (или „Добавяне към началния екран“).
4. За kiosk режим: Fully Kiosk Browser със start URL адреса на приложението,
   или Android screen pinning.

## Аудио (планирано за следваща версия)

Произношението е проектирано, но още не е генерирано — приложението тихо
пропуска липсващите файлове. За активиране: генерирай mp3 файловете в
`public/audio/name/<id>.mp3`, `public/audio/question/<id>.mp3` и
`public/audio/ui/*.mp3` (виж `scripts/generate-audio.mjs`) и направи нов build.
Никаква промяна по кода не е нужна.

Бележка: `msedge-tts` пакетът в момента не се свързва (Microsoft смениха
endpoint-а със защитен токен) — при добавянето на аудиото използвай
поддържана алтернатива (напр. Python `edge-tts`) или запиши родителски глас.

## Структура

```
public/logos/        локални емблеми (50 марки)
public/icons/        PWA икони
public/audio/        произношение (bg) — предстои
src/data/brands.js   каталог на марките
src/stores/          Alpine stores (db = persisted, ui = ефимерен)
src/components/      Alpine data компоненти (екрани)
src/lib/             audio manager, навигация, помощни функции
src/styles.css       Tailwind + design tokens + детски компоненти
vite.config.js       build + PWA (precache на всичко)
```

## Родителски режим

Задръж ⚙️ (долу вдясно на началния екран) ~1.2 сек → реши задачата.
Настройки: звук, автопроизнасяне, анимации, ред на марките/въпросите,
активни марки, любими, напредък (с нулиране), контролирано PWA обновяване.

Данните се пазят само в `localStorage` (ключ `car-logo.state`, версия на
схемата за бъдещи миграции). Повредени данни водят до безопасни defaults.
