// Режим „Учим марки“ (4.2) — използва се и за „Любими“ (favOnly = true)
import { BRANDS } from '../data/brands.js';
import { speakBrand, stopAudio } from '../lib/audio.js';
import { shuffle } from '../lib/util.js';

const SWIPE_X = 70; // FR-014: праг срещу случайна смяна
const SWIPE_MAX_Y = 60;

export function registerLearn(Alpine) {
  Alpine.data('learnScreen', (favOnly = false) => ({
    favOnly,
    myScreen: favOnly ? 'favorites' : 'learn',
    items: [],
    i: 0,
    pop: false,
    _tx: null,
    _ty: null,

    init() {
      window.addEventListener('screen-changed', (e) => {
        if (e.detail === this.myScreen) this.enter();
      });
      // при директно възстановяване на екрана след рестарт (FR-003)
      if (this.$store.ui.screen === this.myScreen) this.enter();
    },

    get brand() {
      return this.items.length ? this.items[this.i % this.items.length] : null;
    },

    rebuild() {
      const db = this.$store.db;
      // „Учим“ показва само активните марки (нивото важи за всички режими);
      // „Любими“ показва избраните независимо от нивото — детето ги е поискало.
      let list = favOnly
        ? BRANDS.filter((b) => db.isFav(b.id))
        : BRANDS.filter((b) => db.isActive(b.id));
      if (db.settings.shuffleLearn) list = shuffle(list); // FR-015
      this.items = list;
      this.i = 0;
    },

    // Марката се изговаря САМО при натискане на 🔊/емблемата —
    // никога автоматично, за да може детето първо само да отговори.
    enter() {
      this.rebuild();
    },

    speak() {
      if (!this.brand) return;
      this.bounce();
      speakBrand(this.brand); // FR-012
    },

    bounce() {
      this.pop = false;
      requestAnimationFrame(() => (this.pop = true));
    },

    step(d) {
      if (!this.items.length) return;
      stopAudio(); // AC-13: звукът спира при смяна на марка
      this.i = (this.i + d + this.items.length) % this.items.length; // FR-015: циклично
      this.bounce();
    },
    next() {
      this.step(1);
    },
    prev() {
      this.step(-1);
    },

    toggleFav() {
      if (!this.brand) return;
      const id = this.brand.id;
      this.$store.db.toggleFav(id); // FR-016 / FR-030
      if (favOnly) {
        // премахване от любими вътре в екрана „Любими“ маха картата от списъка
        const cur = this.i;
        this.items = this.items.filter((b) => b.id !== id);
        this.i = this.items.length ? cur % this.items.length : 0;
      }
    },

    // FR-014: хоризонтален swipe с праг
    touchStart(e) {
      const t = e.changedTouches[0];
      this._tx = t.clientX;
      this._ty = t.clientY;
    },
    touchEnd(e) {
      if (this._tx === null) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - this._tx;
      const dy = t.clientY - this._ty;
      this._tx = this._ty = null;
      if (Math.abs(dx) > SWIPE_X && Math.abs(dy) < SWIPE_MAX_Y) {
        if (dx < 0) this.next();
        else this.prev();
      }
    },
  }));
}
