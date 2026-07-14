// Каталог на марките (FR: раздел 7.1). Данните са отделени от UI кода.
// Редът определя реда в режим „Учим“ при изключено разбъркване.
// `tts` е текстът за произнасяне, когато се различава от българското изписване.
// `level` е нивото, от което марката става активна (кумулативно, 1–5).
// Файловите пътища са стабилни, lowercase, без интервали (Приложение B).

export const LEVELS = [
  { n: 1, name: 'Нашите улици' },
  { n: 2, name: 'По-редки по пътя' },
  { n: 3, name: 'Бързи и луксозни' },
  { n: 4, name: 'Камиони и бусове' },
  { n: 5, name: 'Екзотика' },
];

const DEFS = [
  // ─── Ниво 1: „Нашите улици“ ───
  { id: 'toyota', name: 'Toyota', nameBg: 'Тойота', level: 1 },
  { id: 'volkswagen', name: 'Volkswagen', nameBg: 'Фолксваген', level: 1 },
  { id: 'bmw', name: 'BMW', nameBg: 'БМВ', tts: 'Бе Ем Ве', level: 1 },
  { id: 'mercedes-benz', name: 'Mercedes-Benz', nameBg: 'Мерцедес', level: 1 },
  { id: 'audi', name: 'Audi', nameBg: 'Ауди', level: 1 },
  { id: 'skoda', name: 'Skoda', nameBg: 'Шкода', level: 1 },
  { id: 'ford', name: 'Ford', nameBg: 'Форд', level: 1 },
  { id: 'opel', name: 'Opel', nameBg: 'Опел', level: 1 },
  { id: 'renault', name: 'Renault', nameBg: 'Рено', level: 1 },
  { id: 'peugeot', name: 'Peugeot', nameBg: 'Пежо', level: 1 },
  { id: 'citroen', name: 'Citroen', nameBg: 'Ситроен', level: 1 },
  { id: 'dacia', name: 'Dacia', nameBg: 'Дачия', level: 1 },
  { id: 'honda', name: 'Honda', nameBg: 'Хонда', level: 1 },
  { id: 'nissan', name: 'Nissan', nameBg: 'Нисан', level: 1 },
  { id: 'mazda', name: 'Mazda', nameBg: 'Мазда', level: 1 },
  { id: 'hyundai', name: 'Hyundai', nameBg: 'Хюндай', level: 1 },
  { id: 'kia', name: 'Kia', nameBg: 'Киа', level: 1 },
  { id: 'volvo', name: 'Volvo', nameBg: 'Волво', level: 1 },
  { id: 'tesla', name: 'Tesla', nameBg: 'Тесла', level: 1 },
  { id: 'fiat', name: 'Fiat', nameBg: 'Фиат', level: 1 },
  { id: 'suzuki', name: 'Suzuki', nameBg: 'Сузуки', level: 1 },
  { id: 'seat', name: 'SEAT', nameBg: 'Сеат', level: 1 },
  { id: 'jeep', name: 'Jeep', nameBg: 'Джип', level: 1 },
  { id: 'mini', name: 'MINI', nameBg: 'Мини', level: 1 },
  { id: 'land-rover', name: 'Land Rover', nameBg: 'Ленд Роувър', level: 1 },
  { id: 'lexus', name: 'Lexus', nameBg: 'Лексус', level: 1 },
  { id: 'mitsubishi', name: 'Mitsubishi', nameBg: 'Мицубиши', level: 1 },
  { id: 'subaru', name: 'Subaru', nameBg: 'Субару', level: 1 },
  { id: 'chevrolet', name: 'Chevrolet', nameBg: 'Шевролет', level: 1 },
  { id: 'alfa-romeo', name: 'Alfa Romeo', nameBg: 'Алфа Ромео', level: 1 },
  { id: 'lada', name: 'Lada', nameBg: 'Лада', level: 1 },
  { id: 'smart', name: 'Smart', nameBg: 'Смарт', level: 1 },
  // ─── Ниво 2: „По-редки по пътя“ ───
  { id: 'porsche', name: 'Porsche', nameBg: 'Порше', level: 2 },
  { id: 'cupra', name: 'Cupra', nameBg: 'Купра', level: 2 },
  { id: 'jaguar', name: 'Jaguar', nameBg: 'Ягуар', level: 2 },
  { id: 'mg', name: 'MG', nameBg: 'Ем Джи', level: 2 },
  { id: 'byd', name: 'BYD', nameBg: 'Би Уай Ди', level: 2 },
  { id: 'infiniti', name: 'Infiniti', nameBg: 'Инфинити', level: 2 },
  { id: 'saab', name: 'Saab', nameBg: 'Сааб', level: 2 },
  { id: 'daewoo', name: 'Daewoo', nameBg: 'Деу', level: 2 },
  // ─── Ниво 3: „Бързи и луксозни“ ───
  { id: 'ferrari', name: 'Ferrari', nameBg: 'Ферари', level: 3 },
  { id: 'lamborghini', name: 'Lamborghini', nameBg: 'Ламборгини', level: 3 },
  { id: 'maserati', name: 'Maserati', nameBg: 'Мазерати', level: 3 },
  { id: 'bentley', name: 'Bentley', nameBg: 'Бентли', level: 3 },
  { id: 'rolls-royce', name: 'Rolls-Royce', nameBg: 'Ролс-Ройс', level: 3 },
  { id: 'bugatti', name: 'Bugatti', nameBg: 'Бугати', level: 3 },
  { id: 'mclaren', name: 'McLaren', nameBg: 'Макларън', level: 3 },
  { id: 'aston-martin', name: 'Aston Martin', nameBg: 'Астън Мартин', level: 3 },
  { id: 'dodge', name: 'Dodge', nameBg: 'Додж', level: 3 },
  // ─── Ниво 4: „Камиони и бусове“ ───
  { id: 'iveco', name: 'Iveco', nameBg: 'Ивеко', level: 4 },
  { id: 'man', name: 'MAN', nameBg: 'МАН', tts: 'Ман', level: 4 },
  { id: 'scania', name: 'Scania', nameBg: 'Скания', level: 4 },
  { id: 'daf', name: 'DAF', nameBg: 'ДАФ', tts: 'Даф', level: 4 },
  { id: 'kamaz', name: 'Kamaz', nameBg: 'Камаз', level: 4 },
  { id: 'setra', name: 'Setra', nameBg: 'Сетра', level: 4 },
  // ─── Ниво 5: „Екзотика“ ───
  { id: 'koenigsegg', name: 'Koenigsegg', nameBg: 'Кьонигсег', level: 5 },
  { id: 'pagani', name: 'Pagani', nameBg: 'Пагани', level: 5 },
  { id: 'rimac', name: 'Rimac', nameBg: 'Римак', level: 5 },
  { id: 'lotus', name: 'Lotus', nameBg: 'Лотус', level: 5 },
  { id: 'alpine', name: 'Alpine', nameBg: 'Алпин', level: 5 },
  { id: 'abarth', name: 'Abarth', nameBg: 'Абарт', level: 5 },
  { id: 'lancia', name: 'Lancia', nameBg: 'Ланча', level: 5 },
  { id: 'hummer', name: 'Hummer', nameBg: 'Хамър', level: 5 },
];

export const BRANDS = DEFS.map((d) => ({
  id: d.id,
  name: d.name,
  nameBg: d.nameBg,
  tts: d.tts ?? d.nameBg,
  level: d.level,
  logo: `logos/${d.id}.png`,
  audio: `audio/name/${d.id}.mp3`,
  question: `audio/question/${d.id}.mp3`,
  enabledByDefault: d.level === 1,
}));

export const BRAND_BY_ID = Object.fromEntries(BRANDS.map((b) => [b.id, b]));

export function brandsUpToLevel(n) {
  return BRANDS.filter((b) => b.level <= n);
}

// Звуци за обратна връзка (без наказателни звуци — FR-023)
export const PRAISE_AUDIO = ['audio/ui/bravo.mp3', 'audio/ui/super.mp3', 'audio/ui/tochno-taka.mp3'];
export const TRY_AGAIN_AUDIO = 'audio/ui/opitaj-pak.mp3';
