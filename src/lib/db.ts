import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";

// Di dev, Next.js hot-reload membuat modul ini dimuat ulang — tanpa cache global
// setiap reload membuka koneksi SQLite baru sampai file descriptor habis.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaBetterSqlite3({
      url: process.env.DATABASE_URL ?? "file:./dev.db",
    }),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;