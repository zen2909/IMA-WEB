# IMA — CMS Ikatan Mahasiswa Arosbaya

Situs publik sekaligus panel admin untuk mengelola anggota dan divisi IMA.

## Menjalankan

```bash
git clone https://github.com/zen2909/IMA-WEB.git
cd IMA-WEB
npm install                  # postinstall otomatis menjalankan prisma generate
cp .env.example .env         # .env tidak ikut ke repo
npx prisma migrate dev       # bikin/selaraskan database
npm run db:seed              # isi data contoh
npm run dev                  # http://localhost:3000
```

Akun seed (password semuanya `IMA2026!`):

| Peran | Email |
|---|---|
| Ketua | 221063115@arosbaya.ac.id |
| Wakil Ketua | 221063118@arosbaya.ac.id |
| Sekretaris | 221063122@arosbaya.ac.id |
| Bendahara | 221063125@arosbaya.ac.id |
| Kepala Divisi | 221063130@arosbaya.ac.id |

## Sebelum production

`AUTH_SECRET` di `.env` masih nilai contoh. **Ganti** dengan string acak minimal
32 karakter sebelum deploy — session JWT ditandatangani dengan nilai itu, dan
semua akun bisa masuk selama secret-nya diketahui orang.

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 ·
Prisma 7 + SQLite.

## Dua ruang panel

Rincian lengkap tiap halaman dan wewenang per peran ada di
[`docs/PANEL.md`](docs/PANEL.md).

| Ruang | Siapa | Isi |
|---|---|---|
| `/admin` | Ketua, Wakil Ketua, Sekretaris, Bendahara | Dashboard, seluruh anggota, kelola divisi, akun |
| `/kadiv` | Kepala Divisi | Dashboard sendiri, anggota divisinya, profil divisi, program kerja, akun |

Setelah login, pengguna diarahkan ke ruang yang sesuai perannya, dan masing-masing
ruang mengunci yang lain. Kepala divisi **hanya melihat anggota divisinya
sendiri**, bukan seluruh daftar dengan baris terkunci.

## Wewenang

| Aksi | Ketua/Wakil | Sekretaris | Kepala Divisi | Bendahara |
|---|---|---|---|---|
| lihat seluruh anggota | ya | ya | ya | ya |
| ubah/hapus anggota lintas divisi | ya | ya | — | — |
| ubah/hapus anggota divisinya | ya | ya | ya | — |
| ubah profil divisinya | semua | — | divisinya | — |
| kelola program kerja | semua | — | divisinya | — |
| buat / hapus divisi | ya | — | — | — |
| ubah divisi lain | ya | — | — | — |

Tiga aturan yang tidak boleh dilonggarkan, semuanya di `src/lib/perm.ts`:

1. Kepala divisi **tidak boleh** mengubah kolom `peran` maupun `divisiId` pada
   anggota. Kalau boleh, ia bisa menunjuk dirinya jadi Ketua atau pindah divisi,
   lalu pemeriksaan scope-nya bocor karena baris itu memang ia ubah sendiri.
2. Nama divisi menentukan slug dan URL publiknya, jadi hanya Ketua dan Wakil yang
   boleh mengubahnya.
3. Buat dan hapus divisi bersifat global dan tidak bisa di-scope ke satu divisi,
   jadi tetap hanya Ketua dan Wakil. Kepala divisi boleh mengisi divisinya,
   bukan membubarkannya.

Pemeriksaan wewenang selalu dijalankan di server action, bukan hanya
disembunyikan di UI.

## Cek

```bash
npm run cek          # aturan wewenang (11 pemeriksaan, tanpa perlu server)
npm run cek:akses    # cek batas wewenang lewat halaman /admin (perlu `npm run dev`)
npm run build        # sekaligus typecheck
```

## Catatan struktur

`cacheComponents` dimatikan di `next.config.ts`. Halaman publik menampilkan data
yang bisa berubah kapan saja lewat panel admin; prerender hanya berisiko
menyajikan data basi.

`src/proxy.ts` hanya pengecekan optimistis (redirect kalau cookie tidak ada).
Penjaga sesungguhnya ada di `src/app/admin/layout.tsx` dan tiap server action.

## Yang belum ada (v1)

Riwayat periode kepengurusan, modul keuangan, arsip surat, agenda/berita, unggah
berkas, notifikasi, portal anggota. Data anggota sengaja belum punya kolom
periode — lihat komentar di `prisma/schema.prisma`.

Program kerja disimpan dengan `onDelete: Cascade` ke divisi, jadi menghapus
divisi ikut menghapus program kerjanya. Anggota tetap ada tanpa divisi.