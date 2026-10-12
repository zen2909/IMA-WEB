import type { Peran } from "@/lib/anggota";
import { LABEL_PERAN } from "@/lib/anggota";

export function inisial(nama: string): string {
  return nama
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((k) => k[0]?.toUpperCase() ?? "")
    .join("");
}

export function Avatar({
  nama,
  ukuran = 40,
}: {
  nama: string;
  ukuran?: number;
}) {
  return (
    <span
      aria-hidden
      style={{ width: ukuran, height: ukuran, fontSize: ukuran * 0.34 }}
      className="shrink-0 rounded-full bg-brand-soft border border-brand-border text-brand-dark font-bold grid place-items-center"
    >
      {inisial(nama)}
    </span>
  );
}

/**
 * Warna badge: hijau untuk Ketua dan Wakil Ketua, netral untuk jabatan inti
 * lain. Hijau terang tidak pernah jadi warna teks — dipakai brand-dark.
 */
const WARNA_PERAN: Record<Peran, string> = {
  KETUA: "bg-brand-soft text-brand-dark border-brand-border",
  WAKIL: "bg-brand-soft text-brand-dark border-brand-border",
  KEPALA_DIVISI: "bg-surface text-ink border-line",
  SEKRETARIS: "bg-surface text-ink border-line",
  BENDAHARA: "bg-surface text-ink border-line",
  ANGGOTA: "bg-surface text-ink-muted border-line",
};

export function Lencana({
  peran,
  className = "",
}: {
  peran: string;
  className?: string;
}) {
  const warna = WARNA_PERAN[peran as Peran] ?? WARNA_PERAN.ANGGOTA;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border ${warna} ${className}`}
    >
      {LABEL_PERAN[peran as Peran] ?? peran}
    </span>
  );
}

type Varian = "utama" | "sekunder" | "bahaya";

const KELAS_TOMBOL: Record<Varian, string> = {
  utama: "bg-brand hover:bg-brand-darker text-white font-semibold",
  sekunder: "bg-white hover:bg-surface text-ink border border-line font-medium",
  bahaya: "bg-danger hover:brightness-90 text-white font-semibold",
};

export function kelasTombol(varian: Varian = "utama"): string {
  return `inline-flex h-10 items-center justify-center gap-2 px-4 rounded-[8px] text-[13px] transition-colors disabled:opacity-50 disabled:pointer-events-none ${KELAS_TOMBOL[varian]}`;
}

export function Kartu({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white border border-line rounded-[12px] ${className}`}
    >
      {children}
    </div>
  );
}

export function Label({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-[12px] font-medium text-ink-muted mb-1.5"
    >
      {children}
    </label>
  );
}

export const kelasInput =
  "w-full h-10 px-3 bg-white border border-line rounded-[8px] text-[13px] text-ink placeholder:text-ink-muted/60 focus:border-brand focus:ring-1 focus:ring-brand focus:outline-none";

export function Kosong({
  judul,
  pesan,
}: {
  judul: string;
  pesan: string;
}) {
  return (
    <div className="text-center py-14 px-6">
      <p className="text-[15px] font-semibold text-ink">{judul}</p>
      <p className="mt-1 text-[13px] text-ink-muted">{pesan}</p>
    </div>
  );
}