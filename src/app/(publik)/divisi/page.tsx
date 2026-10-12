import type { Metadata } from "next";
import Link from "next/link";
import { Kartu } from "@/components/ui";
import { semuaDivisi } from "@/lib/queries";

export const metadata: Metadata = { title: "Divisi" };

export default async function HalamanDivisi() {
  const divisi = await semuaDivisi();

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-12">
      <h1 className="text-[28px] font-bold text-ink">Divisi</h1>
      <p className="mt-2 text-[14px] text-ink-muted">
        IMA dibagi ke dalam {divisi.length} divisi, masing-masing dengan kepala
        dan anggota tersendiri.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {divisi.map((d) => (
          <Kartu key={d.id} className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-[16px] font-semibold text-ink">{d.nama}</h2>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
                  {d.deskripsi}
                </p>
              </div>
              <span className="shrink-0 text-[12px] text-ink-muted">
                {d._count.anggota} anggota
              </span>
            </div>
            <Link
              href={`/divisi/${d.slug}`}
              className="mt-5 inline-block text-[13px] font-medium text-brand-dark hover:underline"
            >
              Lihat anggota
            </Link>
          </Kartu>
        ))}
      </div>
    </div>
  );
}