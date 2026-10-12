import { existsSync } from "node:fs";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client.ts";
import { hashPassword } from "../src/lib/password.ts";
import { slugify } from "../src/lib/anggota.ts";

if (existsSync(".env")) process.loadEnvFile(".env");

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  }),
});

const SANDI = "IMA2026!";

type Profil = {
  nama: string;
  deskripsi: string;
  visi: string;
  misi: string;
  kontak: string;
};

const DIVISI: Profil[] = [
  {
    nama: "Divisi Pendidikan",
    deskripsi:
      "Pendampingan belajar, pelatihan, dan pengembangan minat akademik mahasiswa.",
    visi: "Menjadi mitra belajar utama mahasiswa Arosbaya.",
    misi: "Mendampingi dan melatih mahasiswa secara berkala.",
    kontak: "divisi.pendidikan@arosbaya.ac.id",
  },
  {
    nama: "Divisi Sosial",
    deskripsi:
      "Pembinaan persaudaraan antar mahasiswa dan kegiatan pengabaya sosial.",
    visi: "Menjunjung persaudaraan antar mahasiswa Arosbaya.",
    misi: "Membangun keakraban dan adrenin kegiatan sosial.",
    kontak: "divisi.sosial@arosbaya.ac.id",
  },
  {
    nama: "Divisi Kreativitas",
    deskripsi:
      "Pengembangan karya mahasiswa: menulis, fotografi, dan desain.",
    visi: "Menjulang karya mahasiswa yang bernilai.",
    misi: "Memfasilitasi menulis, fotografi, dan desain.",
    kontak: "divisi.kreativitas@arosbaya.ac.id",
  },
  {
    nama: "Divisi Olahraga",
    deskripsi:
      "Pembinaan atlet mahasiswa serta turnamen antar fakultas.",
    visi: "Menjunjung kebugaran dan sportivitas mahasiswa.",
    misi: "Membina atlet dan turnamen antar fakultas.",
    kontak: "divisi.olahraga@arosbaya.ac.id",
  },
];

type Seed = {
  nama: string;
  nim: string;
  prodi: string;
  angkatan: number;
  peran: string;
  divisiId?: string;
  akun?: boolean;
};

async function main() {
  await prisma.anggota.deleteMany();
  await prisma.divisi.deleteMany();

  const divisi = await Promise.all(
    DIVISI.map(({ nama, deskripsi, visi, misi, kontak }) =>
      prisma.divisi.create({
        data: { nama, slug: slugify(nama), deskripsi, visi, misi, kontak },
      }),
    ),
  );
  const [pendidikan, sosial, kreativitas, olahraga] = divisi;

  const data: Seed[] = [
    { nama: "Ahmad Fauzi", nim: "221063115", prodi: "Ilmu Komputer", angkatan: 2022, peran: "KETUA", akun: true },
    { nama: "Siti Nurhaliza", nim: "221063118", prodi: "Ilmu Ekonomi", angkatan: 2022, peran: "WAKIL", akun: true },
    { nama: "Rizky Pratama", nim: "221063122", prodi: "Sastra Inggris", angkatan: 2022, peran: "SEKRETARIS", akun: true },
    { nama: "Dewi Lestari", nim: "221063125", prodi: "Akuntansi", angkatan: 2022, peran: "BENDAHARA", akun: true },

    { nama: "Budi Santoso", nim: "221063130", prodi: "Teknik Informatika", angkatan: 2022, peran: "KEPALA_DIVISI", divisiId: pendidikan.id, akun: true },
    { nama: "Andi Wijaya", nim: "221063134", prodi: "Manajemen", angkatan: 2022, peran: "KEPALA_DIVISI", divisiId: sosial.id, akun: true },
    { nama: "Putri Anggraini", nim: "221063138", prodi: "Desain Komunikasi Visual", angkatan: 2022, peran: "KEPALA_DIVISI", divisiId: kreativitas.id, akun: true },
    { nama: "Fajar Nugroho", nim: "221063142", prodi: "Olahraga", angkatan: 2022, peran: "KEPALA_DIVISI", divisiId: olahraga.id, akun: true },

    { nama: "Maya Sari", nim: "221063150", prodi: "Ilmu Komputer", angkatan: 2022, peran: "ANGGOTA", divisiId: pendidikan.id },
    { nama: "Eko Purnomo", nim: "221063155", prodi: "Teknik Informatika", angkatan: 2022, peran: "ANGGOTA", divisiId: pendidikan.id },
    { nama: "Nur Aisyah", nim: "221063160", prodi: "Ilmu Ekonomi", angkatan: 2022, peran: "ANGGOTA", divisiId: pendidikan.id },

    { nama: "Hendra Gunawan", nim: "221063166", prodi: "Manajemen", angkatan: 2022, peran: "ANGGOTA", divisiId: sosial.id },
    { nama: "Indah Permata", nim: "221063170", prodi: "Sosiologi", angkatan: 2022, peran: "ANGGOTA", divisiId: sosial.id },
    { nama: "Rangga Aditya", nim: "221063174", prodi: "Akuntansi", angkatan: 2022, peran: "ANGGOTA", divisiId: sosial.id },

    { nama: "Sekar Ayu", nim: "221063180", prodi: "Desain Komunikasi Visual", angkatan: 2022, peran: "ANGGOTA", divisiId: kreativitas.id },
    { nama: "Yoga Mahendra", nim: "221063184", prodi: "Seni Rupa", angkatan: 2022, peran: "ANGGOTA", divisiId: kreativitas.id },

    { nama: "Bayu Kurniawan", nim: "221063190", prodi: "Olahraga", angkatan: 2022, peran: "ANGGOTA", divisiId: olahraga.id },
    { nama: "Intan Larasati", nim: "221063194", prodi: "Ilmu Ekonomi", angkatan: 2022, peran: "ANGGOTA", divisiId: olahraga.id },

    { nama: "Agus Setiawan", nim: "231063200", prodi: "Teknik Informatika", angkatan: 2023, peran: "ANGGOTA", divisiId: pendidikan.id },
    { nama: "Dewi Anggraini", nim: "231063205", prodi: "Ilmu Komputer", angkatan: 2023, peran: "ANGGOTA", divisiId: kreativitas.id },
    { nama: "Reza Maulana", nim: "231063210", prodi: "Manajemen", angkatan: 2023, peran: "ANGGOTA" },
  ];

  const hash = await hashPassword(SANDI);

  for (const { akun, ...rest } of data) {
    await prisma.anggota.create({
      data: {
        ...rest,
        email: `${rest.nim}@arosbaya.ac.id`,
        passwordHash: akun ? hash : null,
      },
    });
  }

  const jumlahAkun = data.filter((a) => a.akun).length;

  const pk: Array<[string, string, string, string, string]> = [
    [pendidikan.id, "Kelas Persiapan UTBK", "Bimbingan intensive untuk mahasiswa baru yang akan mengikuti ujian tulis.", "BERJALAN", "Semester genap 2026"],
    [pendidikan.id, "Kelas remedial", "Pendampingan bagi mahasiswa yang indeksnya di bawah batas.", "RENCANA", "Agustus"],
    [sosial.id, "Bakti Sosial Kampung", "Membersihkan lingkungan dan-eyelectrical dengan warga sekitar kampus.", "BERJALAN", "Maret"],
    [sosial.id, "Ngobrol Sore", "Pertemuan rutin antar angkatan untuk mempererat persaudaraan.", "SELESAI", "Februari"],
    [kreativitas.id, "Pameran Karya", "Pameran karya mahasiswa di ruang publik kampus.", "RENCANA", "Semester genap 2026"],
    [olahraga.id, "Liga Mahasiswa", "Turnamen olahraga antar fakultas.", "BERJALAN", "Juni"],
  ];

  for (const [divisiId, judul, deskripsi, status, targetWaktu] of pk) {
    await prisma.programKerja.create({
      data: { divisiId, judul, deskripsi, status, targetWaktu },
    });
  }

  console.log(`Seed selesai: ${divisi.length} divisi, ${data.length} anggota, ${pk.length} program kerja.`);
  console.log(`${jumlahAkun} akun login dibuat, password semuanya: ${SANDI}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());