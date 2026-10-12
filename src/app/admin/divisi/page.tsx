import Link from "next/link";
import { Kartu, Kosong } from "@/components/ui";
import { prisma } from "@/lib/db";
import { getPengguna } from "@/lib/auth";
import { boleh } from "@/lib/perm";
import { FormDivisi } from "@/components/form-divisi";
import { HapusDivisi } from "./hapus-divisi";

export default async function KelolaDivisi(props: PageProps<"/admin/divisi">) {
  const sp = await props.searchParams;
  const editId = String(sp.edit ?? "");

  const [divisi, user] = await Promise.all([
    prisma.divisi.findMany({
      orderBy: { nama: "asc" },
      include: { _count: { select: { anggota: true } } },
    }),
    getPengguna(),
  ]);

  // Tambah dan hapus divisi hanya untuk Ketua dan Wakil. Form ubah profil
  // (visi, misi, kontak) ada di ruang /kadiv milik kepala divisi.
  const bolehBuat = !!user && boleh(user, "buat-divisi");
  const bolehHapus = !!user && boleh(user, "hapus-divisi");

  return (
    <div className="max-w-[1200px]">
      <h1 className="text-[24px] font-bold text-ink">Divisi</h1>
      <p className="mt-1 text-[13px] text-ink-muted">
        {bolehBuat
          ? "Tambah, ubah, atau hapus divisi."
          : "Hanya Ketua dan Wakil Ketua yang bisa menambah atau menghapus divisi."}
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr] items-start">
        <div className="space-y-4">
          {divisi.length === 0 ? (
            <Kartu>
              <Kosong
                judul="Belum ada divisi"
                pesan="Tambahkan divisi pertama di samping."
              />
            </Kartu>
          ) : (
            divisi.map((d) => {
              const sedangUbah = editId === d.id;
              return (
                <Kartu key={d.id} className="p-5">
                  {sedangUbah ? (
                    <FormDivisi
                      awal={{
                        id: d.id,
                        nama: d.nama,
                        deskripsi: d.deskripsi ?? "",
                      }}
                    />
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[15px] font-semibold text-ink">
                          {d.nama}
                        </p>
                        <p className="mt-1 text-[13px] text-ink-muted">
                          {d.deskripsi}
                        </p>
                        <p className="mt-2 text-[12px] text-ink-muted">
                          {d._count.anggota} anggota
                        </p>
                        {d.visi && (
                          <p className="mt-2 text-[12px] text-ink-muted line-clamp-2">
                            {d.visi}
                          </p>
                        )}
                      </div>
                      {bolehBuat && (
                        <div className="flex items-center gap-3 shrink-0">
                          <Link
                            href={`/admin/divisi?edit=${d.id}`}
                            className="text-[12px] font-medium text-brand-dark hover:underline"
                          >
                            Ubah
                          </Link>
                          {bolehHapus && <HapusDivisi id={d.id} nama={d.nama} />}
                        </div>
                      )}
                    </div>
                  )}
                </Kartu>
              );
            })
          )}
        </div>

        {bolehBuat && (
          <Kartu className="p-5">
            <h2 className="text-[14px] font-semibold text-ink mb-4">
              Tambah divisi baru
            </h2>
            <FormDivisi />
          </Kartu>
        )}
      </div>
    </div>
  );
}