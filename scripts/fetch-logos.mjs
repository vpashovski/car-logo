// Еднократно сваляне на емблемите в public/logos/ (build-time, без runtime CDN).
// Източник: https://github.com/filippofilip95/car-logos-dataset
import { mkdir, writeFile } from 'node:fs/promises';
import { BRANDS } from '../src/data/brands.js';

const SRC = 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/';
const OUT = new URL('../public/logos/', import.meta.url);

await mkdir(OUT, { recursive: true });

const failed = [];
for (const b of BRANDS) {
  const res = await fetch(`${SRC}${b.id}.png`);
  if (!res.ok) {
    failed.push(`${b.id} (HTTP ${res.status})`);
    continue;
  }
  await writeFile(new URL(`${b.id}.png`, OUT), Buffer.from(await res.arrayBuffer()));
  console.log('ok', b.id);
}

if (failed.length) {
  console.error('FAILED:', failed.join(', '));
  process.exit(1);
}
console.log(`Готово: ${BRANDS.length} емблеми.`);
