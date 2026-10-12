import { redirect } from "next/navigation";
import type { Pengguna } from "./auth";
import type { Peran } from "./anggota";

export type Aksi =
  | "lihat-anggota"
  | "kelola-anggota"
  | "kelola-program-kerja"
  | "ubah-divisi"
  | "buat-divisi"
  | "hapus-divisi";

/** Peran dengan akses penuh ke seluruh data anggota, lintas divisi. */
const PENUH: readonly Peran[] = ["KETUA", "WAKIL", "SEKRETARIS"];

/** Peran yang menentukan struktur organisasi: buat dan hapus divisi. */
const STRUKTUR: readonly Peran[] = ["KETUA", "WAKIL"];

export function penuh(user: Pengguna): boolean {
  return PENUH.includes(user.peran as Peran);
}

function struktur(user: Pengguna): boolean {
  return STRUKTUR.includes(user.peran as Peran);
}

/** Cuma berlaku kalau user punya divisi dan target-nya benar-benar miliknya. */
function divisiSendiri(user: Pengguna, targetDivisiId: string | null): boolean {
  return user.peran === "KEPALA_DIVISI" && !!user.divisiId && targetDivisiId === user.divisiId;
}

export function boleh(
  user: Pengguna,
  aksi: Aksi,
  targetDivisiId: string | null = null,
): boolean {
  switch (aksi) {
    case "lihat-anggota":
      // Semua yang punya akun boleh melihat. Kolom yang sensitif tidak pernah
      // ikut terbaca — dibatasi di select query, bukan di sini.
      return true;

    case "kelola-anggota":
      if (penuh(user)) return true;
      return divisiSendiri(user, targetDivisiId);

    case "kelola-program-kerja":
    case "ubah-divisi":
      if (struktur(user)) return true;
      return divisiSendiri(user, targetDivisiId);

    // Buat dan hapus divisi bersifat global dan tidak bisa di-scope ke satu
    // divisi, jadi tetap hanya Ketua dan Wakil. Kepala divisi boleh mengisi
    // divisinya sendiri, bukan membubarkannya.
    case "buat-divisi":
    case "hapus-divisi":
      return struktur(user);
  }
}

/**
 * Field yang boleh diubah kepala divisi pada data anggota.
 *
 * `peran` dan `divisiId` sengaja TIDAK ada di sini. Kalau kepala divisi boleh
 * mengubahnya, ia bisa menunjuk dirinya jadi Ketua atau pindah ke divisi lain —
 * lalu pemeriksaan scope di `boleh()` bocor karena baris itu memang ia ubah
 * sendiri.
 */
export const FIELD_BEBAS = [
  "nama",
  "nim",
  "prodi",
  "angkatan",
  "email",
  "noHp",
  "fotoUrl",
  "aktif",
] as const;

export function bolehUbahField(user: Pengguna, field: string): boolean {
  if (penuh(user)) return true;
  return (
    user.peran === "KEPALA_DIVISI" &&
    (FIELD_BEBAS as readonly string[]).includes(field)
  );
}

/**
 * Nama divisi menentukan slug dan URL publiknya, jadi hanya Ketua dan Wakil
 * yang boleh mengubahnya. Kepala divisi boleh mengisi deskripsi, visi, misi,
 * dan kontak divisinya sendiri.
 */
export function bolehUbahNamaDivisi(user: Pengguna): boolean {
  return struktur(user);
}

/** Menerjemahkan peran ke ruang panel yang boleh ia masuki. */
export function berandaPanel(user: Pengguna): string {
  return user.peran === "KEPALA_DIVISI" ? "/kadiv" : "/admin";
}

/**
 * Buang field yang tidak boleh diubah pengguna ini. Dipanggil di server action
 * sebelum menulis, bukan sekadar menyembunyikan input di form.
 */
export function saring<T extends Record<string, unknown>>(
  user: Pengguna,
  input: T,
): Partial<T> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(input)) {
    if (bolehUbahField(user, k)) out[k] = v;
  }
  return out as Partial<T>;
}

/** Guard untuk halaman /admin. redirect() berarti return tak tercapai. */
export async function wajibPengguna(): Promise<Pengguna> {
  const { getPengguna } = await import("./auth");
  const user = await getPengguna();
  if (!user) redirect("/masuk");
  return user!;
}