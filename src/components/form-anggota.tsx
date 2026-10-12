"use client";

import { useActionState } from "react";
import { simpanAnggotaAction, type FormState } from "@/app/actions";
import { Label, kelasInput, kelasTombol } from "@/components/ui";
import { LABEL_PERAN, PERAN } from "@/lib/anggota";

export type NilaiAnggota = {
  id?: string;
  nama: string;
  nim: string;
  prodi: string;
  angkatan: number;
  email: string;
  noHp: string;
  fotoUrl: string;
  peran: string;
  divisiId: string;
  aktif: boolean;
};

export function FormAnggota({
  awal,
  divisi,
  bolehUbahJabatan,
}: {
  awal?: NilaiAnggota;
  divisi: { id: string; nama: string }[];
  bolehUbahJabatan: boolean;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    simpanAnggotaAction,
    undefined,
  );

  const kelasOpsi = kelasInput + " appearance-none";

  return (
    <form action={action} className="space-y-5">
      {awal?.id && <input type="hidden" name="id" value={awal.id} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="nama">Nama lengkap</Label>
          <input id="nama" name="nama" required defaultValue={awal?.nama} className={kelasInput} />
        </div>

        <div>
          <Label htmlFor="nim">NIM</Label>
          <input id="nim" name="nim" required defaultValue={awal?.nim} className={kelasInput} />
        </div>

        <div>
          <Label htmlFor="angkatan">Angkatan</Label>
          <input
            id="angkatan"
            name="angkatan"
            type="number"
            required
            min={2000}
            max={2100}
            defaultValue={awal?.angkatan}
            className={kelasInput}
          />
        </div>

        <div>
          <Label htmlFor="prodi">Program studi</Label>
          <input id="prodi" name="prodi" required defaultValue={awal?.prodi} className={kelasInput} />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={awal?.email}
            className={kelasInput}
          />
        </div>

        <div>
          <Label htmlFor="noHp">Nomor HP</Label>
          <input id="noHp" name="noHp" defaultValue={awal?.noHp} className={kelasInput} />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="fotoUrl">URL foto</Label>
          <input
            id="fotoUrl"
            name="fotoUrl"
            defaultValue={awal?.fotoUrl}
            placeholder="https://..."
            className={kelasInput}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 border-t border-line pt-5">
        <div>
          <Label htmlFor="divisiId">Divisi</Label>
          {bolehUbahJabatan ? (
            <select
              id="divisiId"
              name="divisiId"
              defaultValue={awal?.divisiId ?? ""}
              className={kelasOpsi}
            >
              <option value="">Belum ada divisi</option>
              {divisi.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nama}
                </option>
              ))}
            </select>
          ) : (
            <p className="h-10 flex items-center text-[13px] text-ink-muted">
              Hanya Ketua, Wakil, atau Sekretaris yang bisa memindahkan anggota.
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="peran">Jabatan</Label>
          {bolehUbahJabatan ? (
            <select
              id="peran"
              name="peran"
              defaultValue={awal?.peran ?? "ANGGOTA"}
              className={kelasOpsi}
            >
              {PERAN.map((p) => (
                <option key={p} value={p}>
                  {LABEL_PERAN[p]}
                </option>
              ))}
            </select>
          ) : (
            <p className="h-10 flex items-center text-[13px] text-ink-muted">
              Kamu hanya bisa mengubah data dasar, bukan jabatan.
            </p>
          )}
        </div>

        <label className="flex items-center gap-2 text-[13px] text-ink sm:col-span-2">
          <input
            type="checkbox"
            name="aktif"
            defaultChecked={awal ? awal.aktif : true}
            className="w-4 h-4 accent-[#21C22E]"
          />
          Anggota aktif
        </label>
      </div>

      {!awal?.id && (
        <div className="border-t border-line pt-5">
          <Label htmlFor="sandi">Kata sandi akun (opsional)</Label>
          <input
            id="sandi"
            name="sandi"
            type="password"
            autoComplete="new-password"
            placeholder="Kosongkan bila anggota tidak dibuatkan akun login"
            className={kelasInput}
          />
        </div>
      )}

      {state?.error && (
        <p
          role="alert"
          className="rounded-[8px] bg-danger-soft border border-danger/30 px-3 py-2 text-[13px] text-danger-txt"
        >
          {state.error}
        </p>
      )}

      <div className="flex gap-3 border-t border-line pt-5">
        <button type="submit" disabled={pending} className={kelasTombol("utama")}>
          {pending ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}