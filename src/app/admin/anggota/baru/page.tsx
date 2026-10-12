import Link from "next/link";
import { notFound } from "next/navigation";
import { Kartu } from "@/components/ui";
import { prisma } from "@/lib/db";
import { getPengguna } from "@/lib/auth";
import { penuh, bolehUbahField } from "@/lib/perm";
import { FormAnggota } from "@/components/form-anggota";

export default async function TambahAnggota() {
  const [divisi, user] = await Promise.all([
    prisma.divisi.findMany({
      orderBy: { nama: "asc" },
      select: { id: true, nama: true },
    }),
    getPengguna(),
  ]);

  // Tanpa penjaga ini, Bendahara bisa membuka form yang isinya pasti ditolak
  // server action. Lebih baik 404 daripada menampilkan form yang tak akan berhasil.
  if (!user || !penuh(user)) notFound();

  return (
    <div className="max-w-[760px]">
      <Link
        href="/admin/anggota"
        className="text-[13px] text-ink-muted hover:text-ink"
      >
        Semua anggota
      </Link>
      <h1 className="mt-3 text-[24px] font-bold text-ink">Tambah Anggota</h1>
      <p className="mt-1 text-[13px] text-ink-muted">
        {user?.divisi && !bolehUbahField(user, "divisiId")
          ? `Anggota baru akan masuk ke ${user.divisi.nama}.`
          : "Isi data anggota. Kosongkan kata sandi bila tidak dibuatkan akun login."}
      </p>

      <Kartu className="mt-6 p-6">
        <FormAnggota
          divisi={divisi}
          bolehUbahJabatan={!!user && bolehUbahField(user, "divisiId")}
        />
      </Kartu>
    </div>
  );
}