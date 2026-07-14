// Генерира PWA PNG иконите от public/icons/icon.svg
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const dir = new URL('../public/icons/', import.meta.url);
const out = (name) => fileURLToPath(new URL(name, dir));
const svg = await readFile(out('icon.svg'));
// maskable: пълноразмерен фон без заоблени ъгли (safe zone за Android маски)
const maskableSvg = Buffer.from(svg.toString().replace('rx="96"', 'rx="0"'));

await sharp(svg).resize(192, 192).png().toFile(out('pwa-192.png'));
await sharp(svg).resize(512, 512).png().toFile(out('pwa-512.png'));
await sharp(maskableSvg).resize(512, 512).png().toFile(out('pwa-maskable-512.png'));

console.log('Готово: pwa-192.png, pwa-512.png, pwa-maskable-512.png');
