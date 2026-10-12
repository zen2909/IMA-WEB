"use client";

import { useActionState } from "react";
import { simpanDivisiAction, type FormState } from "@/app/actions";
import { Label, kelasInput, kelasTombol } from "@/components/ui";

export type NilaiProfil = {
  id: string;
  nama: string;
  deskripsi: string;
  visi: string;
  misi: string;
  kontak: string;
};

export function FormProfilDivisi({
  awal,
  bolehUbahNama,
}: {
  awal: NilaiProfil;
  bolehUbahNama: boolean;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    simpanDivisiAction,
    undefined,
  );

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="id" value={awal.id} />

      <div>
        <Label htmlFor="nama">Nama divisi</Label>
        {bolehUbahNama ? (
          <input id="nama" name="nama" required defaultValue={awal.nama} className={kelasInput} />
        ) : (
          <>
            {/* Nama menentukan slug dan URL publik, jadi tetap terkirim supaya
                server tidak menolaknya — tapi tidak boleh diubah dari sini. */}
            <input type="hidden" name="nama" value={awal.nama} />
            <p className="h-10 flex items-center text-[13px] text-ink-muted">
              {awal.nama} — nama divisi hanya bisa diubah Ketua atau Wakil.
            </p>
          </>
        )}
      </div>

      <div>
        <Label htmlFor="deskripsi">Deskripsi</Label>
        <textarea
          id="deskripsi"
          name="deskripsi"
          rows={3}
          defaultValue={awal.deskripsi}
          className={kelasInput + " h-auto py-2"}
        />
      </div>

      <div>
        <Label htmlFor="visi">Visi</Label>
        <textarea
          id="visi"
          name="visi"
          rows={2}
          defaultValue={awal.visi}
          className={kelasInput + " h-auto py-2"}
        />
      </div>

      <div>
        <Label htmlFor="misi">Misi</Label>
        <textarea
          id="misi"
          name="misi"
          rows={3}
          defaultValue={awal.misi}
          className={kelasInput + " h-auto py-2"}
        />
      </div>

      <div>
        <Label htmlFor="kontak">Kontak</Label>
        <input
          id="kontak"
          name="kontak"
          type="email"
          defaultValue={awal.kontak}
          className={kelasInput}
        />
      </div>

      {state?.error && (
        <p
          role="alert"
          className="rounded-[8px] bg-danger-soft border border-danger/30 px-3 py-2 text-[13px] text-danger-txt"
        >
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className={kelasTombol("utama")}>
        {pending ? "Menyimpan..." : "Simpan perubahan"}
      </button>
    </form>
  );
}