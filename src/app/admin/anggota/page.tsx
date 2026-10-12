import Link from "next/link";
import { Avatar, Kartu, Kosong, Lencana, kelasTombol } from "@/components/ui";
import { prisma } from "@/lib/db";
import { getPengguna } from "@/lib/auth";
import { boleh, penuh } from "@/lib/perm";
import { PERAN, LABEL_PERAN } from "@/lib/anggota";
import { HapusAnggota } from "./hapus-anggota";

export default async function DaftarAnggota(props: PageProps<"/admin/anggota">) {
  const sp = await props.searchParams;
  const q = String(sp.q ?? "").trim();
  const fDivisi = String(sp.divisi ?? "");
  const fPeran = String(sp.peran ?? "");

  const user = (await getPengguna())!;

  const [divisi, anggota] = await Promise.all([
    prisma.divisi.findMany({ orderBy: { nama: "asc" } }),
    prisma.anggota.findMany({
      where: {
        ...(q
          ? {
              OR: [
                { nama: { contains: q } },
                { nim: { contains: q } },
              ],
            }
          : {}),
        ...(fDivisi ? { divisiId: fDivisi } : {}),
        ...(fPeran && PERAN.includes(fPeran as never) ? { peran: fPeran } : {}),
      },
      include: { divisi: true },
      orderBy: [{ aktif: "desc" }, { nama: "asc" }],
    }),
  ]);

  return (
    <div className="max-w-[1200px]">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[24px] font-bold text-ink">Anggota</h1>
          <p className="mt-1 text-[13px] text-ink-muted">
            {anggota.length} anggota ditampilkan.
          </p>
        </div>
        {penuh(user) && (
          <Link href="/admin/anggota/baru" className={kelasTombol("utama")}>
            Tambah Anggota
          </Link>
        )}
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
          name="divisi"
          defaultValue={fDivisi}
          aria-label="Filter divisi"
          className="h-10 px-3 bg-white border border-line rounded-[8px] text-[13px] focus:border-brand focus:outline-none"
        >
          <option value="">Semua divisi</option>
          {divisi.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nama}
            </option>
          ))}
        </select>

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
            judul="Belum ada anggota yang cocok"
            pesan="Ubah kata kunci atau filter, atau tambahkan anggota baru."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-[13px]">
              <thead>
                <tr className="bg-surface border-b border-line text-[11px] uppercase tracking-wider text-ink-muted">
                  <th className="text-left font-semibold px-5 py-3">Nama</th>
                  <th className="text-left font-semibold px-5 py-3">NIM</th>
                  <th className="text-left font-semibold px-5 py-3">Prodi</th>
                  <th className="text-left font-semibold px-5 py-3">Divisi</th>
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
                      <td className="px-5 py-3 text-ink-muted">
                        {a.divisi?.nama ?? "—"}
                      </td>
                      <td className="px-5 py-3">
                        <Lencana peran={a.peran} />
                      </td>
                      <td className="px-5 py-3 text-right">
                        {bolehEdit ? (
                          <div className="flex items-center justify-end gap-3">
                            <Link
                              href={`/admin/anggota/${a.id}`}
                              className="text-[12px] font-medium text-brand-dark hover:underline"
                            >
                              Ubah
                            </Link>
                            {penuh(user) && user.id !== a.id && (
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