// Коренов компонент: екранен рутер + общи помощници за шаблоните
import { navigate, initHistory, lastSessionScreen, SAFE_SCREENS } from '../lib/nav.js';
import { asset } from '../lib/util.js';

export function registerAppRoot(Alpine) {
  Alpine.data('appRoot', () => ({
    init() {
      // Продължаваме само в рамките на същата сесия (презареждане/възстановен
      // таб); ново стартиране започва от началния екран (KIOSK-004).
      const last = lastSessionScreen();
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
