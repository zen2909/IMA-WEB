"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MENU = [
  ["Beranda", "/"],
  ["Pengurusan", "/pengurusan"],
  ["Divisi", "/divisi"],
];

export function NavPublik() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navigasi utama" className="hidden md:flex items-center gap-1">
      {MENU.map(([label, href]) => {
        const aktif = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={aktif ? "page" : undefined}
            className={`px-3 py-2 rounded-[8px] text-[13px] font-medium transition-colors ${
              aktif
                ? "bg-brand-soft text-brand-dark"
                : "text-ink-muted hover:bg-surface hover:text-ink"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function TautanMasuk() {
  return (
    <Link
      href="/masuk"
      className="inline-flex h-10 items-center px-4 rounded-[8px] border border-line bg-white text-[13px] font-medium text-ink transition-colors hover:bg-surface"
    >
      Masuk
    </Link>
  );
}