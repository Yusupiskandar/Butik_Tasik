import { gambarLook } from './figures.js';
import { cart, rupiah } from './cart.js';

const data = JSON.parse(document.getElementById('data-runway').textContent);
const $ = (s) => document.querySelector(s);

const el = {
  deret: $('[data-deret]'),
  info: $('.panggung__info'),
  nomor: $('[data-nomor]'),
  nama: $('[data-nama]'),
  deskripsi: $('[data-deskripsi]'),
  warna: $('[data-warna]'),
  progres: $('[data-progres]'),
  panel: $('.panel'),
  daftar: $('[data-daftar-item]'),
  tambahLook: $('[data-tambah-look]'),
  sebelum: $('[data-sebelum]'),
  berikut: $('[data-berikut]'),
  lanjut: $('[data-lanjut]'),
};

const URUTAN_SEGMEN = Object.keys(data.semua);
const pad = (n) => String(n).padStart(2, '0');
const kurangiGerak = matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE = 'cubic-bezier(.22, .8, .24, 1)';

// Pilihan pembeli per segmen tetap diingat saat pindah tab: look terakhir, warna, item yang dilepas.
const ingatan = {};
function ingatanSegmen(kode) {
  return (ingatan[kode] ??= {
    aktif: 0,
    state: data.semua[kode].map(() => ({ warna: 0, lepas: new Set() })),
  });
}

// Segmen yang sedang tampil.
let segmen, looks, state, keluarga, aktif, slots = [];

const dipakai = (i) => looks[i].items.filter((_, idx) => !state[i].lepas.has(idx));
const warnaAktif = (i) => looks[i].warna[state[i].warna];

// ---------- panggung ----------

function pasangSegmen(kode, idxAwal) {
  const ing = ingatanSegmen(kode);
  segmen = kode;
  looks = data.semua[kode];
  state = ing.state;
  keluarga = kode === 'keluarga';
  aktif = Math.max(0, Math.min(looks.length - 1, idxAwal ?? ing.aktif));

  el.deret.classList.add('tanpa-transisi');
  el.deret.replaceChildren();
  slots = looks.map((look, i) => {
    const slot = document.createElement('button');
    slot.type = 'button';
    slot.className = 'slot' + (keluarga ? ' slot--lebar' : '');
    slot.setAttribute('aria-label', `Set ${look.nama}`);
    slot.addEventListener('click', () => pilih(i));
    el.deret.append(slot);
    return slot;
  });
  looks.forEach((_, i) => gambar(i));
  render();
  el.deret.getBoundingClientRect(); // paksa posisi awal diterapkan tanpa animasi
  el.deret.classList.remove('tanpa-transisi');
  tandaiTab(kode);
}

function tandaiTab(kode) {
  document.querySelectorAll('.segmen a').forEach((a) => {
    const cocok = new URL(a.href).searchParams.get('segmen') === kode;
    cocok ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current');
  });
}

// Pakai foto model kalau ada untuk warna ini; kalau belum ada, pakai ilustrasi SVG.
function gambar(i) {
  const w = warnaAktif(i);
  const foto = Boolean(w.foto_model);
  slots[i].classList.toggle('slot--foto', foto);
  slots[i].innerHTML = foto
    ? `<img class="foto" src="${w.foto_model}" alt="${looks[i].nama} warna ${w.nama_warna}" draggable="false" decoding="async">`
    : gambarLook(segmen, w.kode_hex, dipakai(i));
}

// Potongan foto model sebagai gambar kecil item: posisi vertikal dari kategori, horizontal dari peran (keluarga).
const POS_Y = { Kerudung: 14, Aksesori: 22, Gamis: 45, Atasan: 38, Setelan: 45, Bawahan: 78 };
const POS_X = { Ayah: 14, 'Anak Laki-laki': 40, 'Anak Perempuan': 60, Ibu: 86 };
function thumbStyle(it, w) {
  if (!w.foto_model) return `--c:${w.kode_hex}`;
  const x = keluarga ? POS_X[it.peran] ?? 50 : 50;
  const nama = it.nama.toLowerCase();
  // Di foto anak, kepala letaknya lebih rendah daripada di foto dewasa.
  const anak = segmen === 'anak_pr' || segmen === 'anak_lk';
  const y = nama.includes('peci') ? (anak ? 12 : 3) : nama.includes('bros') ? 30 : nama.includes('sorban') ? 32 : POS_Y[it.kategori] ?? 45;
  const size = keluarga ? '560%' : '300%';
  return `--c:${w.kode_hex};background-image:url('${w.foto_model}');background-size:${size};background-position:${x}% ${y}%`;
}

function aturPosisi() {
  slots.forEach((slot, i) => {
    // Antrean berperspektif seperti runway: tiap look di belakang bergeser ke kiri dengan jarak yang makin rapat,
    // makin kecil, sedikit naik (lebih jauh), dan makin blur.
    // Langkah dalam % lebar slot; slot foto lebih lebar (ada ruang latar) jadi langkahnya lebih kecil.
    const foto = slot.classList.contains('slot--foto');
    const langkah = keluarga ? (foto ? 46 : 52) : foto ? 50 : 70;
    const d = i - aktif;
    let t;
    if (d === 0) t = { x: 0, y: 0, s: 1, blur: 0, op: 1 };
    else if (d > 0) {
      let x = 0;
      for (let k = 0; k < d; k++) x -= langkah * Math.pow(0.8, k);
      t = { x, y: -d * 2.2, s: Math.pow(0.88, d), blur: Math.min(d * 1.6, 6), op: Math.max(0.25, 1 - d * 0.16) };
    } else t = { x: 45, y: 0, s: 1.06, blur: 4, op: 0 };
    slot.style.transform = `translate(${t.x}%, ${t.y}%) scale(${t.s})`;
    slot.style.filter = t.blur ? `blur(${t.blur}px)` : 'none';
    slot.style.opacity = t.op;
    // Look yang sudah lewat ditaruh di belakang semua look lain selama memudar.
    slot.style.zIndex = d < 0 ? 10 : 100 - d;
    slot.style.pointerEvents = d < 0 ? 'none' : 'auto';
    slot.tabIndex = d === 0 ? -1 : 0;
    slot.classList.toggle('slot--aktif', d === 0);
    slot.classList.toggle('slot--lewat', d < 0);
  });
}

// ---------- info & panel ----------

function renderInfo() {
  const look = looks[aktif];
  el.nomor.textContent = `Set ${pad(aktif + 1)} dari ${pad(looks.length)}`;
  el.nama.textContent = look.nama;
  el.nama.classList.toggle('panggung__nama--panjang', look.nama.length > 10);
  el.deskripsi.textContent = look.deskripsi;

  el.warna.innerHTML = look.warna
    .map(
      (w, idx) => `<button type="button" role="radio" class="warna__titik" style="--c:${w.kode_hex}"
        aria-checked="${idx === state[aktif].warna}" aria-label="${w.nama_warna}" title="${w.nama_warna}" data-idx="${idx}"></button>`
    )
    .join('') + `<span class="warna__nama">${warnaAktif(aktif).nama_warna}</span>`;

  el.progres.innerHTML = looks.map((_, i) => `<span class="${i === aktif ? 'aktif' : ''}"></span>`).join('');
  // Tombol panah hanya mati di ujung paling awal / paling akhir seluruh koleksi.
  const terakhir = aktif === looks.length - 1;
  const lanjutKe = terakhir ? segmenTetangga(1) : null;
  const mundurKe = aktif === 0 ? segmenTetangga(-1) : null;
  el.sebelum.disabled = aktif === 0 && !mundurKe;
  el.berikut.disabled = terakhir && !lanjutKe;
  el.sebelum.title = mundurKe ? `Kembali ke ${labelSegmen(mundurKe)}` : 'Set sebelumnya';
  el.berikut.title = lanjutKe ? `Lanjut ke ${labelSegmen(lanjutKe)}` : 'Set berikutnya';

  // Petunjuk di set terakhir: koleksi berlanjut ke tab berikutnya.
  el.lanjut.hidden = !lanjutKe;
  if (lanjutKe) el.lanjut.innerHTML = `Lanjut ke <strong>${labelSegmen(lanjutKe)}</strong> <span aria-hidden="true">→</span>`;
}

function renderPanel() {
  const look = looks[aktif];
  const w = warnaAktif(aktif);
  const total = dipakai(aktif).reduce((s, it) => s + it.harga, 0);
  el.tambahLook.innerHTML = `<span aria-hidden="true">＋</span> Ambil satu set · ${rupiah(total)}`;

  el.daftar.innerHTML = look.items
    .map((it, idx) => {
      const lepas = state[aktif].lepas.has(idx);
      return `<li class="item ${lepas ? 'item--lepas' : ''}">
        <div class="item__teks">
          <span class="label-kecil">${it.peran ? `${it.peran} · ` : ''}${it.kategori}</span>
          <strong>${lepas ? `Tanpa ${it.nama.toLowerCase()}` : it.nama}</strong>
          <span class="item__harga">${rupiah(it.harga)}</span>
          ${it.opsional ? `<button type="button" class="tombol-teks tombol-teks--kecil" data-toggle="${idx}">${lepas ? 'Pakai lagi' : 'Lepas'}</button>` : ''}
        </div>
        <div class="item__thumb ${w.foto_model ? 'item__thumb--foto' : ''}" style="${thumbStyle(it, w)}">${w.foto_model ? '' : it.kategori.slice(0, 1)}</div>
        <button type="button" class="bulat bulat--kecil item__tambah" data-tambah="${idx}" aria-label="Tambah ${it.nama} ke keranjang" ${lepas ? 'disabled' : ''}>+</button>
      </li>`;
    })
    .join('');
  cekSisaDaftar();
}

// Gradasi bawah daftar item hanya tampil kalau masih ada item yang belum terlihat.
function cekSisaDaftar() {
  const d = el.daftar;
  d.classList.toggle('panel__daftar--ada-lagi', d.scrollTop + d.clientHeight < d.scrollHeight - 4);
}
el.daftar.addEventListener('scroll', cekSisaDaftar, { passive: true });
addEventListener('resize', cekSisaDaftar);

function urlSekarang() {
  const url = new URL(location.href);
  url.searchParams.set('segmen', segmen);
  url.searchParams.set('look', looks[aktif].slug);
  return url;
}

function render() {
  ingatanSegmen(segmen).aktif = aktif;
  aturPosisi();
  renderInfo();
  renderPanel();
  history.replaceState({ segmen }, '', urlSekarang());
}

// Teks & isi panel masuk perlahan dari arah perpindahan (arah = 1 maju, -1 mundur).
function animasiMasuk(arah, jeda = 0) {
  if (kurangiGerak) return;
  const geser = 18 * arah;
  [el.nomor, el.nama, el.deskripsi, el.warna].forEach((node, k) =>
    node.animate(
      [{ opacity: 0, transform: `translateX(${geser}px)` }, { opacity: 1, transform: 'none' }],
      { duration: 650, delay: jeda + 120 + k * 60, easing: EASE, fill: 'backwards' }
    )
  );
  [...el.daftar.children].forEach((li, k) =>
    li.animate(
      [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }],
      { duration: 550, delay: jeda + 80 + k * 55, easing: EASE, fill: 'backwards' }
    )
  );
}

// Runway bersambung antar tab: tab tetangga yang punya isi (arah 1 = berikutnya, -1 = sebelumnya), null di ujung.
function segmenTetangga(arah) {
  for (let k = URUTAN_SEGMEN.indexOf(segmen) + arah; k >= 0 && k < URUTAN_SEGMEN.length; k += arah) {
    if (data.semua[URUTAN_SEGMEN[k]].length) return URUTAN_SEGMEN[k];
  }
  return null;
}

const labelSegmen = (kode) =>
  [...document.querySelectorAll('.segmen a')].find((a) => new URL(a.href).searchParams.get('segmen') === kode)?.textContent.trim() ?? kode;

function pilih(i) {
  if (sedangGanti) return;
  // Lewat dari set terakhir → set pertama tab berikutnya; mundur dari set pertama → set terakhir tab sebelumnya.
  if (i >= looks.length || i < 0) {
    const arah = i < 0 ? -1 : 1;
    const kode = segmenTetangga(arah);
    if (!kode) return;
    const daftar = data.semua[kode];
    gantiSegmen(kode, { look: (arah > 0 ? daftar[0] : daftar[daftar.length - 1]).slug });
    return;
  }
  if (i === aktif) return;
  const arah = i > aktif ? 1 : -1;
  aktif = i;
  el.daftar.scrollTop = 0; // set baru: daftar item mulai dari atas
  render();
  animasiMasuk(arah);
}

// ---------- pindah tab segmen tanpa reload ----------

let sedangGanti = false;
let antrean = null;

const tunggu = (anim) => anim.finished.catch(() => {});
const tungguGambar = (ms) =>
  Promise.race([
    Promise.all([...el.deret.querySelectorAll('img')].map((img) => img.decode().catch(() => {}))),
    new Promise((r) => setTimeout(r, ms)),
  ]);

async function gantiSegmen(kode, { push = true, look } = {}) {
  if (!data.semua[kode]) return;
  if (sedangGanti) return void (antrean = { kode, push, look });
  if (kode === segmen) return;

  const arah = URUTAN_SEGMEN.indexOf(kode) > URUTAN_SEGMEN.indexOf(segmen) ? 1 : -1;
  const idxLook = look ? Math.max(0, data.semua[kode].findIndex((l) => l.slug === look)) : undefined;

  // Tambah entri riwayat DULU (sebelum render memanggil replaceState), supaya tombol Back kembali ke tab sebelumnya.
  const tambahRiwayat = () => {
    if (!push) return;
    const u = new URL(location.href);
    u.searchParams.set('segmen', kode);
    u.searchParams.delete('look');
    history.pushState({ segmen: kode }, '', u);
  };

  if (kurangiGerak) {
    tambahRiwayat();
    pasangSegmen(kode, idxLook);
    return;
  }

  sedangGanti = true;
  tandaiTab(kode); // garis bawah tab langsung pindah begitu diklik
  // 1) Runway lama keluar: bergeser berlawanan arah sambil memudar, info & panel ikut memudar.
  const keluar = [
    el.deret.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateX(${-50 * arah}px)` }],
      { duration: 340, easing: 'cubic-bezier(.55, 0, .75, .2)', fill: 'forwards' }),
    el.info.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, easing: 'ease-in', fill: 'forwards' }),
    el.daftar.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, easing: 'ease-in', fill: 'forwards' }),
  ];
  await Promise.all(keluar.map(tunggu));

  // 2) Pasang segmen baru (posisi awal tanpa transisi), tunggu foto siap supaya tidak "berkedip".
  tambahRiwayat();
  pasangSegmen(kode, idxLook);
  el.panel.scrollTop = 0;
  el.daftar.scrollTop = 0;
  cekSisaDaftar();
  await tungguGambar(300);
  keluar.forEach((a) => a.cancel());

  // 3) Runway baru masuk dari arah perpindahan; antrean di belakang menyusul satu per satu.
  el.deret.animate([{ opacity: 0, transform: `translateX(${70 * arah}px)` }, { opacity: 1, transform: 'none' }],
    { duration: 800, easing: EASE, fill: 'backwards' });
  slots.forEach((slot, i) => {
    const d = i - aktif;
    if (d < 0) return;
    slot.firstElementChild?.animate(
      [{ opacity: 0, transform: `translateX(${30 * arah}px)` }, { opacity: 1, transform: 'none' }],
      { duration: 750, delay: d * 90, easing: EASE, fill: 'backwards' }
    );
  });
  el.info.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, fill: 'backwards' });
  animasiMasuk(arah, 60);

  setTimeout(() => {
    sedangGanti = false;
    if (antrean) {
      const a = antrean;
      antrean = null;
      gantiSegmen(a.kode, a);
    }
  }, 380);
}

document.querySelector('.segmen').addEventListener('click', (e) => {
  const a = e.target.closest('a[href]');
  if (!a || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return; // biarkan buka di tab baru
  const kode = new URL(a.href).searchParams.get('segmen');
  if (!data.semua[kode]) return;
  e.preventDefault();
  gantiSegmen(kode);
});

window.addEventListener('popstate', () => {
  const p = new URL(location.href).searchParams;
  const kode = data.semua[p.get('segmen')] ? p.get('segmen') : 'wanita';
  if (kode !== segmen) gantiSegmen(kode, { push: false, look: p.get('look') });
  else {
    const i = looks.findIndex((l) => l.slug === p.get('look'));
    if (i >= 0) pilih(i);
  }
});

// Muat foto segmen lain di latar belakang supaya pindah tab tidak menunggu unduhan.
function pramuatFoto() {
  for (const kode of URUTAN_SEGMEN) {
    if (kode === segmen) continue;
    for (const look of data.semua[kode]) {
      for (const w of look.warna) {
        if (w.foto_model) new Image().src = w.foto_model;
      }
    }
  }
}

// ---------- aksi ----------

const barisKeranjang = (it) => ({
  itemId: it.id,
  nama: it.nama,
  harga: it.harga,
  warna: warnaAktif(aktif).nama_warna,
  peran: it.peran || '',
  ukuranOpsi: [...new Set(it.varian.map((v) => v.ukuran))],
});

el.warna.addEventListener('click', (e) => {
  const b = e.target.closest('[data-idx]');
  if (!b) return;
  state[aktif].warna = Number(b.dataset.idx);
  gambar(aktif);
  renderInfo();
  renderPanel();
});

el.daftar.addEventListener('click', (e) => {
  const tambah = e.target.closest('[data-tambah]');
  const toggle = e.target.closest('[data-toggle]');
  if (tambah) {
    const it = looks[aktif].items[Number(tambah.dataset.tambah)];
    cart.tambah([barisKeranjang(it)]);
  } else if (toggle) {
    const idx = Number(toggle.dataset.toggle);
    const lepas = state[aktif].lepas;
    lepas.has(idx) ? lepas.delete(idx) : lepas.add(idx);
    gambar(aktif);
    renderPanel();
  }
});

el.tambahLook.addEventListener('click', () => {
  cart.tambah(dipakai(aktif).map(barisKeranjang), `Set ${looks[aktif].nama}`);
});

el.sebelum.addEventListener('click', () => pilih(aktif - 1));
el.berikut.addEventListener('click', () => pilih(aktif + 1));
el.lanjut.addEventListener('click', () => pilih(looks.length));

document.addEventListener('keydown', (e) => {
  if (e.target.closest('input, textarea') || cart.terbuka()) return;
  if (e.key === 'ArrowRight') pilih(aktif + 1);
  if (e.key === 'ArrowLeft') pilih(aktif - 1);
});

// Satu gerakan scroll = pindah satu look. Sisa scroll (inersia trackpad) diabaikan sampai gerakan berhenti.
let jedaGulir = 0;
let gulirTerakhir = 0;
document.querySelector('.panggung').addEventListener(
  'wheel',
  (e) => {
    const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    e.preventDefault();
    const now = Date.now();
    const gerakanBaru = now - gulirTerakhir > 200; // jeda antar event = gerakan scroll baru
    gulirTerakhir = now;
    if (Math.abs(delta) < 8) return;
    const sejakPindah = now - jedaGulir;
    if (sejakPindah < 700 || (!gerakanBaru && sejakPindah < 1300)) return;
    jedaGulir = now;
    pilih(aktif + (delta > 0 ? 1 : -1));
  },
  { passive: false }
);

// Geser (swipe) di HP.
let sentuhX = null;
el.deret.addEventListener('touchstart', (e) => (sentuhX = e.touches[0].clientX), { passive: true });
el.deret.addEventListener('touchend', (e) => {
  if (sentuhX === null) return;
  const dx = e.changedTouches[0].clientX - sentuhX;
  if (Math.abs(dx) > 40) pilih(aktif + (dx < 0 ? 1 : -1));
  sentuhX = null;
});

// ---------- mulai ----------

pasangSegmen(data.segmen, data.awal);
requestAnimationFrame(() => document.body.classList.add('siap'));
(window.requestIdleCallback || ((f) => setTimeout(f, 1500)))(pramuatFoto);
