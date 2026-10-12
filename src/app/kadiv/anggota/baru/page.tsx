import Link from "next/link";
import { Kartu } from "@/components/ui";
import { getPengguna } from "@/lib/auth";
import { FormAnggota } from "@/components/form-anggota";

export default async function TambahAnggotaKadiv() {
  const user = (await getPengguna())!;

  return (
    <div className="max-w-[760px]">
      <Link
        href="/kadiv/anggota"
        className="text-[13px] text-ink-muted hover:text-ink"
      >
        Semua anggota divisi
      </Link>
      <h1 className="mt-3 text-[24px] font-bold text-ink">Tambah Anggota</h1>
      <p className="mt-1 text-[13px] text-ink-muted">
        Anggota baru otomatis masuk ke {user.divisi?.nama}. Kosongkan kata
        sandi bila tidak dibuatkan akun login.
      </p>

      <Kartu className="mt-6 p-6">
        {/* Kepala divisi tidak menentukan jabatan maupun divisi tujuan, jadi
            kedua field itu disembunyikan dan dikunci di server. */}
        <FormAnggota divisi={[]} bolehUbahJabatan={false} />
      </Kartu>
    </div>
  );
}