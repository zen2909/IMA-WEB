import Link from "next/link";
import { notFound } from "next/navigation";
import { Kartu } from "@/components/ui";
import { prisma } from "@/lib/db";
import { getPengguna } from "@/lib/auth";
import { boleh, bolehUbahField } from "@/lib/perm";
import { FormAnggota } from "@/components/form-anggota";

export default async function UbahAnggotaKadiv(
  props: PageProps<"/kadiv/anggota/[id]">,
) {
  const { id } = await props.params;

  const [anggota, user] = await Promise.all([
    prisma.anggota.findUnique({ where: { id } }),
    getPengguna(),
  ]);

  if (!anggota) notFound();

  // Divisi dicek ikut dengan wewenang, supaya baris dari divisi lain tidak
  // bisa dijamah hanya karena tahu id-nya.
  if (!user || !boleh(user, "kelola-anggota", anggota.divisiId)) notFound();

  return (
    <div className="max-w-[760px]">
      <Link
        href="/kadiv/anggota"
        className="text-[13px] text-ink-muted hover:text-ink"
      >
        Semua anggota divisi
      </Link>
      <h1 className="mt-3 text-[24px] font-bold text-ink">{anggota.nama}</h1>

      <Kartu className="mt-6 p-6">
        <FormAnggota
          divisi={[]}
          bolehUbahJabatan={bolehUbahField(user, "divisiId")}
          awal={{
            id: anggota.id,
            nama: anggota.nama,
            nim: anggota.nim,
            prodi: anggota.prodi,
            angkatan: anggota.angkatan,
            email: anggota.email,
            noHp: anggota.noHp ?? "",
            fotoUrl: anggota.fotoUrl ?? "",
            peran: anggota.peran,
            divisiId: anggota.divisiId ?? "",
            aktif: anggota.aktif,
          }}
        />
      </Kartu>
    </div>
  );
}