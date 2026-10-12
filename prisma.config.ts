import { existsSync } from "node:fs";
import { defineConfig } from "prisma/config";

// Prisma 7 tidak auto-load .env, dan Next.js tidak memprosesnya di luar runtime
// aplikasi. process.loadEnvFile() adalah builtin Node, tanpa dependensi tambahan.
if (existsSync(".env")) process.loadEnvFile(".env");

export default defineConfig({
  schema: "prisma/schema.prisma",
  // Prisma 7: URL koneksi tidak lagi ada di schema.prisma.
  // `env()` melempar error kalau DATABASE_URL kosong, sedangkan `postinstall`
  // menjalankan `prisma generate` di mesin yang belum punya .env. Nilai
  // cadangannya sama dengan isi .env kita, jadi tidak mengubah perilaku.
  datasource: { url: process.env.DATABASE_URL ?? "file:./dev.db" },
  migrations: { seed: "npx tsx prisma/seed.ts" },
});