-- CreateTable
CREATE TABLE "Divisi" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nama" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "deskripsi" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Anggota" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nama" TEXT NOT NULL,
    "nim" TEXT NOT NULL,
    "prodi" TEXT NOT NULL,
    "angkatan" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "noHp" TEXT,
    "fotoUrl" TEXT,
    "passwordHash" TEXT,
    "peran" TEXT NOT NULL DEFAULT 'ANGGOTA',
    "divisiId" TEXT,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Anggota_divisiId_fkey" FOREIGN KEY ("divisiId") REFERENCES "Divisi" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Divisi_slug_key" ON "Divisi"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Anggota_nim_key" ON "Anggota"("nim");

-- CreateIndex
CREATE UNIQUE INDEX "Anggota_email_key" ON "Anggota"("email");

-- CreateIndex
CREATE INDEX "Anggota_divisiId_idx" ON "Anggota"("divisiId");

-- CreateIndex
CREATE INDEX "Anggota_peran_idx" ON "Anggota"("peran");
