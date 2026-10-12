"use client";

import { useActionState } from "react";
import { simpanDivisiAction, type FormState } from "@/app/actions";
import { Label, kelasInput, kelasTombol } from "@/components/ui";

export function FormDivisi({ awal }: { awal?: { id: string; nama: string; deskripsi: string } }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    simpanDivisiAction,
    undefined,
  );

  return (
    <form action={action} className="space-y-4">
      {awal?.id && <input type="hidden" name="id" value={awal.id} />}

      <div>
        <Label htmlFor={`nama-${awal?.id ?? "baru"}`}>Nama divisi</Label>
        <input
          id={`nama-${awal?.id ?? "baru"}`}
          name="nama"
          required
          defaultValue={awal?.nama}
          className={kelasInput}
        />
      </div>

      <div>
        <Label htmlFor={`deskripsi-${awal?.id ?? "baru"}`}>Deskripsi</Label>
        <textarea
          id={`deskripsi-${awal?.id ?? "baru"}`}
          name="deskripsi"
          rows={3}
          defaultValue={awal?.deskripsi}
          className={kelasInput + " h-auto py-2"}
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