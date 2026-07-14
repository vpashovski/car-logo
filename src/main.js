import Alpine from 'alpinejs';
import { registerSW } from 'virtual:pwa-register';
import './styles.css';
import { registerStores } from './stores/index.js';
import { registerComponents } from './components/index.js';

document.addEventListener('alpine:init', () => {
  registerStores(Alpine);
  registerComponents(Alpine);
});

// PWA-005: контролирано обновяване — новата версия чака, докато
// родителят натисне „Обнови приложението“ (PWA-006).
const updateSW = registerSW({
  onNeedRefresh() {
    try {
      Alpine.store('ui').updateAvailable = true;
    } catch {
      /* стартиране преди alpine:init — игнорираме */
    }
  },
});
window.__applyUpdate = () => updateSW(true);

window.Alpine = Alpine;
Alpine.start();
