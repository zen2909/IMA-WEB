# Dokumentasi Panel IMA

Dokumen ini menjelaskan halaman mana saja yang tersedia untuk tiap peran, dan
apa yang boleh dilakukan di setiap halaman.

Sumber kebenaran untuk semua aturan di dokumen ini adalah `src/lib/perm.ts`.
Kalau halaman dan dokumen ini berbeda, kode yang benar.

---

## 1. Dua ruang panel

Aplikasi punya dua ruang yang terpisah. Pemisahan ini ditegakkan, bukan cuma
tampilan: masing-masing ruang akan mengembalikan 307 ke ruang yang benar bila
dibuka oleh peran yang tidak berhak.

| Ruang | Siapa | Alamat dasar |
|---|---|---|
| Panel Admin | Ketua, Wakil Ketua, Sekretaris, Bendahara | `/admin` |
| Panel Kepala Divisi | Kepala Divisi | `/kadiv` |

Setelah login, pengguna langsung diarahkan ke ruang yang sesuai perannya.
Redirect ini terjadi di level layout, jadi halaman terlindungi tidak sempat
ter-render.

**Kenapa dipisah?** Ruang `/kadiv` menampilkan data satu divisi saja. Kalau
kepala divisi tetap bisa membuka `/admin`, pemisahan ini tidak berarti apa-apa.
Maka `/admin` menutup pintu untuk kepala divisi, dan sebaliknya.

---

## 2. Peta halaman

18 rute. Tanda **307** berarti dialihkan ke ruang yang lain.

| Rute | Isi halaman | Ketua | Wakil | Sekretaris | Bendahara | Kepala Divisi |
|---|---|---|---|---|---|---|
| `/admin` | Dashboard angka dan sebaran per divisi | ya | ya | ya | ya | 307 |
| `/admin/anggota` | Seluruh anggota | ubah | ubah | ubah | baca saja | 307 |
| `/admin/anggota/baru` | Form tambah anggota | ya | ya | ya | 404 | 307 |
| `/admin/anggota/[id]` | Form ubah anggota | ya | ya | ya | 404 | 307 |
| `/admin/divisi` | Kelola divisi | ubah + hapus | ubah + hapus | baca saja | baca saja | 307 |
| `/admin/akun` | Ganti kata sandi | ya | ya | ya | ya | 307 |
| `/kadiv` | Dashboard divisinya | 307 | 307 | 307 | 307 | ya |
| `/kadiv/anggota` | Anggota divisinya | 307 | 307 | 307 | 307 | ya |
| `/kadiv/anggota/baru` | Form tambah anggota | 307 | 307 | 307 | 307 | ya |
| `/kadiv/anggota/[id]` | Form ubah anggota | 307 | 307 | 307 | 307 | ya |
| `/kadiv/profil-divisi` | Profil divisinya | 307 | 307 | 307 | 307 | ya |
| `/kadiv/program-kerja` | Rencana kerja | 307 | 307 | 307 | 307 | ya |
| `/kadiv/akun` | Ganti kata sandi | 307 | 307 | 307 | 307 | ya |
| `/masuk` | Login | ya | ya | ya | ya | ya |
| `/` | Beranda | ya | ya | ya | ya | ya |
| `/pengurusan` | Daftar pengurus | ya | ya | ya | ya | ya |
| `/divisi` | Daftar divisi | ya | ya | ya | ya | ya |
| `/divisi/[slug]` | Detail divisi | ya | ya | ya | ya | ya |

Kolom kosong berarti **tidak punya wewenang sama sekali** untuk menambah atau
mengubah data, hanya membaca.

---

## 3. Ringkasan wewenang

| Aksi | Ketua | Wakil | Sekretaris | Bendahara | Kepala Divisi |
|---|---|---|---|---|---|
| lihat seluruh anggota | ya | ya | ya | ya | ya |
| ubah anggota lintas divisi | ya | ya | ya | — | — |
| ubah/hapus anggota divisinya | ya | ya | ya | — | ya |
| hapus akun sendiri | — | — | — | — | — |
| ubah profil divisinya | semua | semua | — | — | divisinya |
| kelola program kerja | semua | semua | — | — | divisinya |
| buat divisi baru | ya | ya | — | — | — |
| hapus divisi | ya | ya | — | — | — |
| ubah divisi lain | ya | ya | — | — | — |
| ubah nama divisi | ya | ya | — | — | — |
| ganti kata sandi sendiri | ya | ya | ya | ya | ya |

Perhatikan bahwa Ketua dan Wakil punya hak akses yang identik. Keduanya satu
kelompok di kode (`STRUKTUR` dan `PENUH` di `src/lib/perm.ts`).

---

## 4. Halaman per peran

### Ketua

Ruang: `/admin`.

**Halaman yang dibuka**

- `/admin` — dashboard. Empat kartu angka (total anggota, anggota aktif, anggota
  tanpa divisi, jumlah divisi) dan tabel sebaran anggota per divisi beserta
  kepala divisinya.
- `/admin/anggota` — seluruh anggota organisasi. Bisa dicari berdasarkan
  nama atau NIM, difilter per divisi dan per jabatan.
- `/admin/anggota/baru` — menambah anggota. Field kata sandi boleh dikosongkan
  bila anggota tidak dibuatkan akun login.
- `/admin/anggota/[id]` — mengubah data anggota, termasuk jabatan dan divisi.
- `/admin/divisi` — menambah, mengubah, dan menghapus divisi. Kolom visi dan
  misi ikut ditampilkan di sini sebagai ringkasan.
- `/admin/akun` — mengganti kata sandi sendiri.

**Yang bisa dilakukan**

- Mengubah dan menghapus anggota mana pun, lintas divisi.
- Menugaskan jabatan dan memindahkan anggota ke divisi lain.
- Menambah, mengubah, dan menghapus divisi, termasuk mengganti namanya.
- Mengubah profil divisi mana pun: deskripsi, visi, misi, kontak.

**Yang dikunci**

- Tidak bisa menghapus akunnya sendiri. Barisnya sendiri tidak punya link
  Hapus di tabel.

---

### Wakil Ketua

Ruang: `/admin`.

Hak akses **identik dengan Ketua**. Bedanya hanya pada tampilan nama dan jabatan
di sidebar. Tidak ada halaman yang tersedia untuk Ketua tetapi tidak untuk
Wakil, atau sebaliknya.

---

### Sekretaris

Ruang: `/admin`.

**Halaman yang dibuka**

Sama seperti Ketua, kecuali `/admin/divisi` menjadi **baca saja**.

**Yang bisa dilakukan**

- Mengubah dan menghapus seluruh anggota, lintas divisi.
- Menugaskan jabatan dan memindahkan anggota ke divisi lain.

**Yang dikunci**

- **Tidak bisa menambah, mengubah, atau menghapus divisi.** Halaman divisi
  menampilkan daftar saja, tanpa panel form dan tanpa link Ubah/Hapus.
- **Tidak bisa mengganti nama divisi.**
- Tidak bisa menghapus akunnya sendiri.

Alasannya: struktur divisi adalah keputusan organisasi, bukan keputusan
administrasi. Perannya dipakai Ketua dan Wakil supaya perubahannya sengaja dan
terbatas.

---

### Bendahara

Ruang: `/admin`.

**Halaman yang dibuka**

- `/admin` — dashboard, sama seperti peran lain.
- `/admin/anggota` — seluruh anggota, **hanya untuk dibaca**.
- `/admin/divisi` — daftar divisi, baca saja.
- `/admin/akun` — mengganti kata sandi sendiri.

**Yang dikunci**

- Tidak ada satu pun aksi tulis di seluruh ruang panel. Tiap baris di tabel
  anggota menampilkan teks "Tidak ada akses" di kolom Aksi, bukan tombol.
- Tombol "Tambah Anggota" tidak muncul.
- Membuka `/admin/anggota/baru` secara langsung membalas **404**.

Catatan: di versi saat ini belum ada modul keuangan, jadi Bendahara belum punya
tugas apa pun yang bisa dikerjakan di panel. Halaman ini disiapkan sebagai tempat
modul kas akan ditambahkan nanti.

---

### Kepala Divisi

Ruang: `/kadiv`. Membuka `/admin` akan dialihkan ke `/kadiv`.

**Halaman yang dibuka**

- `/kadiv` — dashboard divisinya sendiri: jumlah anggota, jumlah program kerja,
  dan program yang sedang berjalan. Tidak ada angka organisasi di sini.
- `/kadiv/anggota` — anggota divisinya saja. Baris milik divisi lain tidak muncul
  sama sekali, bukan tampil dengan keterangan terkunci.
- `/kadiv/anggota/baru` — menambah anggota. Keterangan di atas form menyebutkan
  bahwa anggota baru akan otomatis masuk ke divisinya.
- `/kadiv/anggota/[id]` — mengubah data anggota divisinya.
- `/kadiv/profil-divisi` — mengisi deskripsi, visi, misi, dan kontak divisinya.
- `/kadiv/program-kerja` — menambah, mengubah, dan menghapus rencana kerja, dengan
  status Rencana, Berjalan, atau Selesai.
- `/kadiv/akun` — mengganti kata sandi sendiri.

**Yang bisa dilakukan**

- Mengubah dan menghapus anggota divisinya sendiri. Tidak bisa menghapus dirinya
  sendiri, sehingga barisnya tidak punya link Hapus.
- Menambah anggota baru; otomatis masuk ke divisinya dan tidak bisa memilih
  divisi lain.
- Mengubah deskripsi, visi, misi, dan kontak divisinya sendiri.
- Mengelola program kerja divisinya sendiri.

**Yang dikunci**

- Kolom **Jabatan** dan **Divisi** tidak muncul di form anggota. Alasannya bukan
  sekadar tampilan: kalau ia boleh mengubahnya, ia bisa menunjuk dirinya jadi
  Ketua atau memindahkan dirinya ke divisi lain. Setelah itu, pemeriksaan
  kewenangannya akan selalu cocok dengan baris yang memang ia ubah sendiri,
  sehingga batasnya bocor.
- **Nama divisi** tidak bisa diubah dari sini. Nama menentukan slug dan URL
  publiknya, jadi hanya Ketua dan Wakil yang boleh menyentuhnya.
- **Tidak bisa menambah atau menghapus divisi.** Tindakan ini bersifat global dan
  tidak bisa dibatasi ke satu divisi.
- Membuka `/kadiv/anggota/[id]` milik divisi lain membalas **404**, meski ia tahu
  id-nya. Ini disengaja: membalas 403 sekaligus mengonfirmasi bahwa anggota
  tersebut ada.

---

## 5. Pembatasan yang dijaga

Tiga aturan di `src/lib/perm.ts` yang tidak boleh dilonggarkan.

1. **Kepala divisi tidak boleh mengubah kolom `peran` dan `divisiId` pada
   anggota.** Kalau boleh, ia bisa menunjuk dirinya jadi Ketua atau pindah divisi,
   lalu pemeriksaan scope-nya bocor karena baris itu memang ia ubah sendiri.
   Field lain — nama, NIM, prodi, angkatan, email, nomor HP, foto, status aktif —
   bebas diubah.

2. **Nama divisi hanya bisa diubah Ketua dan Wakil.** Nama itu menentukan slug dan
   URL publik, jadi mengubahnya berarti memutus tautan yang sudah terbit.

3. **Buat dan hapus divisi hanya Ketua dan Wakil.** Kepala divisi boleh mengisi
   divisinya, bukan membubarkannya. Menghapus divisi juga akan menghapus program
   kerjanya, karena program kerja tidak bermakna tanpa divisinya.

Semua pemeriksaan ini berjalan di server action, bukan hanya menyembunyikan
tombol di antarmuka. Tombol yang tersembunyi tetap akan ditolak kalau dikirim
langsung.

---

## 6. Halaman publik

Lima halaman, terbuka untuk siapa pun tanpa login. Tidak ada pembagian peran di
sini, karena isinya sama untuk semua pengunjung.

| Rute | Isi |
|---|---|
| `/` | Beranda. Hero, tiga angka ringkasan (anggota, divisi, kepala divisi), susunan pengurus inti, dan kartu semua divisi. |
| `/pengurusan` | Pengurus inti dalam grid kartu, lalu anggota dikelompokkan per divisi. |
| `/divisi` | Kartu semua divisi beserta jumlah anggotanya. |
| `/divisi/[slug]` | Satu divisi: deskripsi, kartu kepala divisi, daftar anggota. |
| `/masuk` | Formulir login. Jika sudah punya sesi aktif, dialihkan ke ruang panelnya. |

Halaman publik membaca data langsung dari database, jadi perubahan yang disimpan
di panel langsung terlihat di sini.

---

## 7. Data yang tidak pernah tampil publik

Empat kolom anggota tidak pernah dikirim ke halaman publik: **email**,
**nomor HP**, **passwordHash**, dan **status akun**.

Yang tampil di halaman publik hanya: nama, NIM, program studi, angkatan, URL
foto, jabatan, dan divisi.

Penegasan ini tidak diserahkan pada diethyl dari query. Ada satu fungsi
`PILIH_PUBLIK` di `src/lib/queries.ts` yang dipakai semua query halaman publik,
dan daftar kolomnya tidak memuat keempat kolom di atas. Menambahkan kolom baru
ke sana adalah keputusan sadar, bukan hal yang terjadi diam-diam.

Kata sandi disimpan dengan scrypt bawaan Node dan tidak pernah dikembalikan
dalam bentuk apa pun, termasuk ke log.