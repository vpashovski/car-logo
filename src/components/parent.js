// Родителски вход (FR-040/041) и настройки (4.5)
import { BRANDS, LEVELS, brandsUpToLevel } from '../data/brands.js';
import { navigate } from '../lib/nav.js';
import { shuffle } from '../lib/util.js';

const HOLD_MS = 3000; // продължително задържане преди проверката

export function registerParent(Alpine) {
  // Вход: задържане на бутона + проста математическа проверка.
  // Нищо не се пази и не се показва в URL (FR-041).
  Alpine.data('parentGate', () => ({
    open: false,
    holding: false,
    a: 0,
    b: 0,
    opts: [],
    _t: null,

    startHold() {
      this.holding = true;
      this._t = setTimeout(() => {
        this.holding = false;
        this.show();
      }, HOLD_MS);
    },
    cancelHold() {
      this.holding = false;
      clearTimeout(this._t);
    },

    show() {
      this.a = 2 + Math.floor(Math.random() * 7);
      this.b = 2 + Math.floor(Math.random() * 7);
      const right = this.a + this.b;
      const set = new Set([right]);
      while (set.size < 3) {
        const off = (1 + Math.floor(Math.random() * 4)) * (Math.random() < 0.5 ? -1 : 1);
        if (right + off > 0) set.add(right + off);
      }
      this.opts = shuffle([...set]);
      this.open = true;
    },

    answer(n) {
      if (n === this.a + this.b) {
        this.open = false;
        navigate('parent');
      } else {
        this.show(); // нова задача при грешка
      }
    },
  }));

  Alpine.data('parentScreen', () => ({
    brands: BRANDS,
    levels: LEVELS,
    confirmReset: false,
    _confirmT: null,

    levelCount(n) {
      return brandsUpToLevel(n).length;
    },
    setLevel(n) {
      this.$store.db.setLevel(n);
    },

    settingsRows: [
      { key: 'sound', label: 'Звук' },
      { key: 'animations', label: 'Анимации' },
      { key: 'shuffleLearn', label: 'Разбъркан ред в „Учим“' },
      { key: 'shuffleQuiz', label: 'Разбъркани въпроси в „Познай“' },
      { key: 'smartPick', label: 'Умен подбор (трудните марки по-често)' },
      { key: 'autoNext', label: 'Автоматичен следващ въпрос' },
    ],

    // FR-044: обобщение Познава / Учи / Не е упражнявана
    get stats() {
      const db = this.$store.db;
      const r = { knows: 0, learning: 0, new: 0 };
      for (const b of BRANDS) r[db.statusOf(b.id)] += 1;
      return r;
    },

    statusLabel(id) {
      return { knows: 'Познава', learning: 'Учи', new: 'Не е упражнявана' }[
        this.$store.db.statusOf(id)
      ];
    },

    // FR-043: нулиране с второ потвърждение
    reset() {
      if (!this.confirmReset) {
        this.confirmReset = true;
        this._confirmT = setTimeout(() => (this.confirmReset = false), 4000);
        return;
      }
      clearTimeout(this._confirmT);
      this.confirmReset = false;
      this.$store.db.resetProgress();
    },

    // FR-045: защитено презареждане (прилага и чакаща нова версия)
    reloadApp() {
      location.reload();
    },
  }));
}
