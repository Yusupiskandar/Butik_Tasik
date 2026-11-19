// Ilustrasi SVG model berbusana — pengganti sementara foto model AI.
// Bentuk pakaian ditentukan dari item di dalam look; warnanya dari colour story aktif.

const KULIT = '#e6c3a1';
const KULIT_GELAP = '#d1a983';

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const f = (c) => Math.max(0, Math.min(255, Math.round(c + (amt < 0 ? c * amt : (255 - c) * amt))));
  const r = f(n >> 16), g = f((n >> 8) & 255), b = f(n & 255);
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

const punya = (items, kata) => items.some((i) => i.nama.toLowerCase().includes(kata));
const punyaKategori = (items, k) => items.some((i) => i.kategori === k);

// ---------- bagian-bagian ----------

const bayangan = `<ellipse cx="100" cy="508" rx="62" ry="7" fill="rgba(60,50,30,.14)"/>`;

function sepatu(warna = '#5b4a3a') {
  return `<ellipse cx="86" cy="501" rx="13" ry="6" fill="${warna}"/><ellipse cx="114" cy="501" rx="13" ry="6" fill="${warna}"/>`;
}

function motifBatik(id, dasar) {
  const g = shade(dasar, -0.35), t = shade(dasar, 0.45);
  return `<pattern id="${id}" width="22" height="22" patternUnits="userSpaceOnUse">
    <rect width="22" height="22" fill="${dasar}"/>
    <circle cx="11" cy="11" r="5" fill="none" stroke="${g}" stroke-width="1.4"/>
    <circle cx="11" cy="11" r="1.6" fill="${t}"/>
    <path d="M0 0 L4 4 M22 0 L18 4 M0 22 L4 18 M22 22 L18 18" stroke="${g}" stroke-width="1.2"/>
  </pattern>`;
}

function motifKotak(id, dasar) {
  const g = shade(dasar, -0.25);
  return `<pattern id="${id}" width="16" height="16" patternUnits="userSpaceOnUse">
    <rect width="16" height="16" fill="${dasar}"/>
    <path d="M0 8 H16 M8 0 V16" stroke="${g}" stroke-width="2.2" opacity=".55"/>
  </pattern>`;
}

function defs(uid, warna) {
  return `<defs>
    <linearGradient id="lipat-${uid}" x1="0" x2="1">
      <stop offset="0" stop-color="#000" stop-opacity=".16"/>
      <stop offset=".35" stop-color="#fff" stop-opacity=".10"/>
      <stop offset=".65" stop-color="#fff" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity=".18"/>
    </linearGradient>
    ${motifBatik(`batik-${uid}`, shade(warna, -0.15))}
    ${motifKotak(`kotak-${uid}`, shade(warna, -0.2))}
  </defs>`;
}

// Tangan bertaut di depan pinggang (pose wanita) dengan lengan baju.
function lenganBertaut(warna, yTangan = 262) {
  const g = shade(warna, -0.08);
  return `
    <path d="M70 122 Q52 190 66 ${yTangan - 4} L92 ${yTangan + 4} Q84 200 86 132 Z" fill="${g}"/>
    <path d="M130 122 Q148 190 134 ${yTangan - 4} L108 ${yTangan + 4} Q116 200 114 132 Z" fill="${g}"/>
    <ellipse cx="100" cy="${yTangan + 2}" rx="13" ry="9" fill="${KULIT}"/>`;
}

// Lengan lurus di samping badan (pose pria).
function lenganSamping(warna, panjang = 300) {
  const g = shade(warna, -0.08);
  return `
    <path d="M68 116 Q52 200 54 ${panjang} L72 ${panjang} Q74 210 82 128 Z" fill="${g}"/>
    <path d="M132 116 Q148 200 146 ${panjang} L128 ${panjang} Q126 210 118 128 Z" fill="${g}"/>
    <ellipse cx="63" cy="${panjang + 9}" rx="8" ry="11" fill="${KULIT}"/>
    <ellipse cx="137" cy="${panjang + 9}" rx="8" ry="11" fill="${KULIT}"/>`;
}

function kepalaHijab(warna) {
  const h = shade(warna, 0.25), g = shade(warna, 0.05);
  return `
    <path d="M100 34 C66 34 58 66 60 96 C56 128 54 158 64 182 Q100 200 136 182 C146 158 144 128 140 96 C142 66 134 34 100 34 Z" fill="${h}"/>
    <path d="M64 182 Q100 200 136 182 L132 170 Q100 186 68 170 Z" fill="${g}" opacity=".6"/>
    <ellipse cx="100" cy="86" rx="20" ry="25" fill="${KULIT}"/>
    <path d="M80 78 Q100 58 120 78 Q118 62 100 58 Q82 62 80 78 Z" fill="${h}"/>`;
}

function kepalaPria({ peci, anak = false }) {
  return `
    <rect x="93" y="98" width="14" height="16" fill="${KULIT_GELAP}"/>
    <ellipse cx="100" cy="74" rx="20" ry="25" fill="${KULIT}"/>
    <path d="M80 70 Q80 46 100 46 Q120 46 120 70 Q114 56 100 56 Q86 56 80 70 Z" fill="#2b2420"/>
    ${peci ? `<path d="M80 60 L82 38 Q100 33 118 38 L120 60 Q100 55 80 60 Z" fill="#1f1d1c"/>
              <path d="M82 40 Q100 35 118 40" stroke="#3a3735" stroke-width="2" fill="none"/>` : ''}
    ${anak ? '' : ''}`;
}

function bros(x = 118, y = 150) {
  return `<g><circle cx="${x}" cy="${y}" r="6.5" fill="#d8b24a"/><circle cx="${x}" cy="${y}" r="2.6" fill="#fff6dc"/></g>`;
}

function bordirHem(y, warna, x1 = 50, x2 = 150) {
  const t = shade(warna, 0.5);
  let s = '';
  for (let x = x1; x <= x2; x += 10) s += `<circle cx="${x}" cy="${y}" r="2.2" fill="${t}" opacity=".9"/>`;
  return s;
}

// ---------- figur ----------

function wanita(uid, warna, items) {
  const gamis = punyaKategori(items, 'Gamis');
  const batik = punya(items, 'batik');
  const kulot = punya(items, 'kulot');
  const tunik = punya(items, 'tunik');
  let badan;

  if (gamis) {
    badan = `
      <path d="M70 118 Q100 108 130 118 L138 205 Q152 360 164 498 L36 498 Q48 360 62 205 Z" fill="${warna}"/>
      <path d="M70 118 Q100 108 130 118 L138 205 Q152 360 164 498 L36 498 Q48 360 62 205 Z" fill="url(#lipat-${uid})"/>
      ${bordirHem(488, warna, 44, 156)}
      ${bordirHem(470, warna, 48, 152)}`;
  } else {
    const panjangAtas = tunik ? 360 : 330;
    const bawahFill = batik ? `url(#batik-${uid})` : shade(warna, -0.18);
    const bawah = kulot
      ? `<path d="M64 ${panjangAtas - 20} L136 ${panjangAtas - 20} L148 496 L104 496 L100 380 L96 496 L52 496 Z" fill="${bawahFill}"/>`
      : `<path d="M64 ${panjangAtas - 20} L136 ${panjangAtas - 20} Q150 420 156 498 L44 498 Q50 420 64 ${panjangAtas - 20} Z" fill="${bawahFill}"/>`;
    badan = `
      ${bawah}
      <path d="M70 118 Q100 108 130 118 L140 ${panjangAtas} Q100 ${panjangAtas + 10} 60 ${panjangAtas} Z" fill="${warna}"/>
      <path d="M70 118 Q100 108 130 118 L140 ${panjangAtas} Q100 ${panjangAtas + 10} 60 ${panjangAtas} Z" fill="url(#lipat-${uid})"/>
      ${bordirHem(panjangAtas - 6, warna, 66, 134)}`;
  }

  return `${bayangan}${sepatu('#a8876a')}${badan}${lenganBertaut(warna)}${kepalaHijab(warna)}
    ${punya(items, 'bros') ? bros() : ''}`;
}

function pria(uid, warna, items) {
  const jubah = punyaKategori(items, 'Gamis');
  const sarung = punya(items, 'sarung');
  const peci = punya(items, 'peci');
  const sorban = punya(items, 'sorban');
  const kurta = punya(items, 'panjang kerah') || punya(items, 'koko panjang'); // koko panjang selutut
  let badan;

  if (jubah) {
    badan = `
      <path d="M66 112 Q100 102 134 112 L142 260 Q148 380 150 496 L50 496 Q52 380 58 260 Z" fill="${warna}"/>
      <path d="M66 112 Q100 102 134 112 L142 260 Q148 380 150 496 L50 496 Q52 380 58 260 Z" fill="url(#lipat-${uid})"/>
      <path d="M100 112 V250" stroke="${shade(warna, -0.2)}" stroke-width="2"/>`;
  } else {
    const panjangAtas = kurta ? 360 : 318;
    const bawah = sarung
      ? `<path d="M62 300 L138 300 L142 494 L58 494 Z" fill="url(#kotak-${uid})"/>
         <path d="M62 300 L138 300 L138 316 L62 316 Z" fill="${shade(warna, -0.3)}" opacity=".5"/>`
      : `<path d="M66 300 L134 300 L136 494 L104 494 L100 360 L96 494 L64 494 Z" fill="${shade(warna, -0.35)}"/>`;
    badan = `
      ${bawah}
      <path d="M66 112 Q100 102 134 112 L140 ${panjangAtas} L60 ${panjangAtas} Z" fill="${warna}"/>
      <path d="M66 112 Q100 102 134 112 L140 ${panjangAtas} L60 ${panjangAtas} Z" fill="url(#lipat-${uid})"/>
      <path d="M100 112 V200" stroke="${shade(warna, -0.25)}" stroke-width="2"/>
      ${[130, 150, 170, 190].map((y) => `<circle cx="100" cy="${y}" r="2.2" fill="${shade(warna, 0.5)}"/>`).join('')}
      <path d="M86 112 Q100 120 114 112" stroke="${shade(warna, -0.3)}" stroke-width="3" fill="none"/>
      <rect x="112" y="150" width="16" height="3" rx="1.5" fill="${shade(warna, -0.2)}"/>`;
  }

  return `${bayangan}${sepatu('#3e3029')}${badan}${lenganSamping(warna)}
    ${sorban ? `<path d="M72 114 L122 114 L84 330 L70 326 Z" fill="${shade(warna, 0.55)}" opacity=".95"/>` : ''}
    ${kepalaPria({ peci })}`;
}

// Gambar satu orang. jenis: wanita | pria | anak_pr | anak_lk
function orang(uid, jenis, warna, items) {
  if (jenis === 'wanita') return wanita(uid, warna, items);
  if (jenis === 'pria') return pria(uid, warna, items);
  const isi = jenis === 'anak_pr' ? wanita(uid, warna, items) : pria(uid, warna, items);
  // Anak: versi lebih kecil, kaki tetap di lantai.
  return `<g transform="translate(100 510) scale(0.62) translate(-100 -510)">${isi}</g>`;
}

let counter = 0;

/**
 * @param {string} segmen  wanita | pria | anak_pr | anak_lk | keluarga
 * @param {string} warna   kode hex
 * @param {Array<{nama:string,kategori:string,peran:string|null}>} items  item yang sedang dipakai
 */
export function gambarLook(segmen, warna, items) {
  const uid = `f${++counter}`;
  if (segmen !== 'keluarga') {
    return `<svg viewBox="0 0 200 520" class="figur" aria-hidden="true">${defs(uid, warna)}${orang(uid, segmen, warna, items)}</svg>`;
  }
  const per = (peran) => items.filter((i) => i.peran === peran);
  // Orang tua digambar dulu supaya anak-anak tampil di depan.
  const susunan = [
    ['pria', 'Ayah', 0],
    ['wanita', 'Ibu', 330],
    ['anak_lk', 'Anak Laki-laki', 118],
    ['anak_pr', 'Anak Perempuan', 218],
  ];
  const isi = susunan
    .map(([jenis, peran, x]) => `<g transform="translate(${x} 0)">${orang(uid, jenis, warna, per(peran))}</g>`)
    .join('');
  return `<svg viewBox="0 0 530 520" class="figur figur--keluarga" aria-hidden="true">${defs(uid, warna)}${isi}</svg>`;
}
