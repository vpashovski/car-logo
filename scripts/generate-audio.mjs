// Еднократно генериране на българското произношение като локални mp3 файлове.
// Използва Microsoft Edge TTS (глас bg-BG-KalinaNeural) само на build машината —
// приложението няма runtime зависимост към TTS услуги (DATA-004).
import { mkdir, writeFile } from 'node:fs/promises';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import { BRANDS } from '../src/data/brands.js';

const VOICE = 'bg-BG-KalinaNeural';
const FORMAT = OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3;
const OUT = new URL('../public/audio/', import.meta.url);

const UI_CLIPS = [
  ['ui/bravo.mp3', 'Браво!'],
  ['ui/super.mp3', 'Супер!'],
  ['ui/tochno-taka.mp3', 'Точно така!'],
  ['ui/opitaj-pak.mp3', 'Опитай пак!'],
];

for (const dir of ['name', 'question', 'ui']) {
  await mkdir(new URL(dir + '/', OUT), { recursive: true });
}

async function synth(text) {
  const tts = new MsEdgeTTS();
  await tts.setMetadata(VOICE, FORMAT);
  const result = await tts.toStream(text);
  const stream = result.audioStream ?? result;
  const chunks = [];
  for await (const c of stream) chunks.push(c);
  const buf = Buffer.concat(chunks);
  if (buf.length < 500) throw new Error(`празен аудио отговор за "${text}"`);
  return buf;
}

async function make(relPath, text) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const buf = await synth(text);
      await writeFile(new URL(relPath, OUT), buf);
      console.log('ok', relPath, `(${buf.length} B)`);
      return;
    } catch (e) {
      console.warn(`опит ${attempt} за ${relPath}: ${e.message}`);
      await new Promise((r) => setTimeout(r, 1500 * attempt));
    }
  }
  throw new Error(`неуспех: ${relPath}`);
}

for (const [path, text] of UI_CLIPS) await make(path, text);
for (const b of BRANDS) {
  await make(`name/${b.id}.mp3`, `${b.tts}.`);
  await make(`question/${b.id}.mp3`, `Къде е ${b.tts}?`);
}
console.log(`Готово: ${UI_CLIPS.length + BRANDS.length * 2} аудио файла.`);
