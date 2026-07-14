import Alpine from 'alpinejs';
import { stopAudio } from './audio.js';

export const SAFE_SCREENS = ['home', 'learn', 'quiz', 'favorites'];

// Смяна на екрана без запис в историята (използва се и от popstate)
function applyScreen(screen) {
  stopAudio(); // AC-13
  Alpine.store('ui').screen = screen;
  // FR-003 / KIOSK-004: родителският екран никога не е "последен безопасен"
  if (SAFE_SCREENS.includes(screen)) Alpine.store('db').setLastScreen(screen);
  window.dispatchEvent(new CustomEvent('screen-changed', { detail: screen }));
}

// Единствената навигация в приложението — само вътрешни екрани,
// без URL промени и външни адреси (KIOSK-001/002). Всеки екран влиза
// в browser историята, за да работи системният жест „назад“.
export function navigate(screen) {
  applyScreen(screen);
  try {
    history.pushState({ screen }, '');
  } catch {
    /* напр. ограничена kiosk среда — навигацията работи и без история */
  }
}

// Извиква се веднъж при старт: маркира началния екран в историята и
// прихваща „назад/напред“ жестовете, вместо да се излиза от приложението.
export function initHistory(initialScreen) {
  applyScreen(initialScreen);
  try {
    history.replaceState({ screen: initialScreen }, '');
  } catch {
    /* виж по-горе */
  }
  window.addEventListener('popstate', (e) => {
    const s = e.state?.screen;
    applyScreen(SAFE_SCREENS.includes(s) ? s : 'home');
  });
}
