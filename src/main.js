import Alpine from 'alpinejs';
import { registerSW } from 'virtual:pwa-register';
import './styles.css';
import { registerStores } from './stores/index.js';
import { registerComponents } from './components/index.js';

document.addEventListener('alpine:init', () => {
  registerStores(Alpine);
  registerComponents(Alpine);
});

// Автоматично обновяване: service worker-ът проверява при всяко отваряне
// и сам инсталира новата версия (registerType: 'autoUpdate').
registerSW({ immediate: true });

window.Alpine = Alpine;
Alpine.start();
