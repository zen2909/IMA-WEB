-- AlterTable
ALTER TABLE "Divisi" ADD COLUMN "kontak" TEXT;
ALTER TABLE "Divisi" ADD COLUMN "misi" TEXT;
ALTER TABLE "Divisi" ADD COLUMN "visi" TEXT;

-- CreateTable
CREATE TABLE "ProgramKerja" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT,
    "status" TEXT NOT NULL DEFAULT 'RENCANA',
    "targetWaktu" TEXT,
    "divisiId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProgramKerja_divisiId_fkey" FOREIGN KEY ("divisiId") REFERENCES "Divisi" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ProgramKerja_divisiId_idx" ON "ProgramKerja"("divisiId");
