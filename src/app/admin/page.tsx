import Link from "next/link";
import { Kartu, kelasTombol } from "@/components/ui";
import { prisma } from "@/lib/db";
import { LABEL_PERAN } from "@/lib/anggota";

export default async function Dashboard() {
  const [total, aktif, tanpaDivisi, perDivisi] = await Promise.all([
    prisma.anggota.count(),
    prisma.anggota.count({ where: { aktif: true } }),
    prisma.anggota.count({ where: { aktif: true, divisiId: null } }),
    prisma.divisi.findMany({
      orderBy: { nama: "asc" },
      include: {
        _count: { select: { anggota: true } },
        anggota: {
          where: { peran: "KEPALA_DIVISI" },
          select: { nama: true },
          take: 1,
        },
      },
    }),
  ]);

  const stat = [
    ["Anggota", String(total)],
    ["Aktif", String(aktif)],
    ["Tanpa divisi", String(tanpaDivisi)],
    ["Divisi", String(perDivisi.length)],
  ];

  return (
    <div className="max-w-[1200px]">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[24px] font-bold text-ink">Dashboard</h1>
          <p className="mt-1 text-[13px] text-ink-muted">
            Ringkasan keanggotaan IMA.
          </p>
        </div>
        <Link href="/admin/anggota/baru" className={kelasTombol("utama")}>
          Tambah Anggota
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stat.map(([label, nilai]) => (
          <Kartu key={label} className="p-5">
            <p className="text-[12px] uppercase tracking-wider text-ink-muted">
              {label}
            </p>
            <p className="mt-2 text-[26px] font-bold text-ink leading-none">
              {nilai}
            </p>
          </Kartu>
        ))}
      </div>

      <h2 className="mt-10 text-[16px] font-semibold text-ink">
        Sebaran per divisi
      </h2>

      <Kartu className="mt-3 overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-surface border-b border-line text-[11px] uppercase tracking-wider text-ink-muted">
              <th className="text-left font-semibold px-5 py-3">Divisi</th>
              <th className="text-left font-semibold px-5 py-3">Kepala divisi</th>
              <th className="text-right font-semibold px-5 py-3">Anggota</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {perDivisi.map((d) => (
              <tr key={d.id}>
                <td className="px-5 py-3.5 font-medium text-ink">
                  <Link href={`/divisi/${d.slug}`} className="hover:underline">
                    {d.nama}
                  </Link>
                </td>
                <td className="px-5 py-3.5 text-ink-muted">
                  {d.anggota[0]?.nama ?? (
                    <span className="text-danger-txt">Belum ada</span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-right text-ink-muted">
                  {d._count.anggota}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Kartu>

      <p className="mt-6 text-[12px] text-ink-muted">
        Jabatan yang tersedia:{" "}
        {Object.values(LABEL_PERAN).join(", ")}.
      </p>
    </div>
  );
}