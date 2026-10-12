"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type ItemMenu = { label: string; href: string };

export const MENU_ADMIN: ItemMenu[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Anggota", href: "/admin/anggota" },
  { label: "Divisi", href: "/admin/divisi" },
  { label: "Akun Saya", href: "/admin/akun" },
];

export const MENU_KADIV: ItemMenu[] = [
  { label: "Dashboard", href: "/kadiv" },
  { label: "Anggota", href: "/kadiv/anggota" },
  { label: "Profil Divisi", href: "/kadiv/profil-divisi" },
  { label: "Program Kerja", href: "/kadiv/program-kerja" },
  { label: "Akun Saya", href: "/kadiv/akun" },
];

/**
 * Satu komponen untuk dua ruang panel. `basePath` menentukan item mana yang
 * dianggap aktif di level teratas, supaya /admin/divisi tidak menyalakan
 * "/admin/anggota".
 */
export function PanelNav({
  menu,
  basePath,
}: {
  menu: ItemMenu[];
  basePath: string;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label="Navigasi panel" className="space-y-1">
      {menu.map(({ label, href }) => {
        const aktif =
          href === basePath ? pathname === basePath : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={aktif ? "page" : undefined}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-[8px] text-[13px] transition-colors ${
              aktif
                ? "bg-brand-soft text-brand-dark font-semibold"
                : "text-ink-muted hover:bg-surface hover:text-ink font-medium"
            }`}
          >
            <span
              aria-hidden
              className={`w-1.5 h-1.5 rounded-full ${aktif ? "bg-brand" : "bg-line"}`}
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}