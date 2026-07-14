// Persisted store: настройки, активни марки, любими, напредък (DATA-001…005)
import { BRANDS, brandsUpToLevel } from '../data/brands.js';

const KEY = 'car-logo.state';
const SCHEMA_VERSION = 1; // DATA-002: версия за бъдещи миграции

function defaults() {
  return {
    schemaVersion: SCHEMA_VERSION,
    settings: {
      sound: true,
      animations: true,
      shuffleLearn: true, // FR-015: нов ред при всяко влизане (изключва се от родителя)
      shuffleQuiz: true, // FR-026: фиксиран или разбъркан ред на въпросите
      autoNext: true, // FR-025: автоматичен следващ въпрос
    },
    level: 1, // избрано ниво (1–5), кумулативно
    active: BRANDS.filter((b) => b.enabledByDefault).map((b) => b.id),
    favorites: [],
    progress: {}, // brandId -> { c: брой верни, w: брой грешни, last: 'YYYY-MM-DD' }
    lastScreen: 'home',
  };
}

// DATA-003: повредени или липсващи данни -> безопасни defaults, без срив
function sanitize(raw) {
  const d = defaults();
  if (!raw || typeof raw !== 'object') return d;
  if (raw.schemaVersion !== SCHEMA_VERSION) return d; // място за бъдещи миграции
  const ids = new Set(BRANDS.map((b) => b.id));
  const cleanIds = (v, fallback) => (Array.isArray(v) ? v.filter((id) => ids.has(id)) : fallback);
  return {
    ...d,
    settings: { ...d.settings, ...(raw.settings && typeof raw.settings === 'object' ? raw.settings : {}) },
    level: Number.isInteger(raw.level) && raw.level >= 1 && raw.level <= 5 ? raw.level : 1,
    active: cleanIds(raw.active, d.active),
    favorites: cleanIds(raw.favorites, d.favorites),
    progress: raw.progress && typeof raw.progress === 'object' ? raw.progress : {},
    lastScreen: typeof raw.lastScreen === 'string' ? raw.lastScreen : 'home',
  };
}

function load() {
  try {
    return sanitize(JSON.parse(localStorage.getItem(KEY)));
  } catch {
    return defaults();
  }
}

export function registerDbStore(Alpine) {
  Alpine.store('db', {
    ...load(),

    save() {
      try {
        const { schemaVersion, settings, level, active, favorites, progress, lastScreen } = this;
        localStorage.setItem(
          KEY,
          JSON.stringify({ schemaVersion, settings, level, active, favorites, progress, lastScreen })
        );
      } catch {
        /* пълен/забранен storage не бива да блокира UI (NFR-003) */
      }
    },

    setSetting(key, value) {
      this.settings[key] = value;
      this.save();
    },

    isFav(id) {
      return this.favorites.includes(id);
    },
    toggleFav(id) {
      this.favorites = this.isFav(id)
        ? this.favorites.filter((x) => x !== id)
        : [...this.favorites, id];
      this.save();
    },

    // Избор на ниво: активира всички марки от нива 1..n.
    // Индивидуалните отметки след това остават за фина настройка.
    setLevel(n) {
      this.level = n;
      this.active = brandsUpToLevel(n).map((b) => b.id);
      this.save();
    },

    isActive(id) {
      return this.active.includes(id);
    },
    toggleActive(id) {
      this.active = this.isActive(id)
        ? this.active.filter((x) => x !== id)
        : [...this.active, id];
      this.save();
    },

    recordAnswer(id, correct) {
      const p = this.progress[id] ?? { c: 0, w: 0 };
      if (correct) p.c += 1;
      else p.w += 1;
      p.last = new Date().toISOString().slice(0, 10); // DATA-005
      this.progress = { ...this.progress, [id]: p };
      this.save();
    },

    resetProgress() {
      this.progress = {};
      this.save();
    },

    setLastScreen(s) {
      this.lastScreen = s;
      this.save();
    },

    // FR-044: Познава / Учи / Не е упражнявана
    statusOf(id) {
      const p = this.progress[id];
      if (!p || p.c + p.w === 0) return 'new';
      if (p.c >= 5 && p.c >= p.w * 2) return 'knows';
      return 'learning';
    },
  });
}
