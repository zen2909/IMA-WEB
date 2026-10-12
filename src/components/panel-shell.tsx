import Image from "next/image";
import { PanelNav, type ItemMenu } from "./panel-nav";
import { keluarAction } from "@/app/actions";
import { LABEL_PERAN } from "@/lib/anggota";
import type { Pengguna } from "@/lib/auth";

/**
 * Kerangka sidebar yang dipakai /admin dan /kadiv. Bedanya cuma isi menunya,
 * jadi tidak perlu dua salinan.
 */
export function PanelShell({
  user,
  menu,
  basePath,
  judul,
  children,
}: {
  user: Pengguna;
  menu: ItemMenu[];
  basePath: string;
  judul: string;
  children: React.ReactNode;
}) {
  const peran = LABEL_PERAN[user.peran as keyof typeof LABEL_PERAN] ?? user.peran;
  const konteks = [peran, user.divisi?.nama].filter(Boolean).join(" · ");

  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex w-[240px] shrink-0 flex-col bg-white border-r border-line">
        <div className="px-5 py-6 border-b border-line flex items-center gap-2.5">
          <Image
            src="/logo.jpg"
            alt=""
            width={36}
            height={36}
            className="rounded-full"
          />
          <span className="leading-tight">
            <span className="block text-[15px] font-bold text-ink">IMA</span>
            <span className="block text-[11px] text-ink-muted">{judul}</span>
          </span>
        </div>

        <div className="flex-1 p-4">
          <PanelNav menu={menu} basePath={basePath} />
        </div>

        <div className="p-4 border-t border-line">
          <p className="text-[13px] font-medium text-ink truncate">{user.nama}</p>
          <p className="text-[11px] text-ink-muted truncate">{konteks}</p>
          <form action={keluarAction} className="mt-3">
            <button
              type="submit"
              className="text-[12px] font-medium text-ink-muted hover:text-danger"
            >
              Keluar
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="md:hidden border-b border-line bg-white px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-bold text-ink">IMA · {judul}</span>
            <form action={keluarAction}>
              <button type="submit" className="text-[12px] text-ink-muted">
                Keluar
              </button>
            </form>
          </div>
          <div className="mt-3">
            <PanelNav menu={menu} basePath={basePath} />
          </div>
        </div>

        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}