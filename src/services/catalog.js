import { db } from '../db/index.js';

const stmt = {
  activeCollection: db.prepare('SELECT * FROM collections WHERE aktif = 1 ORDER BY urutan, id LIMIT 1'),
  collectionBySlug: db.prepare('SELECT * FROM collections WHERE slug = ? AND aktif = 1'),
  looks: db.prepare(
    'SELECT id, slug, segmen, nama, deskripsi, urutan FROM looks WHERE collection_id = ? AND segmen = ? AND aktif = 1 ORDER BY urutan, id'
  ),
  look: db.prepare('SELECT * FROM looks WHERE id = ? AND aktif = 1'),
  colours: db.prepare('SELECT id, nama_warna, kode_hex, foto_model FROM colour_stories WHERE look_id = ? ORDER BY urutan, id'),
  lookItems: db.prepare(`
    SELECT i.id, i.nama, i.kategori, i.deskripsi, i.harga, i.foto, li.peran, li.opsional
    FROM look_items li JOIN items i ON i.id = li.item_id
    WHERE li.look_id = ? ORDER BY li.urutan`),
  variants: db.prepare('SELECT id, warna, ukuran, stok FROM item_variants WHERE item_id = ? ORDER BY id'),
};

const totalWajib = (items) => items.filter((i) => !i.opsional).reduce((s, i) => s + i.harga, 0);

export function getActiveCollection() {
  return stmt.activeCollection.get() ?? null;
}

export function getCollection(slug) {
  return stmt.collectionBySlug.get(slug) ?? null;
}

export function listLooks(collectionId, segmen) {
  return stmt.looks.all(collectionId, segmen).map((look) => {
    const items = stmt.lookItems.all(look.id);
    return {
      ...look,
      warna: stmt.colours.all(look.id),
      jumlahItem: items.length,
      totalHarga: totalWajib(items),
    };
  });
}

export function getLook(id) {
  const look = stmt.look.get(id);
  if (!look) return null;
  const items = stmt.lookItems.all(id).map((item) => ({
    ...item,
    peran: item.peran || null,
    opsional: Boolean(item.opsional),
    varian: stmt.variants.all(item.id),
  }));
  return { ...look, warna: stmt.colours.all(id), items, totalHarga: totalWajib(items) };
}

/** Harga selalu diambil dari database, bukan dari browser, supaya tidak bisa dimanipulasi. */
export function priceCart(lines) {
  const ids = [...new Set(lines.map((l) => l.itemId))];
  if (ids.length === 0) return { baris: [], total: 0 };
  const rows = db.prepare(`SELECT id, nama, harga FROM items WHERE id IN (${ids.map(() => '?').join(',')})`).all(...ids);
  const harga = new Map(rows.map((i) => [i.id, i]));
  const baris = lines
    .filter((l) => harga.has(l.itemId))
    .map((l) => {
      const item = harga.get(l.itemId);
      return { ...l, nama: item.nama, harga: item.harga, subtotal: item.harga * l.qty };
    });
  return { baris, total: baris.reduce((s, b) => s + b.subtotal, 0) };
}
