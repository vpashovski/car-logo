import { registerDbStore } from './db.js';
import { registerUiStore } from './ui.js';

export function registerStores(Alpine) {
  registerUiStore(Alpine);
  registerDbStore(Alpine);
}
