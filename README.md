# Коли — уча марките 🚗

Детско PWA приложение за учене и разпознаване на автомобилни марки (2–4 г.).
Стек: **Alpine.js + Tailwind CSS + Vite + vite-plugin-pwa**. Client-only, без
външни услуги, реклами и проследяване. Пълен offline след първото зареждане.

## Режими

- **Учим** — голяма емблема, българско + латинско име; името се изговаря само
  при натискане на 🔊 или емблемата (никога автоматично). Стрелки и swipe за
  смяна, сърчице за любими. Редът се разбърква при всяко влизане.
- **Познай** — гласов въпрос „Къде е …?“ и 2/3/4 отговора-емблеми. Верен
  отговор: похвала + звезди; грешен: лек жест, нов опит, без наказания.
- **Любими** — само марките със сърчице.
- **Нива** — 63 марки в 5 кумулативни нива: Нашите улици (32) → По-редки по
  пътя (40) → Бързи и луксозни (49) → Камиони и бусове (55) → Екзотика (63).

## Родителски режим

Задръж ⚙️ (горе вдясно на началния екран) **3 секунди** → реши задачата.
Настройки: звук, анимации, ред на марките/въпросите, умен подбор (грешените
марки се падат по-често), брой отговори (2–4), ниво, активни марки поотделно,
любими, напредък по марка („Познава / Учи / Не е упражнявана“) с нулиране.

Данните се пазят само в `localStorage` (ключ `car-logo.state`, версия на
схемата за бъдещи миграции). Повредени данни водят до безопасни defaults.

## Команди

```bash
npm install             # зависимости
npm run dev             # разработка на http://localhost:5173
npm run build           # production build в dist/
npm run preview         # локален преглед на production build-а

npm run fetch-logos     # еднократно: сваля 63-те емблеми в public/logos/
npm run generate-icons  # еднократно: PWA икони от public/icons/icon.svg
npm run generate-audio  # еднократно: TTS произношение (виж „Аудио“)
```

## Публикуване и инсталиране

Всеки push към `main` се build-ва и публикува автоматично в GitHub Pages
(`.github/workflows/deploy.yml`): https://vpashovski.github.io/car-logo/

Инсталираното PWA се обновява само̀ при отваряне с интернет (autoUpdate).

На устройството: отвори адреса в Chrome, изчакай пълното зареждане, меню ⋮ →
**Инсталиране на приложение**. За kiosk режим: Fully Kiosk Browser (може да
заключи landscape + PIN) или Android screen pinning — самото PWA не фиксира
ориентация.

При друг хостинг под под-път: `BASE_PATH=/car-logo/ npm run build`.

## Аудио

Българското произношение (130 mp3: име + въпрос за всяка марка + реплики за
обратна връзка) се генерира еднократно с `npm run generate-audio` — Microsoft
Edge TTS, глас `bg-BG-KalinaNeural`, през `msedge-tts` v2+ (v1.x не работи —
старият endpoint е спрян). Файловете са в `public/audio/{name,question,ui}/` и
влизат в offline precache.

При нова марка: запис в `src/data/brands.js` → `npm run fetch-logos` →
`npm run generate-audio` → build.

## Структура

```
public/logos/        локални емблеми (63 марки)
public/icons/        PWA икони
public/audio/        локално произношение (bg), 130 mp3
src/data/brands.js   каталог на марките (имена, нива, пътища)
src/stores/          Alpine stores (db = persisted, ui = ефимерен)
src/components/      Alpine data компоненти (екрани)
src/lib/             audio manager, навигация + history, помощни функции
src/styles.css       Tailwind + design tokens + детски компоненти
vite.config.js       build + PWA (autoUpdate, precache на всичко)
```
