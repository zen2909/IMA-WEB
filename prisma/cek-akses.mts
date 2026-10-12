// Verifikasi batas wewenang lewat jalur aplikasi sungguhan: terbitkan cookie
// sesi, lalu minta halaman panel sebagai tiap peran dan lihat apa yang dirender.
// Jalankan saat `npm run dev` sudah hidup.
import { SignJWT } from "jose";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client.ts";

process.loadEnvFile(".env");

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! }),
});

const BASE = "http://localhost:3000";
const RAHASIA = new TextEncoder().encode(process.env.AUTH_SECRET!);

async function sesiUntuk(email: string) {
  const a = await prisma.anggota.findUnique({
    where: { email },
    include: { divisi: true },
  });
  if (!a) throw new Error(`anggota ${email} tidak ada`);
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(a.id)
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(RAHASIA);
  return { cookie: `ima_session=${token}`, peran: a.peran, divisi: a.divisi?.nama ?? "-" };
}

const hitung = (html: string, s: string) => html.split(s).length - 1;

/** Halaman yang hanya boleh dibuka peran tertentu, dicek lewat redirect. */
async function terkunci(rute: string, pengelize: string) {
  const r = await fetch(BASE + rute, {
    headers: { cookie: pengelize },
    redirect: "manual",
  });
  return r.status;
}

for (const email of [
  "221063115@arosbaya.ac.id", // Ketua
  "221063130@arosbaya.ac.id", // Kepala Divisi Pendidikan
  "221063125@arosbaya.ac.id", // Bendahara
]) {
  const { cookie, peran, divisi } = await sesiUntuk(email);
  console.log(`\n=== ${peran} (${divisi}) ===`);

  const admin = await fetch(`${BASE}/admin`, { headers: { cookie }, redirect: "manual" });
  const kadiv = await fetch(`${BASE}/kadiv`, { headers: { cookie }, redirect: "manual" });

  console.log(`  GET /admin  -> ${admin.status}${admin.headers.get("location") ? " -> " + admin.headers.get("location") : ""}`);
  console.log(`  GET /kadiv  -> ${kadiv.status}${kadiv.headers.get("location") ? " -> " + kadiv.headers.get("location") : ""}`);

  // redirect: "manual" supaya peran yang tidak berhak dilaporkan sebagai 307,
  // bukan diam-diam ikut terarah dan isinya tertukar dengan halaman lain.
  const daftar = await fetch(`${BASE}/admin/anggota`, {
    headers: { cookie },
    redirect: "manual",
  });
  const html = await daftar.text();
  console.log(`  /admin/anggota (${daftar.status}): Ubah=${hitung(html, ">Ubah<")} Hapus=${hitung(html, ">Hapus<")} takAkses=${hitung(html, "Tidak ada akses")}`);

  const daftarK = await fetch(`${BASE}/kadiv/anggota`, {
    headers: { cookie },
    redirect: "manual",
  });
  const htmlK = await daftarK.text();
  console.log(`  /kadiv/anggota (${daftarK.status}): baris=${hitung(htmlK, "<tbody") ? hitung(htmlK, 'href="/kadiv/anggota/') : 0} Ubah=${hitung(htmlK, ">Ubah<")} Hapus=${hitung(htmlK, ">Hapus<")} takAkses=${hitung(htmlK, "Tidak ada akses")}`);
  console.log(`    anggota divisi lain ("Andi Wijaya") tampil=${htmlK.includes("Andi Wijaya")}`);
  console.log(`    anggota sendiri ("Maya Sari") tampil=${htmlK.includes("Maya Sari")}`);

  const pk = await fetch(`${BASE}/kadiv/program-kerja`, {
    headers: { cookie },
    redirect: "manual",
  });
  const htmlPk = await pk.text();
  console.log(`  /kadiv/program-kerja (${pk.status}): kartu=${hitung(htmlPk, ">Hapus<")} tambahPanel=${htmlPk.includes("Tambah program kerja")}`);

  console.log(`  terkunci: /admin/divisi=${await terkunci("/admin/divisi", cookie)} /kadiv/profil-divisi=${await terkunci("/kadiv/profil-divisi", cookie)}`);
  // Bendahara tidak boleh sampai ke form tambah anggota sama sekali.
  console.log(`  /admin/anggota/baru -> ${await terkunci("/admin/anggota/baru", cookie)}`);
  console.log(`  tombol "Tambah Anggota" tampil=${(await (await fetch(`${BASE}/admin/anggota`, { headers: { cookie } })).text()).includes("/admin/anggota/baru")}`);
}

await prisma.$disconnect();