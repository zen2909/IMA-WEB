import Link from "next/link";
import { Avatar, Kartu, Kosong, Lencana, kelasTombol } from "@/components/ui";
import { prisma } from "@/lib/db";
import { getPengguna } from "@/lib/auth";
import { boleh } from "@/lib/perm";
import { PERAN, LABEL_PERAN } from "@/lib/anggota";
import { HapusAnggota } from "@/app/admin/anggota/hapus-anggota";

export default async function AnggotaKadiv(
  props: PageProps<"/kadiv/anggota">,
) {
  const sp = await props.searchParams;
  const q = String(sp.q ?? "").trim();
  const fPeran = String(sp.peran ?? "");

  const user = (await getPengguna())!;
  const divisiId = user.divisiId!;

  // Hanya divisinya sendiri. Tidak ada parameter divisi dari URL yang bisa
  // dipakai untuk melihat divisi lain.
  const anggota = await prisma.anggota.findMany({
    where: {
      divisiId,
      ...(q ? { OR: [{ nama: { contains: q } }, { nim: { contains: q } }] } : {}),
      ...(fPeran && PERAN.includes(fPeran as never) ? { peran: fPeran } : {}),
    },
    orderBy: [{ aktif: "desc" }, { nama: "asc" }],
  });

  return (
    <div className="max-w-[1200px]">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[24px] font-bold text-ink">Anggota Divisi</h1>
          <p className="mt-1 text-[13px] text-ink-muted">
            {anggota.length} anggota di {user.divisi?.nama}
          </p>
        </div>
        <Link href="/kadiv/anggota/baru" className={kelasTombol("utama")}>
          Tambah Anggota
        </Link>
      </div>

      <form method="get" className="flex flex-wrap gap-3 mb-5">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Cari nama atau NIM"
          aria-label="Cari nama atau NIM"
          className="h-10 flex-1 min-w-[200px] px-3 bg-white border border-line rounded-[8px] text-[13px] focus:border-brand focus:outline-none"
        />
        <select
          name="peran"
          defaultValue={fPeran}
          aria-label="Filter jabatan"
          className="h-10 px-3 bg-white border border-line rounded-[8px] text-[13px] focus:border-brand focus:outline-none"
        >
          <option value="">Semua jabatan</option>
          {PERAN.map((p) => (
            <option key={p} value={p}>
              {LABEL_PERAN[p]}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="h-10 px-4 rounded-[8px] border border-line bg-white text-[13px] font-medium text-ink hover:bg-surface"
        >
          Terapkan
        </button>
      </form>

      <Kartu className="overflow-hidden">
        {anggota.length === 0 ? (
          <Kosong
            judul="Belum ada anggota"
            pesan="Belum ada anggota yang cocok dengan filter ini."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-[13px]">
              <thead>
                <tr className="bg-surface border-b border-line text-[11px] uppercase tracking-wider text-ink-muted">
                  <th className="text-left font-semibold px-5 py-3">Nama</th>
                  <th className="text-left font-semibold px-5 py-3">NIM</th>
                  <th className="text-left font-semibold px-5 py-3">Prodi</th>
                  <th className="text-left font-semibold px-5 py-3">Jabatan</th>
                  <th className="text-right font-semibold px-5 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {anggota.map((a) => {
                  const bolehEdit = boleh(user, "kelola-anggota", a.divisiId);
                  return (
                    <tr key={a.id} className={a.aktif ? "" : "opacity-60"}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar nama={a.nama} ukuran={34} />
                          <div className="min-w-0">
                            <p className="font-medium text-ink truncate">
                              {a.nama}
                            </p>
                            <p className="text-[11px] text-ink-muted truncate">
                              {a.aktif ? a.email : "Nonaktif"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-ink-muted">{a.nim}</td>
                      <td className="px-5 py-3 text-ink-muted">{a.prodi}</td>
                      <td className="px-5 py-3">
                        <Lencana peran={a.peran} />
                      </td>
                      <td className="px-5 py-3 text-right">
                        {bolehEdit ? (
                          <div className="flex items-center justify-end gap-3">
                            <Link
                              href={`/kadiv/anggota/${a.id}`}
                              className="text-[12px] font-medium text-brand-dark hover:underline"
                            >
                              Ubah
                            </Link>
                            {user.id !== a.id && (
                              <HapusAnggota id={a.id} nama={a.nama} />
                            )}
                          </div>
                        ) : (
                          <span className="text-[12px] text-ink-muted">
                            Tidak ada akses
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Kartu>
    </div>
  );
}