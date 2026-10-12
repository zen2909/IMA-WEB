import Link from "next/link";
import { Kartu, Lencana } from "@/components/ui";
import { prisma } from "@/lib/db";
import { getPengguna } from "@/lib/auth";
import { LABEL_STATUS, WARNA_STATUS } from "@/lib/program-kerja";
import type { StatusProgramKerja } from "@/lib/program-kerja";

export default async function DashboardKadiv() {
  const user = (await getPengguna())!;
  const divisiId = user.divisiId!;

  const [jumlahAnggota, program] = await Promise.all([
    prisma.anggota.count({ where: { divisiId, aktif: true } }),
    prisma.programKerja.findMany({
      where: { divisiId },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const berjalan = program.filter((p) => p.status === "BERJALAN");
  const berikutnya = program.filter((p) => p.status !== "BERJALAN");

  const stat = [
    ["Anggota", String(jumlahAnggota)],
    ["Program kerja", String(program.length)],
    ["Program berjalan", String(berjalan.length)],
  ];

  const kartuProgram = (p: (typeof program)[number]) => (
    <Kartu key={p.id} className="p-4 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-[14px] font-semibold text-ink">{p.judul}</p>
        {p.targetWaktu && (
          <p className="mt-1 text-[12px] text-ink-muted">{p.targetWaktu}</p>
        )}
      </div>
      <span
        className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border ${WARNA_STATUS[p.status as StatusProgramKerja]}`}
      >
        {LABEL_STATUS[p.status as StatusProgramKerja]}
      </span>
    </Kartu>
  );

  return (
    <div className="max-w-[1200px]">
      <h1 className="text-[24px] font-bold text-ink">Dashboard</h1>
      <p className="mt-1 text-[13px] text-ink-muted">{user.divisi?.nama}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
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

      <section className="mt-10">
        <div className="flex items-end justify-between gap-4 mb-3">
          <h2 className="text-[16px] font-semibold text-ink">
            Program kerja berjalan
          </h2>
          <Link
            href="/kadiv/program-kerja"
            className="text-[13px] font-medium text-brand-dark hover:underline"
          >
            Kelola
          </Link>
        </div>
        {berjalan.length === 0 ? (
          <Kartu className="p-6">
            <p className="text-[13px] text-ink-muted">
              Belum ada program kerja yang sedang berjalan.
            </p>
          </Kartu>
        ) : (
          <div className="space-y-3">
            {berjalan.map(kartuProgram)}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-[16px] font-semibold text-ink mb-3">
          Program berikutnya
        </h2>
        {berikutnya.length === 0 ? (
          <Kartu className="p-6">
            <p className="text-[13px] text-ink-muted">
              Tidak ada program kerja yang menunggu.
            </p>
          </Kartu>
        ) : (
          <div className="space-y-3">
            {berikutnya.map(kartuProgram)}
          </div>
        )}
      </section>

      <div className="mt-10 flex items-center gap-3">
        <Lencana peran={user.peran} />
        <span className="text-[12px] text-ink-muted">
          Halaman ini hanya menampilkan data {user.divisi?.nama}.
        </span>
      </div>
    </div>
  );
}