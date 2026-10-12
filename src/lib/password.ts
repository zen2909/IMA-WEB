import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

/**
 * Modul ini sengaja bebas impor Next.js supaya bisa dipakai dari seed script
 * yang dijalankan Node secara langsung. scrypt adalah builtin Node yang sudah
 * ter-audit — tidak perlu tambah dependency bcrypt.
 */
export async function hashPassword(pw: string): Promise<string> {
  const salt = randomBytes(16);
  const key = (await scryptAsync(pw, salt, 64)) as Buffer;
  return `scrypt$${salt.toString("hex")}$${key.toString("hex")}`;
}

export async function verifyPassword(
  pw: string,
  stored: string,
): Promise<boolean> {
  const [algo, saltHex, keyHex] = stored.split("$");
  if (algo !== "scrypt" || !saltHex || !keyHex) return false;
  const key = (await scryptAsync(pw, Buffer.from(saltHex, "hex"), 64)) as Buffer;
  const expected = Buffer.from(keyHex, "hex");
  return key.length === expected.length && timingSafeEqual(key, expected);
}