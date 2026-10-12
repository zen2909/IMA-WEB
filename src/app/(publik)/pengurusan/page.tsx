import type { Metadata } from "next";
import { Avatar, Kartu, Lencana } from "@/components/ui";
import { anggotaPublik, semuaDivisi } from "@/lib/queries";

export const metadata: Metadata = { title: "Pengurusan" };

const INTI = ["KETUA", "WAKIL", "SEKRETARIS", "BENDAHARA"];

export default async function Pengurusan() {
  const [semua, divisi] = await Promise.all([anggotaPublik(), semuaDivisi()]);

  const inti = semua.filter((a) => INTI.includes(a.peran));
  const namaDivisi = new Map(divisi.map((d) => [d.id, d.nama]));

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-12">
      <h1 className="text-[28px] font-bold text-ink">Pengurusan</h1>
      <p className="mt-2 text-[14px] text-ink-muted">
        Susunan pengurus dan anggota per divisi IMA.
      </p>

      <h2 className="mt-10 text-[18px] font-semibold text-ink">Pengurus Inti</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {inti.map((a) => (
          <Kartu key={a.id} className="p-6 text-center">
            <div className="flex justify-center">
              <Avatar nama={a.nama} ukuran={88} />
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

      {divisi.map((d) => {
        const members = semua
          .filter((a) => a.divisiId === d.id)
          .sort((a, b) =>
            b.peran === "KEPALA_DIVISI"
              ? -1
              : a.peran === "KEPALA_DIVISI"
                ? 1
                : a.nama.localeCompare(b.nama),
          );

        return (
          <section key={d.id} className="mt-12">
            <h2 className="text-[18px] font-semibold text-ink">
              {namaDivisi.get(d.id)}
              <span className="ml-2 text-[13px] font-normal text-ink-muted">
                {members.length} anggota
              </span>
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {members.map((a) => (
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
                      {a.prodi}
                    </p>
                  </div>
                </Kartu>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}