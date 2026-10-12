"use client";

import { useActionState } from "react";
import { simpanProgramKerjaAction, type FormState } from "@/app/actions";
import { Label, kelasInput, kelasTombol } from "@/components/ui";
import { LABEL_STATUS, STATUS_PROGRAM_KERJA } from "@/lib/program-kerja";

export type NilaiProgramKerja = {
  id: string;
  judul: string;
  deskripsi: string;
  status: string;
  targetWaktu: string;
};

export function FormProgramKerja({ awal }: { awal?: NilaiProgramKerja }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    simpanProgramKerjaAction,
    undefined,
  );

  const key = awal?.id ?? "baru";

  return (
    <form action={action} className="space-y-4">
      {awal?.id && <input type="hidden" name="id" value={awal.id} />}

      <div>
        <Label htmlFor={`judul-${key}`}>Judul</Label>
        <input
          id={`judul-${key}`}
          name="judul"
          required
          defaultValue={awal?.judul}
          className={kelasInput}
        />
      </div>

      <div>
        <Label htmlFor={`deskripsi-${key}`}>Deskripsi</Label>
        <textarea
          id={`deskripsi-${key}`}
          name="deskripsi"
          rows={3}
          defaultValue={awal?.deskripsi}
          className={kelasInput + " h-auto py-2"}
        />
      </div>

      <div>
        <Label htmlFor={`status-${key}`}>Status</Label>
        <select
          id={`status-${key}`}
          name="status"
          defaultValue={awal?.status ?? "RENCANA"}
          className={kelasInput + " appearance-none"}
        >
          {STATUS_PROGRAM_KERJA.map((s) => (
            <option key={s} value={s}>
              {LABEL_STATUS[s]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor={`targetWaktu-${key}`}>Target waktu</Label>
        <input
          id={`targetWaktu-${key}`}
          name="targetWaktu"
          defaultValue={awal?.targetWaktu}
          placeholder="Contoh: Semester genap 2026"
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
        {pending ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
}