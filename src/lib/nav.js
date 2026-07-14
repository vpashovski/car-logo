import Alpine from 'alpinejs';
import { stopAudio } from './audio.js';

export const SAFE_SCREENS = ['home', 'learn', 'quiz', 'favorites'];

// Единствената навигация в приложението — само вътрешни екрани,
// без URL промени и външни адреси (KIOSK-001/002).
export function navigate(screen) {
  stopAudio(); // AC-13
  Alpine.store('ui').screen = screen;
  // FR-003 / KIOSK-004: родителският екран никога не е "последен безопасен"
  if (SAFE_SCREENS.includes(screen)) Alpine.store('db').setLastScreen(screen);
  window.dispatchEvent(new CustomEvent('screen-changed', { detail: screen }));
}
