import Link from "next/link";
import { Avatar, Kartu, Lencana, kelasTombol } from "@/components/ui";
import {
  anggotaInti,
  hitungAnggotaAktif,
  hitungKepalaDivisi,
  semuaDivisi,
} from "@/lib/queries";

export default async function Beranda() {
  const [inti, divisi, total, kepalaDivisi] = await Promise.all([
    anggotaInti(),
    semuaDivisi(),
    hitungAnggotaAktif(),
    hitungKepalaDivisi(),
  ]);

  const stat = [
    ["Anggota", String(total)],
    ["Divisi", String(divisi.length)],
    ["Kepala Divisi", String(kepalaDivisi)],
  ];

  return (
    <>
      <section className="bg-brand-soft border-b border-brand-border">
        <div className="mx-auto max-w-[1120px] px-6 py-16 sm:py-20 grid gap-10 lg:grid-cols-[1.4fr_1fr] items-center">
          <div>
            <h1 className="text-[34px] sm:text-[40px] font-bold leading-[1.15] text-ink">
              Ikatan Mahasiswa Arosbaya
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-muted max-w-xl">
                            Organisasi mahasiswa yang menghimpun belajar, berkarya, dan bekerja sama.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/pengurusan" className={kelasTombol("utama")}>
                Lihat Pengurusan
              </Link>
              <Link href="/divisi" className={kelasTombol("sekunder")}>
                Kenali Divisi
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {stat.map(([label, nilai]) => (
              <Kartu key={label} className="p-5 text-center border-white">
                <p className="text-[28px] font-bold text-ink leading-none">
                  {nilai}
                </p>
                <p className="mt-2 text-[12px] text-ink-muted">{label}</p>
              </Kartu>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] px-6 py-16">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-[22px] font-bold text-ink">Susunan Pengurus</h2>
            <p className="mt-1 text-[13px] text-ink-muted">
              Pengurus inti periode berjalan.
            </p>
          </div>
          <Link
            href="/pengurusan"
            className="text-[13px] font-medium text-brand-dark hover:underline shrink-0"
          >
            Semua pengurus
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {inti.map((a) => (
            <Kartu key={a.id} className="p-6 text-center">
              <div className="flex justify-center">
                <Avatar nama={a.nama} ukuran={72} />
              </div>
              <p className="mt-4 text-[15px] font-semibold text-ink">{a.nama}</p>
              <div className="mt-2 flex justify-center">
                <Lencana peran={a.peran} />
              </div>
              <p className="mt-3 text-[12px] text-ink-muted">
                {a.prodi} · {a.angkatan}
              </p>
            </Kartu>
          ))}
        </div>
      </section>

      <section className="bg-surface border-y border-line">
        <div className="mx-auto max-w-[1120px] px-6 py-16">
          <h2 className="text-[22px] font-bold text-ink">Divisi Kami</h2>
          <p className="mt-1 text-[13px] text-ink-muted mb-6">
            Divisi yang menjalankan kegiatan IMA.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {divisi.map((d) => (
              <Kartu key={d.id} className="p-6">
                <h3 className="text-[15px] font-semibold text-ink">{d.nama}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-muted line-clamp-3">
                  {d.deskripsi}
                </p>
                <p className="mt-4 text-[12px] text-ink-muted">
                  {d._count.anggota} anggota
                </p>
                <Link
                  href={`/divisi/${d.slug}`}
                  className="mt-4 inline-block text-[13px] font-medium text-brand-dark hover:underline"
                >
                  Lihat divisi
                </Link>
              </Kartu>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}