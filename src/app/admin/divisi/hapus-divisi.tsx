"use client";

import { hapusDivisiAction } from "@/app/actions";

export function HapusDivisi({ id, nama }: { id: string; nama: string }) {
  return (
    <form
      action={hapusDivisiAction}
      onSubmit={(e) => {
        if (
          !confirm(
            `Hapus ${nama}? Anggota yang ada di divisi ini tidak ikut terhapus, hanya lepas dari divisi.`,
          )
        )
          e.preventDefault();
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