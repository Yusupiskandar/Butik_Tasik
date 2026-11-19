PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS collections (
  id       INTEGER PRIMARY KEY,
  slug     TEXT NOT NULL UNIQUE,
  nama     TEXT NOT NULL,
  tagline  TEXT,
  aktif    INTEGER NOT NULL DEFAULT 1,
  urutan   INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS looks (
  id             INTEGER PRIMARY KEY,
  collection_id  INTEGER NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  slug           TEXT NOT NULL,
  segmen         TEXT NOT NULL CHECK (segmen IN ('wanita','pria','anak_pr','anak_lk','keluarga')),
  nama           TEXT NOT NULL,
  deskripsi      TEXT,
  urutan         INTEGER NOT NULL DEFAULT 0,
  aktif          INTEGER NOT NULL DEFAULT 1,
  UNIQUE (collection_id, segmen, slug)
);

-- Satu look bisa tampil dalam beberapa warna; foto model mengikuti warna.
CREATE TABLE IF NOT EXISTS colour_stories (
  id          INTEGER PRIMARY KEY,
  look_id     INTEGER NOT NULL REFERENCES looks(id) ON DELETE CASCADE,
  nama_warna  TEXT NOT NULL,
  kode_hex    TEXT NOT NULL,
  foto_model  TEXT,
  urutan      INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS items (
  id         INTEGER PRIMARY KEY,
  nama       TEXT NOT NULL,
  kategori   TEXT NOT NULL,
  deskripsi  TEXT,
  harga      INTEGER NOT NULL CHECK (harga >= 0),  -- Rupiah
  foto       TEXT
);

CREATE TABLE IF NOT EXISTS item_variants (
  id       INTEGER PRIMARY KEY,
  item_id  INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  warna    TEXT NOT NULL,
  ukuran   TEXT NOT NULL,
  stok     INTEGER NOT NULL DEFAULT 0,
  sku      TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS look_items (
  look_id   INTEGER NOT NULL REFERENCES looks(id) ON DELETE CASCADE,
  item_id   INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  peran     TEXT,                         -- Ayah / Ibu / Anak Perempuan / Anak Laki-laki (look keluarga)
  opsional  INTEGER NOT NULL DEFAULT 0,   -- boleh dilepas, mis. bros
  urutan    INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (look_id, item_id, peran)
);

CREATE TABLE IF NOT EXISTS admins (
  id             INTEGER PRIMARY KEY,
  email          TEXT NOT NULL UNIQUE,
  password_hash  TEXT NOT NULL,
  dibuat         TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS orders_log (
  id        INTEGER PRIMARY KEY,
  isi_json  TEXT NOT NULL,
  total     INTEGER NOT NULL,
  dibuat    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_looks_segmen ON looks(collection_id, segmen, urutan);
CREATE INDEX IF NOT EXISTS idx_look_items ON look_items(look_id, urutan);
