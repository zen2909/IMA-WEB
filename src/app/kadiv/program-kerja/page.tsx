import Link from "next/link";
import { Kartu, Kosong } from "@/components/ui";
import { prisma } from "@/lib/db";
import { getPengguna } from "@/lib/auth";
import { LABEL_STATUS, WARNA_STATUS } from "@/lib/program-kerja";
import type { StatusProgramKerja } from "@/lib/program-kerja";
import { FormProgramKerja } from "@/components/form-program-kerja";
import { HapusProgramKerja } from "./hapus-program-kerja";

export default async function ProgramKerja(props: PageProps<"/kadiv/program-kerja">) {
  const sp = await props.searchParams;
  const editId = String(sp.edit ?? "");

  const user = (await getPengguna())!;

  const program = await prisma.programKerja.findMany({
    where: { divisiId: user.divisiId! },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="max-w-[1200px]">
      <h1 className="text-[24px] font-bold text-ink">Program Kerja</h1>
      <p className="mt-1 text-[13px] text-ink-muted">
        Rencana kerja {user.divisi?.nama}
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr] items-start">
        <div className="space-y-4">
          {program.length === 0 ? (
            <Kartu>
              <Kosong
                judul="Belum ada program kerja"
                pesan="Tambahkan rencana kerja pertama di samping."
              />
            </Kartu>
          ) : (
            program.map((p) => {
              const sedangUbah = editId === p.id;
              return (
                <Kartu key={p.id} className="p-5">
                  {sedangUbah ? (
                    <FormProgramKerja
                      awal={{
                        id: p.id,
                        judul: p.judul,
                        deskripsi: p.deskripsi ?? "",
                        status: p.status,
                        targetWaktu: p.targetWaktu ?? "",
                      }}
                    />
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[15px] font-semibold text-ink">
                          {p.judul}
                        </p>
                        {p.deskripsi && (
                          <p className="mt-1 text-[13px] text-ink-muted">
                            {p.deskripsi}
                          </p>
                        )}
                        {p.targetWaktu && (
                          <p className="mt-2 text-[12px] text-ink-muted">
                            Target: {p.targetWaktu}
                          </p>
                        )}
                      </div>
                      <div className="flex items-start gap-3 shrink-0">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border ${WARNA_STATUS[p.status as StatusProgramKerja]}`}
                        >
                          {LABEL_STATUS[p.status as StatusProgramKerja]}
                        </span>
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/kadiv/program-kerja?edit=${p.id}`}
                            className="text-[12px] font-medium text-brand-dark hover:underline"
                          >
                            Ubah
                          </Link>
                          <HapusProgramKerja id={p.id} judul={p.judul} />
                        </div>
                      </div>
                    </div>
                  )}
                </Kartu>
              );
            })
          )}
        </div>

        <Kartu className="p-5">
          <h2 className="text-[14px] font-semibold text-ink mb-4">
            Tambah program kerja
          </h2>
          <FormProgramKerja />
        </Kartu>
      </div>
    </div>
  );
}