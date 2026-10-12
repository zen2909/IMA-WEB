import Image from "next/image";
import Link from "next/link";
import { NavPublik, TautanMasuk } from "./nav-publik";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-line">
      <div className="mx-auto max-w-[1120px] px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/logo.jpg"
            alt=""
            width={34}
            height={34}
            className="rounded-full"
            priority
          />
          <span className="leading-tight">
            <span className="block text-[15px] font-bold text-ink">IMA</span>
            <span className="block text-[11px] text-ink-muted">
              Ikatan Mahasiswa Arosbaya
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <NavPublik />
          <TautanMasuk />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-[#14532d] text-white/90">
      <div className="mx-auto max-w-[1120px] px-6 py-12 grid gap-8 sm:grid-cols-3">
        <div>
          <p className="text-[15px] font-bold text-white">
            Ikatan Mahasiswa Arosbaya
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-white/70">
            Wadah belajar dan berkarya. Bersama kita tumbuh, bersama kita berdampak.
          </p>
        </div>
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-wider text-white/60">
            Navigasi
          </p>
          <ul className="mt-3 space-y-2 text-[13px]">
            <li>
              <Link href="/pengurusan" className="hover:underline">
                Pengurusan
              </Link>
            </li>
            <li>
              <Link href="/divisi" className="hover:underline">
                Divisi
              </Link>
            </li>
            <li>
              <Link href="/masuk" className="hover:underline">
                Masuk
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-wider text-white/60">
            Sekretariat
          </p>
          <p className="mt-3 text-[13px] leading-relaxed text-white/70">
           Kantor buka hari kerja 09.00-15.00 WIB di Ruang Sekretariat IMA.
          </p>
        </div>
      </div>
    </footer>
  );
}