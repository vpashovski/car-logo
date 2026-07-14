// Ефимерно UI състояние — не се записва в localStorage
export function registerUiStore(Alpine) {
  Alpine.store('ui', {
    screen: 'home',
    updateAvailable: false, // PWA-006
  });
}
