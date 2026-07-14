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

## Аудио

Българското произношение (130 mp3: име + въпрос за всяка марка + реплики за
обратна връзка) се генерира еднократно с `npm run generate-audio` — Microsoft
Edge TTS, глас `bg-BG-KalinaNeural`, през `msedge-tts` v2+ (v1.x не работи —
старият endpoint е спрян). Файловете са в `public/audio/{name,question,ui}/` и
влизат в offline precache. При нова марка: запис в `brands.js` →
`npm run fetch-logos` → `npm run generate-audio` → build.

По подразбиране марките се изговарят само при натискане на 🔊/емблемата;
автоматичното произнасяне се включва от родителските настройки.

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
