import { Kartu } from "@/components/ui";
import { prisma } from "@/lib/db";
import { getPengguna } from "@/lib/auth";
import { bolehUbahNamaDivisi } from "@/lib/perm";
import { FormProfilDivisi } from "@/components/form-profil-divisi";

export default async function ProfilDivisi() {
  const user = (await getPengguna())!;

  const divisi = await prisma.divisi.findUnique({
    where: { id: user.divisiId! },
    include: { _count: { select: { anggota: { where: { aktif: true } } } } },
  });

  if (!divisi) return null;

  return (
    <div className="max-w-[900px]">
      <h1 className="text-[24px] font-bold text-ink">Profil Divisi</h1>
      <p className="mt-1 text-[13px] text-ink-muted">{divisi.nama}</p>

      <Kartu className="mt-6 p-6">
        <dl className="grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="text-[12px] text-ink-muted">Nama</dt>
            <dd className="mt-0.5 text-[14px] font-medium text-ink">
              {divisi.nama}
            </dd>
          </div>
          <div>
            <dt className="text-[12px] text-ink-muted">Kontak</dt>
            <dd className="mt-0.5 text-[14px] font-medium text-ink break-all">
              {divisi.kontak ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-[12px] text-ink-muted">Kepala divisi</dt>
            <dd className="mt-0.5 text-[14px] font-medium text-ink">
              {user.nama}
            </dd>
          </div>
          <div>
            <dt className="text-[12px] text-ink-muted">Jumlah anggota</dt>
            <dd className="mt-0.5 text-[14px] font-medium text-ink">
              {divisi._count.anggota}
            </dd>
          </div>
        </dl>
      </Kartu>

      <Kartu className="mt-6 p-6">
        <h2 className="text-[16px] font-semibold text-ink mb-4">
          Identitas divisi
        </h2>
        <FormProfilDivisi
          bolehUbahNama={bolehUbahNamaDivisi(user)}
          awal={{
            id: divisi.id,
            nama: divisi.nama,
            deskripsi: divisi.deskripsi ?? "",
            visi: divisi.visi ?? "",
            misi: divisi.misi ?? "",
            kontak: divisi.kontak ?? "",
          }}
        />
      </Kartu>
    </div>
  );
}