"use client";

import { hapusAnggotaAction } from "@/app/actions";

export function HapusAnggota({ id, nama }: { id: string; nama: string }) {
  return (
    <form
      action={hapusAnggotaAction}
      onSubmit={(e) => {
        if (!confirm(`Hapus ${nama} dari daftar anggota?`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-[12px] font-medium text-danger hover:underline"
      >
        Hapus
      </button>
    </form>
  );
}