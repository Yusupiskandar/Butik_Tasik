// Keranjang disimpan di localStorage. Harga di sini hanya untuk tampilan;
// server menghitung ulang harga saat pesanan dikirim ke WhatsApp.

const KUNCI = 'bt-keranjang-v1';
const $ = (s) => document.querySelector(s);
const fmt = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
export const rupiah = (n) => fmt.format(n);

const data = JSON.parse(document.getElementById('data-runway')?.textContent || '{}');

function baca() {
  try {
    const v = JSON.parse(localStorage.getItem(KUNCI));
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
function simpan() {
  try {
    localStorage.setItem(KUNCI, JSON.stringify(baris));
  } catch {
    /* mode privat / penyimpanan penuh: keranjang tetap jalan selama halaman terbuka */
  }
}

let baris = baca();
let cadangan = null;
let timerUndo;
let timerToast;

const kunci = (b) => [b.itemId, b.warna, b.peran, b.ukuran].join('|');
const ukuranAwal = (opsi) => (opsi.includes('M') ? 'M' : opsi[Math.floor((opsi.length - 1) / 2)] || '');

function gabung(list) {
  const peta = new Map();
  for (const b of list) {
    const k = kunci(b);
    if (peta.has(k)) peta.get(k).qty = Math.min(99, peta.get(k).qty + b.qty);
    else peta.set(k, { ...b });
  }
  return [...peta.values()];
}

const el = {
  laci: $('[data-laci]'),
  latar: $('[data-laci-latar]'),
  daftar: $('[data-laci-daftar]'),
  kosong: $('[data-laci-kosong]'),
  kaki: $('[data-laci-kaki]'),
  jumlah: $('[data-laci-jumlah]'),
  pcs: $('[data-laci-pcs]'),
  total: $('[data-laci-total]'),
  undo: $('[data-undo]'),
  undoTeks: $('[data-undo-teks]'),
  catatan: $('[data-wa-catatan]'),
  nama: $('[data-nama-pemesan]'),
  pesan: $('[data-pesan-wa]'),
  toast: $('[data-toast]'),
  hapusSemua: $('[data-hapus-semua]'),
};

function render() {
  const pcs = baris.reduce((s, b) => s + b.qty, 0);
  const total = baris.reduce((s, b) => s + b.qty * b.harga, 0);
  document.querySelectorAll('[data-jumlah-keranjang]').forEach((n) => (n.textContent = pcs));
  el.jumlah.textContent = pcs ? `· ${pcs}` : '';
  el.pcs.textContent = `(${pcs} pcs)`;
  el.total.textContent = rupiah(total);
  el.kosong.hidden = baris.length > 0;
  el.kaki.hidden = baris.length === 0;
  el.hapusSemua.hidden = baris.length === 0;

  el.daftar.innerHTML = baris
    .map(
      (b, i) => `<li class="baris">
      <div class="baris__thumb" aria-hidden="true">${b.nama.slice(0, 1)}</div>
      <div class="baris__isi">
        ${b.peran ? `<span class="label-kecil">${b.peran}</span>` : ''}
        <strong>${b.nama}</strong>
        <span class="baris__meta">${b.warna}</span>
        <div class="baris__kontrol">
          <button type="button" class="qty" data-kurang="${i}" aria-label="Kurangi">−</button>
          <span>${b.qty}</span>
          <button type="button" class="qty" data-tambah="${i}" aria-label="Tambah">+</button>
          <select class="ukuran" data-ukuran="${i}" aria-label="Ukuran">
            ${b.ukuranOpsi.map((u) => `<option ${u === b.ukuran ? 'selected' : ''}>${u}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="baris__kanan">
        <strong>${rupiah(b.harga * b.qty)}</strong>
        <button type="button" class="hapus" data-hapus="${i}" aria-label="Hapus ${b.nama}">Hapus</button>
      </div>
    </li>`
    )
    .join('');

  el.catatan.textContent = data.waAktif ? '' : 'Nomor WhatsApp butik belum diatur (WA_NUMBER di file .env).';
}

function ubah(fn) {
  fn();
  baris = gabung(baris);
  simpan();
  render();
}

function tawarkanUndo(teks) {
  el.undoTeks.textContent = teks;
  el.undo.hidden = false;
  clearTimeout(timerUndo);
  timerUndo = setTimeout(() => {
    el.undo.hidden = true;
    cadangan = null;
  }, 7000);
}

function toast(teks) {
  el.toast.textContent = teks;
  el.toast.classList.add('tampil');
  clearTimeout(timerToast);
  timerToast = setTimeout(() => el.toast.classList.remove('tampil'), 2200);
}

let fokusSebelum = null;
function buka() {
  fokusSebelum = document.activeElement;
  el.latar.hidden = false;
  el.laci.setAttribute('aria-hidden', 'false');
  requestAnimationFrame(() => document.body.classList.add('laci-buka'));
  el.laci.querySelector('[data-tutup-keranjang]').focus();
}
function tutup() {
  document.body.classList.remove('laci-buka');
  el.laci.setAttribute('aria-hidden', 'true');
  setTimeout(() => (el.latar.hidden = true), 250);
  fokusSebelum?.focus?.();
}

el.daftar.addEventListener('click', (e) => {
  const t = e.target.closest('button');
  if (!t) return;
  const i = Number(t.dataset.kurang ?? t.dataset.tambah ?? t.dataset.hapus);
  if (t.dataset.tambah !== undefined) ubah(() => (baris[i].qty = Math.min(99, baris[i].qty + 1)));
  else if (t.dataset.kurang !== undefined) ubah(() => (baris[i].qty > 1 ? baris[i].qty-- : baris.splice(i, 1)));
  else if (t.dataset.hapus !== undefined) {
    cadangan = baris.map((b) => ({ ...b }));
    const nama = baris[i].nama;
    ubah(() => baris.splice(i, 1));
    tawarkanUndo(`${nama} dihapus.`);
  }
});

el.daftar.addEventListener('change', (e) => {
  const s = e.target.closest('[data-ukuran]');
  if (s) ubah(() => (baris[Number(s.dataset.ukuran)].ukuran = s.value));
});

el.hapusSemua.addEventListener('click', () => {
  const pcs = baris.reduce((s, b) => s + b.qty, 0);
  cadangan = baris.map((b) => ({ ...b }));
  ubah(() => (baris = []));
  tawarkanUndo(`${pcs} pcs dihapus.`);
});

$('[data-undo-btn]').addEventListener('click', () => {
  if (cadangan) ubah(() => (baris = cadangan));
  cadangan = null;
  el.undo.hidden = true;
});

el.pesan.addEventListener('click', async () => {
  if (!data.waAktif) {
    toast('Nomor WhatsApp butik belum diatur.');
    return;
  }
  el.pesan.disabled = true;
  try {
    const res = await fetch('/api/checkout/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nama: el.nama.value.trim() || undefined,
        items: baris.map(({ itemId, qty, warna, ukuran, peran }) => ({ itemId, qty, warna, ukuran, peran: peran || undefined })),
      }),
    });
    const hasil = await res.json();
    if (!res.ok) throw new Error(hasil.error);
    window.open(hasil.url, '_blank', 'noopener');
  } catch (err) {
    toast(err.message || 'Gagal membuat pesanan, coba lagi.');
  } finally {
    el.pesan.disabled = false;
  }
});

document.querySelectorAll('[data-buka-keranjang]').forEach((b) => b.addEventListener('click', buka));
document.querySelectorAll('[data-tutup-keranjang]').forEach((b) => b.addEventListener('click', tutup));
el.latar.addEventListener('click', tutup);
document.addEventListener('keydown', (e) => e.key === 'Escape' && document.body.classList.contains('laci-buka') && tutup());

export const cart = {
  tambah(list, label) {
    const baru = list.map((b) => ({ ...b, qty: 1, ukuran: ukuranAwal(b.ukuranOpsi) }));
    ubah(() => baris.push(...baru));
    toast(`${label || baru[0].nama} masuk keranjang`);
  },
  terbuka: () => document.body.classList.contains('laci-buka'),
};

render();
