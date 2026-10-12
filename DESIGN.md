# DESIGN — IMA

Token desain dan aturan pemakaiannya. Sumber kebenaran yang sebenarnya adalah
`@theme` di `src/app/globals.css`; dokumen ini menjelaskan **kenapa** nilainya
seperti itu dan kapan boleh dipakai.

---

## Identitas

Logo IMA adalah pentagon hijau dengan struktur merah, bintang emas, dan wordmark
"IKATAN MAHASISWA AROSBAYA". Warnalah yang menjadi acuan:

| Warna | Hex | Diambil dari |
|---|---|---|
| Hijau | `#21C22E` | dasar pentagon |
| Merah | `#E11D2E` | struktur tengah |
| Emas | `#FFD20A` | bintang dan wordmark |
| Coklat | `#8B5A2B` | motif di bawah bintang |

Logo dipakai di header, sidebar, dan favicon. Tidak pernah dipakai sebagai
latar penuh.

---

## Palet

### Terisi

| Token | Hex | Pemakaian |
|---|---|---|
| `--color-brand` | `#21C22E` | Tombol utama, aksen sidebar aktif, titik menu aktif |
| `--color-danger` | `#E11D2E` | Tombol hapus, penanda anggota nonaktif |
| `--color-gold` | `#FFD20A` | Badge kecil, tidak untuk teks |

### Gelap — untuk teks di atas putih

| Token | Hex |
|---|---|
| `--color-brand-dark` | `#15803D` |
| `--color-danger-txt` | `#B91C1C` |
| `--color-gold-txt` | `#A16207` |

### Netral

| Token | Hex | Pemakaian |
|---|---|---|
| `--color-page` | `#F8FAF8` | Latar halaman admin |
| `--color-surface` | `#F7FAF7` | Kartu, header tabel |
| `--color-line` | `#E3EAE3` | Garis pemisah |
| `--color-ink` | `#141A14` | Teks utama |
| `--color-ink-muted` | `#5B6B5B` | Teks sekunder, label |

---

## Aturan kontras

Ini bagian yang paling mudah dilanggar, jadi paling penting:

1. **Hijau terang `#21C22E` tidak boleh pernah menjadi warna teks atau link di
   atas putih.** Kontrasnya hanya sekitar 1,9:1, jauh di bawah standar WCAG AA
   4,5:1. Hijau terang hanya untuk *fill*: tombol, header, badge. Untuk teks
   hijau selalu pakai `--color-brand-dark` yang kontrasnya sekitar 4,8:1.

2. **Emas `#FFD20A` hanya untuk badge atau sorotan kecil.** Kontrasnya ke putih
   sekitar 1,5:1. Teks emas memakai `--color-gold-txt`.

3. **Merah `#E11D2E` hanya untuk aksi merusak atau penanda penting.** Kalau
   dipakai untuk tombol biasa, tombol yang berbahaya tidak akan menonjol.

4. Rasio kontras minimum 4,5:1 untuk teks di atas latar terang.

---

## Tipografi

- Font: **Inter**, dimuat lewat `next/font` di `src/app/layout.tsx`.
- Judul halaman 24px bold, judul kartu 16px semibold, body 14px, teks kecil
  12px, isi tabel 14px.
- Label form dan header tabel: 12px uppercase dengan `letter-spacing`, warna
  `--color-ink-muted`. Teks lain memakai bentuk normal, bukan uppercase.

---

## Bentuk dan kedalaman

- Radius 8px untuk tombol, input, dan badge pill; 12px untuk kartu.
- Pemisah memakai border 1px `--color-line`, bukan bayangan. Bayangan hanya
  untuk dropdown dan dialog.
- Ikon garis 1,5px jika suatu saat dipakai.

---

## Komponen

| Komponen | Aturan |
|---|---|
| Tombol utama | Latar `--color-brand`, teks putih, tinggi 40px, radius 8px, 14px semibold. Hover `--color-brand-darker`. |
| Tombol sekunder | Latar putih, border `--color-line`, teks `--color-ink`. |
| Tombol bahaya | Latar `--color-danger`, teks putih. Hanya untuk hapus. |
| Input | Tinggi 40px, radius 8px, border `--color-line`. Fokus membuat border jadi `--color-brand`. Label selalu ada di atas input, bukan placeholder. |
| Tabel | Header uppercase 12px di atas `--color-surface`. Baris dipisah border. Kolom Aksi rata kanan. |
| Badge | Pill 11px. Ketua dan Wakil hijau muda dengan teks `--color-brand-dark`; jabatan lain netral. |
| Kartu | Latar putih, border 1px, radius 12px, padding 20px. |

---

## Layout

**Website publik** — konten maksimal 1120px dengan padding samping 24px, atau
16px di layar kecil. Header sticky 64px, latar putih, border bawah.

**Panel admin dan panel kepala divisi** — sidebar tetap 240px di kiri dengan
border kanan, konten di kanan dengan padding 32px dan lebar maksimal 1200px.
Di bawah 768px sidebar berubah menjadi blok di atas konten.

Kedua panel memakai kerangka yang sama (`src/components/panel-shell.tsx`); yang
berbeda hanya isi menunya.

---

## Semangat

Rapi, formal, dan hangat — bukan tampilan SaaS korporat biru.
Tanpa gradient dekoratif, tanpa ilustrasi stok, tanpa emoji. Ornamen seminimal
mungkin. Semua label Bahasa Indonesia dengan isi yang realistis, tidak ada lorem
ipsum.

Halaman kosong selalu punya keterangan yang jelas dan satu tombol aksi. Semua
halaman harus terbaca di layar selebar 375px.

---

## Mode gelap

Tokennya ada di `globals.css`, tapi tidak ada tombol pengalih dan
`prefers-color-scheme` tidak dipakai. Panel sengaja hanya terang. Menambah mode
gelap berarti menambah seluruh token gelap dan tombol pengalih — bukan sekadar
menyalakan variabel yang sudah ada.

---

## Asalnya dari mana

Token dan pola komponen di atas pertama-tama dibuat bersama Google Stitch
(project **IMA — CMS Ikatan Mahasiswa Arosbaya**), lalu diterjemahkan ke
Tailwind v4. Stitch menyediakan acuan visual; implementasi sebenarnya memakai
nilai warna yang sama persis seperti yang tercatat di tabel paling atas.