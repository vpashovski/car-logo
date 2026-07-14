// Режим „Познай марката“ (4.3): аудио/текстов въпрос „Къде е …?“ и
// два големи отговора-емблеми. Отговорите са емблеми, а не текст,
// защото основният принцип на документа е употреба без четене.
import { BRANDS, BRAND_BY_ID, PRAISE_AUDIO, TRY_AGAIN_AUDIO } from '../data/brands.js';
import { playAsset, playQuestion, stopAudio } from '../lib/audio.js';
import { shuffle, randOf } from '../lib/util.js';

const AUTO_NEXT_MS = 1800; // FR-025: кратка пауза след успех

export function registerQuiz(Alpine) {
  Alpine.data('quizScreen', () => ({
    target: null,
    options: [],
    locked: false,
    correctId: null,
    wrongId: null,
    stars: [],
    _seq: [],
    _seqI: 0,

    init() {
      window.addEventListener('screen-changed', (e) => {
        if (e.detail === 'quiz') this.enter();
      });
      if (this.$store.ui.screen === 'quiz') this.enter();
    },

    // FR-021 / FR-033: само активните марки участват
    get active() {
      const db = this.$store.db;
      return BRANDS.filter((b) => db.isActive(b.id));
    },

    // FR-034: под две активни марки -> ясно родителско съобщение
    get notEnough() {
      return this.active.length < 2;
    },

    enter() {
      this.newQuestion();
    },

    newQuestion() {
      stopAudio();
      this.locked = false;
      this.correctId = null;
      this.wrongId = null;
      this.stars = [];

      const act = this.active;
      if (act.length < 2) {
        this.target = null;
        this.options = [];
        return;
      }

      let target;
      const s = this.$store.db.settings;
      if (s.smartPick) {
        target = this.pickSmart(act);
      } else if (s.shuffleQuiz) {
        target = randOf(act);
        // без повторение на същия въпрос два пъти подред
        if (this.target && act.length > 2 && target.id === this.target.id) {
          target = randOf(act.filter((b) => b.id !== target.id));
        }
      } else {
        // FR-026: фиксиран ред по каталога
        if (this._seq.length !== act.length) {
          this._seq = act.map((b) => b.id);
          this._seqI = 0;
        }
        target = BRAND_BY_ID[this._seq[this._seqI % this._seq.length]];
        this._seqI += 1;
      }

      // Брой отговори по настройка (2–4), ограничен от активните марки.
      // Дистракторите са уникални и само от активните (FR-021).
      const count = Math.min([2, 3, 4].includes(s.answersCount) ? s.answersCount : 2, act.length);
      const distractors = shuffle(act.filter((b) => b.id !== target.id)).slice(0, count - 1);
      this.target = target;
      this.options = shuffle([target, ...distractors]);
      this.ask();
    },

    // Умен подбор: претеглено случайно теглене по напредъка.
    // Неупражнявана марка — тегло 3, учи се — 2 (+2, ако грешните
    // отговори надвишават верните), позната — 1. Знаените не изчезват,
    // само се падат по-рядко.
    pickSmart(act) {
      const db = this.$store.db;
      const pool =
        this.target && act.length > 2 ? act.filter((b) => b.id !== this.target.id) : act;
      let total = 0;
      const weighted = pool.map((b) => {
        const status = db.statusOf(b.id);
        const p = db.progress[b.id];
        let w = status === 'new' ? 3 : status === 'learning' ? 2 : 1;
        if (p && p.w > p.c) w += 2;
        total += w;
        return [b, w];
      });
      let r = Math.random() * total;
      for (const [b, w] of weighted) {
        r -= w;
        if (r <= 0) return b;
      }
      return pool[pool.length - 1];
    },

    ask() {
      if (this.target) playQuestion(this.target);
    },

    pick(brand) {
      if (this.locked || !this.target) return;
      const db = this.$store.db;

      if (brand.id === this.target.id) {
        // FR-022: кратка положителна анимация и ненатрапчив звук
        this.locked = true;
        this.correctId = brand.id;
        this.wrongId = null;
        this.stars = [0, 1, 2, 3, 4];
        db.recordAnswer(this.target.id, true);
        playAsset(randOf(PRAISE_AUDIO));
        if (db.settings.autoNext) {
          setTimeout(() => {
            if (this.$store.ui.screen === 'quiz') this.newQuestion();
          }, AUTO_NEXT_MS);
        }
      } else {
        // FR-023/FR-024: леко отбелязване, без наказание, нов опит веднага
        this.wrongId = brand.id;
        db.recordAnswer(this.target.id, false);
        playAsset(TRY_AGAIN_AUDIO);
        setTimeout(() => (this.wrongId = null), 700);
      }
    },
  }));
}
