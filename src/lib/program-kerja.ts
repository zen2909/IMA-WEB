export const STATUS_PROGRAM_KERJA = ["RENCANA", "BERJALAN", "SELESAI"] as const;

export type StatusProgramKerja = (typeof STATUS_PROGRAM_KERJA)[number];

export const LABEL_STATUS: Record<StatusProgramKerja, string> = {
  RENCANA: "Rencana",
  BERJALAN: "Berjalan",
  SELESAI: "Selesai",
};

/** Warna badge: hijau hanya untuk yang sedang berjalan, netral untuk rencana. */
export const WARNA_STATUS: Record<StatusProgramKerja, string> = {
  BERJALAN: "bg-brand-soft text-brand-dark border-brand-border",
  RENCANA: "bg-surface text-ink border-line",
  SELESAI: "bg-surface text-ink-muted border-line",
};

export function isStatus(v: unknown): v is StatusProgramKerja {
  return typeof v === "string" && (STATUS_PROGRAM_KERJA as readonly string[]).includes(v);
}