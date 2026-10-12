import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar, Kartu, Lencana } from "@/components/ui";
import { divisiDetail } from "@/lib/queries";

export async function generateMetadata(
  props: PageProps<"/divisi/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const d = await divisiDetail(slug);
  return { title: d?.nama ?? "Divisi" };
}

export default async function DetailDivisi(props: PageProps<"/divisi/[slug]">) {
  const { slug } = await props.params;
  const d = await divisiDetail(slug);
  if (!d) notFound();

  const kepala = d.anggota.find((a) => a.peran === "KEPALA_DIVISI");
  const lain = d.anggota.filter((a) => a.peran !== "KEPALA_DIVISI");

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-12">
      <Link
        href="/divisi"
        className="text-[13px] text-ink-muted hover:text-ink"
      >
        Semua divisi
      </Link>

      <h1 className="mt-3 text-[28px] font-bold text-ink">{d.nama}</h1>
      <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-ink-muted">
        {d.deskripsi}
      </p>

      {kepala && (
        <Kartu className="mt-8 p-6 flex items-center gap-4">
          <Avatar nama={kepala.nama} ukuran={64} />
          <div>
            <p className="text-[12px] uppercase tracking-wider text-ink-muted">
              Kepala Divisi
            </p>
            <p className="mt-1 text-[16px] font-semibold text-ink">
              {kepala.nama}
            </p>
            <p className="mt-1 text-[12px] text-ink-muted">
              {kepala.prodi} · {kepala.angkatan}
            </p>
          </div>
        </Kartu>
      )}

      <h2 className="mt-10 text-[18px] font-semibold text-ink">
        Anggota <span className="text-[13px] font-normal text-ink-muted">({lain.length})</span>
      </h2>

      {lain.length === 0 ? (
        <p className="mt-4 text-[14px] text-ink-muted">
          Belum ada anggota lain di divisi ini.
        </p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lain.map((a) => (
            <Kartu key={a.id} className="p-5 flex items-center gap-3">
              <Avatar nama={a.nama} ukuran={44} />
              <div className="min-w-0">
                <p className="text-[14px] font-medium text-ink truncate">
                  {a.nama}
                </p>
                <div className="mt-1">
                  <Lencana peran={a.peran} />
                </div>
                <p className="mt-1 text-[11px] text-ink-muted truncate">
                  {a.prodi} · {a.angkatan}
                </p>
              </div>
            </Kartu>
          ))}
        </div>
      )}
    </div>
  );
}