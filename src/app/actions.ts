"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import {
  getPengguna,
  createSession,
  destroySession,
  verifyPassword,
  hashPassword,
  type Pengguna,
} from "@/lib/auth";
import { boleh, bolehUbahField, bolehUbahNamaDivisi } from "@/lib/perm";
import { isPeran, slugify } from "@/lib/anggota";
import { isStatus } from "@/lib/program-kerja";

export type FormState = { error?: string; ok?: string } | undefined;

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

const kepalaDivisi = (user: Pengguna) => user.peran === "KEPALA_DIVISI";

/** Halaman tujuan setelah menyimpan, mengikuti ruang panel pengguna. */
const keanggota = (user: Pengguna) =>
  kepalaDivisi(user) ? "/kadiv/anggota" : "/admin/anggota";

const kedivisi = (user: Pengguna) =>
  kepalaDivisi(user) ? "/kadiv/profil-divisi" : "/admin/divisi";

function segarkanUmum(slug?: string | null) {
  revalidatePath("/");
  revalidatePath("/pengurusan");
  revalidatePath("/divisi");
  if (slug) revalidatePath(`/divisi/${slug}`);
}

/* ------------------------------- Auth ------------------------------- */

export async function masukAction(
  _prev: FormState,
  fd: FormData,
): Promise<FormState> {
  const email = str(fd, "email").toLowerCase();
  const sandi = String(fd.get("sandi") ?? "");

  if (!email || !sandi) return { error: "Email dan kata sandi wajib diisi." };

  const anggota = await prisma.anggota.findUnique({
    where: { email },
    include: { divisi: true },
  });

  // Pesan yang sama untuk email tidak dikenal maupun sandi salah, supaya
  // halaman ini tidak bisa dipakai menebak email yang terdaftar.
  const gagal = { error: "Email atau kata sandi salah." };
  if (!anggota?.passwordHash || !anggota.aktif) return gagal;
  if (!(await verifyPassword(sandi, anggota.passwordHash))) return gagal;

  await createSession(anggota.id);
  redirect(kepalaDivisi(anggota) ? "/kadiv" : "/admin");
}

export async function keluarAction() {
  await destroySession();
  redirect("/masuk");
}

export async function gantiSandiAction(
  _prev: FormState,
  fd: FormData,
): Promise<FormState> {
  const user = await getPengguna();
  if (!user) redirect("/masuk");

  const lama = String(fd.get("sandiLama") ?? "");
  const baru = String(fd.get("sandiBaru") ?? "");
  const ulang = String(fd.get("sandiUlang") ?? "");

  if (baru.length < 8) return { error: "Kata sandi baru minimal 8 karakter." };
  if (baru !== ulang) return { error: "Konfirmasi kata sandi tidak sama." };
  if (!(await verifyPassword(lama, user!.passwordHash!)))
    return { error: "Kata sandi lama salah." };

  await prisma.anggota.update({
    where: { id: user!.id },
    data: { passwordHash: await hashPassword(baru) },
  });

  return { ok: "Kata sandi berhasil diganti." };
}

/* ------------------------------ Anggota ----------------------------- */

export async function simpanAnggotaAction(
  _prev: FormState,
  fd: FormData,
): Promise<FormState> {
  const user = await getPengguna();
  if (!user) redirect("/masuk");

  const id = str(fd, "id") || undefined;
  const divisiId = str(fd, "divisiId") || null;
  const peran = str(fd, "peran");

  // id kosong berarti membuat baru, jadi wewenang dihitung dari divisi tujuan.
  const target = id ? await prisma.anggota.findUnique({ where: { id } }) : null;
  if (id && !target) return { error: "Anggota tidak ditemukan." };

  // Kepala divisi tidak boleh menentukan divisi tujuan. Saat menambah anggota
  // baru, barisnya otomatis masuk ke divisinya sendiri supaya aksi ini tetap
  // berguna baginya; saat mengubah, divisi lama yang dipakai.
  const bolehUbahDivisi = bolehUbahField(user, "divisiId");
  const divisiFinal = bolehUbahDivisi
    ? divisiId
    : (target?.divisiId ?? user.divisiId ?? null);

  if (!boleh(user, "kelola-anggota", divisiFinal))
    return { error: "Kamu tidak punya akses mengelola anggota ini." };

  const nama = str(fd, "nama");
  const nim = str(fd, "nim");
  const prodi = str(fd, "prodi");
  const angkatan = Number(str(fd, "angkatan"));
  const email = str(fd, "email").toLowerCase();

  if (!nama || !nim || !prodi || !email)
    return { error: "Lengkapi semua kolom wajib." };
  if (!Number.isInteger(angkatan) || angkatan < 2000 || angkatan > 2100)
    return { error: "Angkatan tidak valid." };
  if (isPeran(peran) === false) return { error: "Jabatan tidak valid." };

  // Kepala divisi tidak boleh menyentuh peran dan divisiId: kalau boleh, ia
  // bisa menunjuk dirinya jadi Ketua atau pindah divisi, lalu pemeriksaan
  // scope-nya bocor karena baris itu memang ia ubah sendiri.
  const peranFinal = bolehUbahField(user, "peran")
    ? peran
    : (target?.peran ?? "ANGGOTA");

  const data = {
    nama,
    nim,
    prodi,
    angkatan,
    email,
    noHp: str(fd, "noHp") || null,
    aktif: fd.get("aktif") === "on",
  };

  try {
    if (id) {
      await prisma.anggota.update({
        where: { id },
        data: { ...data, peran: peranFinal, divisiId: divisiFinal },
      });
    } else {
      const sandi = str(fd, "sandi");
      await prisma.anggota.create({
        data: {
          ...data,
          peran: peranFinal,
          divisiId: divisiFinal,
          passwordHash: sandi ? await hashPassword(sandi) : null,
        },
      });
    }
  } catch (e) {
    // Prisma error P2002 = unique constraint (NIM atau email kembar)
    if (typeof e === "object" && e && "code" in e && e.code === "P2002")
      return { error: "NIM atau email sudah dipakai anggota lain." };
    throw e;
  }

  revalidatePath(keanggota(user));
  segarkanUmum();
  redirect(keanggota(user));
}

export async function hapusAnggotaAction(fd: FormData): Promise<void> {
  const user = await getPengguna();
  if (!user) redirect("/masuk");

  const id = str(fd, "id");
  const target = await prisma.anggota.findUnique({ where: { id } });

  if (!target) return;
  if (!boleh(user, "kelola-anggota", target.divisiId))
    throw new Error("Akses ditolak.");
  if (user.id === target.id)
    throw new Error("Kamu tidak bisa menghapus akun sendiri.");

  await prisma.anggota.delete({ where: { id } });

  revalidatePath(keanggota(user));
  segarkanUmum();
}

/* ------------------------------ Divisi ------------------------------ */

export async function simpanDivisiAction(
  _prev: FormState,
  fd: FormData,
): Promise<FormState> {
  const user = await getPengguna();
  if (!user) redirect("/masuk");

  const id = str(fd, "id") || undefined;
  const nama = str(fd, "nama");
  if (!nama) return { error: "Nama divisi wajib diisi." };

  // Hanya field yang benar-benar ada di form yang ditulis. Form di
  // /admin/divisi tidak mengirim visi/misi/kontak; kalau kita tetap menuliskannya,
  // mengedit deskripsi di sana akan diam-diam menghapus isi profil yang lain.
  const isi: Record<string, string | null> = {};
  for (const k of ["deskripsi", "visi", "misi", "kontak"]) {
    if (fd.has(k)) isi[k] = str(fd, k) || null;
  }

  try {
    if (id) {
      if (!boleh(user, "ubah-divisi", id))
        return { error: "Kamu tidak punya akses mengubah divisi ini." };

      // Nama menentukan slug dan URL publiknya, jadi hanya Ketua dan Wakil
      // yang boleh menyentuhnya.
      await prisma.divisi.update({
        where: { id },
        data: bolehUbahNamaDivisi(user)
          ? { ...isi, nama, slug: slugify(nama) }
          : isi,
      });
    } else {
      if (!boleh(user, "buat-divisi"))
        return { error: "Hanya Ketua dan Wakil Ketua yang bisa menambah divisi." };

      await prisma.divisi.create({
        data: { ...isi, nama, slug: slugify(nama) },
      });
    }
  } catch (e) {
    if (typeof e === "object" && e && "code" in e && e.code === "P2002")
      return { error: "Ada divisi lain dengan nama yang sama." };
    throw e;
  }

  const hasil = id
    ? await prisma.divisi.findUnique({ where: { id } })
    : await prisma.divisi.findFirst({ where: { nama } });

  revalidatePath(kedivisi(user));
  segarkanUmum(hasil?.slug);
  redirect(kedivisi(user));
}

export async function hapusDivisiAction(fd: FormData): Promise<void> {
  const user = await getPengguna();
  if (!user) redirect("/masuk");
  if (!boleh(user, "hapus-divisi")) throw new Error("Akses ditolak.");

  const id = str(fd, "id");
  if (!id) return;

  // onDelete: SetNull melepas anggota dari divisi ini, Cascade menghapus
  // program kerjanya. Baris divisinya sendiri yang kita hapus.
  await prisma.divisi.delete({ where: { id } });

  revalidatePath("/admin/divisi");
  segarkanUmum();
}

/* --------------------------- Program Kerja -------------------------- */

export async function simpanProgramKerjaAction(
  _prev: FormState,
  fd: FormData,
): Promise<FormState> {
  const user = await getPengguna();
  if (!user) redirect("/masuk");

  const id = str(fd, "id") || undefined;
  const judul = str(fd, "judul");
  const status = str(fd, "status");

  if (!judul) return { error: "Judul wajib diisi." };
  if (!isStatus(status)) return { error: "Status tidak valid." };

  const isi = {
    judul,
    deskripsi: str(fd, "deskripsi") || null,
    status,
    targetWaktu: str(fd, "targetWaktu") || null,
  };

  if (id) {
    const pk = await prisma.programKerja.findUnique({ where: { id } });
    if (!pk) return { error: "Program kerja tidak ditemukan." };
    if (!boleh(user, "kelola-program-kerja", pk.divisiId))
      return { error: "Akses ditolak." };

    await prisma.programKerja.update({ where: { id }, data: isi });
  } else {
    const divisiId = user.divisiId ?? "";
    if (!divisiId || !boleh(user, "kelola-program-kerja", divisiId))
      return { error: "Kamu harus punya divisi untuk menambah program kerja." };

    await prisma.programKerja.create({ data: { ...isi, divisiId } });
  }

  revalidatePath("/kadiv/program-kerja");
  revalidatePath("/kadiv");
  redirect("/kadiv/program-kerja");
}

export async function hapusProgramKerjaAction(fd: FormData): Promise<void> {
  const user = await getPengguna();
  if (!user) redirect("/masuk");

  const id = str(fd, "id");
  if (!id) return;

  const pk = await prisma.programKerja.findUnique({ where: { id } });
  if (!pk) return;
  if (!boleh(user, "kelola-program-kerja", pk.divisiId))
    throw new Error("Akses ditolak.");

  await prisma.programKerja.delete({ where: { id } });

  revalidatePath("/kadiv/program-kerja");
  revalidatePath("/kadiv");
}