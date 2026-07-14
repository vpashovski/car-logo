import Alpine from 'alpinejs';
import { stopAudio } from './audio.js';

export const SAFE_SCREENS = ['home', 'learn', 'quiz', 'favorites'];

// Последният екран живее в sessionStorage: минимизиране/презареждане в
// същата сесия продължава откъдето е било, но ново стартиране на
// приложението винаги започва от началния екран.
const LAST_SCREEN_KEY = 'car-logo.last-screen';

export function lastSessionScreen() {
  try {
    return sessionStorage.getItem(LAST_SCREEN_KEY);
  } catch {
    return null;
  }
}

// Смяна на екрана без запис в историята (използва се и от popstate)
function applyScreen(screen) {
  stopAudio(); // AC-13
  Alpine.store('ui').screen = screen;
  // KIOSK-004: родителският екран никога не е "последен безопасен"
  if (SAFE_SCREENS.includes(screen)) {
    try {
      sessionStorage.setItem(LAST_SCREEN_KEY, screen);
    } catch {
      /* напр. забранен storage — стартираме от начало */
    }
  }
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
