import { prisma } from "./db";

/**
 * Select eksplisit untuk halaman publik.email, noHp, dan passwordHash tidak
 * ada di sini, jadi tidak bisa bocor ke HTML walau select lupa di suatu tempat.
 */
export const PILIH_PUBLIK = {
  id: true,
  nama: true,
  nim: true,
  prodi: true,
  angkatan: true,
  fotoUrl: true,
  peran: true,
  divisiId: true,
} as const;

export type AnggotaPublik = {
  id: string;
  nama: string;
  nim: string;
  prodi: string;
  angkatan: number;
  fotoUrl: string | null;
  peran: string;
  divisiId: string | null;
};

export async function anggotaPublik(): Promise<AnggotaPublik[]> {
  return prisma.anggota.findMany({
    where: { aktif: true },
    select: PILIH_PUBLIK,
    orderBy: { nama: "asc" },
  });
}

export async function anggotaInti(): Promise<AnggotaPublik[]> {
  return prisma.anggota.findMany({
    where: { aktif: true, peran: { in: ["KETUA", "WAKIL", "SEKRETARIS", "BENDAHARA"] } },
    select: PILIH_PUBLIK,
    orderBy: { peran: "asc" },
  });
}

export async function semuaDivisi() {
  return prisma.divisi.findMany({
    orderBy: { nama: "asc" },
    include: { _count: { select: { anggota: { where: { aktif: true } } } } },
  });
}

export async function hitungAnggotaAktif(): Promise<number> {
  return prisma.anggota.count({ where: { aktif: true } });
}

export async function hitungKepalaDivisi(): Promise<number> {
  return prisma.anggota.count({
    where: { aktif: true, peran: "KEPALA_DIVISI" },
  });
}

export async function divisiDetail(slug: string) {
  return prisma.divisi.findUnique({
    where: { slug },
    include: {
      anggota: {
        where: { aktif: true },
        select: PILIH_PUBLIK,
        orderBy: [{ peran: "desc" }, { nama: "asc" }],
      },
    },
  });
}