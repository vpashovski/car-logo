// Малки чисти помощни функции (тестваеми — NFR-009)

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function randOf(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function asset(path) {
  return import.meta.env.BASE_URL + path;
}
