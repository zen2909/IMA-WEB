import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "./db";
import { hashPassword, verifyPassword } from "./password";

export { hashPassword, verifyPassword };

const COOKIE = "ima_session";
const SEMinggu = 60 * 60 * 24 * 7;

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) {
    throw new Error(
      "AUTH_SECRET belum diset atau terlalu pendek (min. 32 karakter).",
    );
  }
  return new TextEncoder().encode(s);
}

export async function createSession(id: string) {
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());

  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SEMinggu,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function getSessionId(): Promise<string | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

export type Pengguna = NonNullable<Awaited<ReturnType<typeof getPengguna>>>;

/**
 * Cookie hanya menyimpan id. Peran dan divisi selalu dibaca ulang dari database
 * supaya perubahan jabatan langsung berlaku tanpa menunggu cookie kedaluwarsa.
 */
export async function getPengguna() {
  const id = await getSessionId();
  if (!id) return null;

  const anggota = await prisma.anggota.findUnique({
    where: { id },
    include: { divisi: true },
  });

  if (!anggota || !anggota.aktif || !anggota.passwordHash) return null;
  return anggota;
}