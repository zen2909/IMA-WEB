// Self-check untuk lib/perm.ts. Logika ini menentukan siapa boleh mengubah
// siapa, jadi tidak cukup hanya "kelihatan benar".
// Jalankan: npx tsx prisma/cek-perm.ts
import assert from "node:assert/strict";
import { boleh, bolehUbahField, FIELD_BEBAS } from "../src/lib/perm.ts";

type Pengguna = Parameters<typeof boleh>[0];

const ketua = () => ({ peran: "KETUA" } as unknown as Pengguna);
const wakil = () => ({ peran: "WAKIL" } as unknown as Pengguna);
const sekretaris = () => ({ peran: "SEKRETARIS" } as unknown as Pengguna);
const bendahara = () => ({ peran: "BENDAHARA" } as unknown as Pengguna);
const anggota = () => ({ peran: "ANGGOTA" } as unknown as Pengguna);
const kepalaA = (id: string | null = "A") =>
  ({ peran: "KEPALA_DIVISI", divisiId: id } as unknown as Pengguna);

let lulus = 0;
function cek(nama: string, fn: () => void) {
  fn();
  lulus++;
  console.log(`  ok  ${nama}`);
}

console.log("kelola-anggota");
cek("ketua dan wakil boleh semua divisi termasuk kosong", () => {
  for (const u of [ketua(), wakil()]) {
    assert.equal(boleh(u, "kelola-anggota", "A"), true);
    assert.equal(boleh(u, "kelola-anggota", null), true);
  }
});
cek("sekretaris boleh semua divisi", () => {
  assert.equal(boleh(sekretaris(), "kelola-anggota", "Z"), true);
});
cek("kepala divisi boleh divisi sendiri", () => {
  assert.equal(boleh(kepalaA("A"), "kelola-anggota", "A"), true);
});
cek("kepala divisi tidak boleh divisi lain", () => {
  assert.equal(boleh(kepalaA("A"), "kelola-anggota", "B"), false);
  assert.equal(boleh(kepalaA("A"), "kelola-anggota", null), false);
});
cek("kepala divisi tanpa divisi tidak boleh apa pun", () => {
  assert.equal(boleh(kepalaA(null), "kelola-anggota", null), false);
  assert.equal(boleh(kepalaA(null), "kelola-anggota", "A"), false);
});
cek("bendahara dan anggota biasa tidak boleh mengelola", () => {
  assert.equal(boleh(bendahara(), "kelola-anggota", "A"), false);
  assert.equal(boleh(anggota(), "kelola-anggota", "A"), false);
});

console.log("ubah-divisi");
cek("ketua dan wakil boleh semua divisi", () => {
  assert.equal(boleh(ketua(), "ubah-divisi", "A"), true);
  assert.equal(boleh(wakil(), "ubah-divisi", "Z"), true);
});
cek("kepala divisi boleh mengubah divisinya sendiri", () => {
  assert.equal(boleh(kepalaA("A"), "ubah-divisi", "A"), true);
});
cek("kepala divisi tidak boleh mengubah divisi lain", () => {
  assert.equal(boleh(kepalaA("A"), "ubah-divisi", "B"), false);
  assert.equal(boleh(kepalaA("A"), "ubah-divisi", null), false);
});
cek("sekretaris dan bendahara tidak boleh mengubah divisi", () => {
  assert.equal(boleh(sekretaris(), "ubah-divisi", "A"), false);
  assert.equal(boleh(bendahara(), "ubah-divisi", "A"), false);
});

console.log("buat-divisi dan hapus-divisi");
cek("hanya ketua dan wakil, tanpa target divisi", () => {
  for (const aksi of ["buat-divisi", "hapus-divisi"] as const) {
    assert.equal(boleh(ketua(), aksi), true);
    assert.equal(boleh(wakil(), aksi), true);
    assert.equal(boleh(sekretaris(), aksi), false);
    assert.equal(boleh(bendahara(), aksi), false);
    assert.equal(boleh(kepalaA("A"), aksi), false);
  }
});

console.log("kelola-program-kerja");
cek("mengikuti aturan ubah-divisi", () => {
  assert.equal(boleh(kepalaA("A"), "kelola-program-kerja", "A"), true);
  assert.equal(boleh(kepalaA("A"), "kelola-program-kerja", "B"), false);
  assert.equal(boleh(ketua(), "kelola-program-kerja", "Z"), true);
  assert.equal(boleh(sekretaris(), "kelola-program-kerja", "A"), false);
});

console.log("field yang boleh diubah");
cek("peran penuh boleh ubah peran dan divisiId", () => {
  assert.equal(bolehUbahField(sekretaris(), "peran"), true);
  assert.equal(bolehUbahField(sekretaris(), "divisiId"), true);
});
cek("kepala divisi boleh ubah data dasar", () => {
  for (const f of FIELD_BEBAS)
    assert.equal(bolehUbahField(kepalaA("A"), f), true, f);
});
cek("kepala divisi tidak boleh ubah peran maupun divisiId", () => {
  assert.equal(bolehUbahField(kepalaA("A"), "peran"), false);
  assert.equal(bolehUbahField(kepalaA("A"), "divisiId"), false);
});

console.log(`\n${lulus} pemeriksaan lulus.`);