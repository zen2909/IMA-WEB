export const PERAN = [
  "ANGGOTA",
  "KEPALA_DIVISI",
  "SEKRETARIS",
  "BENDAHARA",
  "WAKIL",
  "KETUA",
] as const;

export type Peran = (typeof PERAN)[number];

export const LABEL_PERAN: Record<Peran, string> = {
  ANGGOTA: "Anggota",
  KEPALA_DIVISI: "Kepala Divisi",
  SEKRETARIS: "Sekretaris",
  BENDAHARA: "Bendahara",
  WAKIL: "Wakil Ketua",
  KETUA: "Ketua",
};

export function isPeran(v: unknown): v is Peran {
  return typeof v === "string" && (PERAN as readonly string[]).includes(v);
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}