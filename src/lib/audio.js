// Audio manager: един споделен HTMLAudioElement (Приложение B) —
// ново възпроизвеждане винаги спира предишното (5.3, AC-13).
//
// ЗАБЕЛЕЖКА v1.0: mp3 файловете с произношение още не са генерирани.
// Липсващ файл се игнорира тихо (NFR-003), така че когато аудиото бъде
// добавено в public/audio/, всичко ще заработи без промяна по кода.
import Alpine from 'alpinejs';
import { asset } from './util.js';

const player = new Audio();
player.preload = 'auto';
let queue = [];

function soundEnabled() {
  try {
    return !!Alpine.store('db')?.settings.sound;
  } catch {
    return false;
  }
}

export function stopAudio() {
  queue = [];
  try {
    player.pause();
    player.currentTime = 0;
  } catch {
    /* играчът може да няма зареден източник */
  }
}

export function playAssets(paths) {
  if (!soundEnabled()) return;
  stopAudio();
  queue = [...paths];
  playNext();
}

export const playAsset = (p) => playAssets([p]);
export const speakBrand = (b) => playAssets([b.audio]);
export const playQuestion = (b) => playAssets([b.question]);

function playNext() {
  const p = queue.shift();
  if (!p) return;
  try {
    player.src = asset(p);
    player.play().catch(() => {});
  } catch {
    /* NFR-003: без uncaught errors при липсващ файл/permission */
  }
}

player.addEventListener('ended', playNext);
player.addEventListener('error', () => {
  queue = [];
});

// KIOSK-006: при скриване на приложението звукът спира
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopAudio();
});
