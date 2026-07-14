// Коренов компонент: екранен рутер + общи помощници за шаблоните
import { navigate, initHistory, SAFE_SCREENS } from '../lib/nav.js';
import { asset } from '../lib/util.js';

export function registerAppRoot(Alpine) {
  Alpine.data('appRoot', () => ({
    init() {
      // FR-003 / KIOSK-004: възстановяване на последния БЕЗОПАСЕН екран
      const last = this.$store.db.lastScreen;
      initHistory(SAFE_SCREENS.includes(last) ? last : 'home');
    },
    get screen() {
      return this.$store.ui.screen;
    },
    get noAnim() {
      return !this.$store.db.settings.animations;
    },
    go(s) {
      navigate(s);
    },
    asset, // достъпен по scope веригата във всички вложени компоненти
  }));
}
