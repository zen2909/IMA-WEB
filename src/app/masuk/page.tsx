import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getPengguna } from "@/lib/auth";
import { Kartu } from "@/components/ui";
import { FormMasuk } from "@/components/form-masuk";

export const metadata: Metadata = { title: "Masuk" };

export default async function HalamanMasuk() {
  if (await getPengguna()) redirect("/admin");

  return (
    <main className="min-h-screen grid place-items-center px-6 py-12">
      <div className="w-full max-w-[400px]">
        <div className="flex flex-col items-center text-center">
          <Image src="/logo.jpg" alt="" width={56} height={56} className="rounded-full" />
          <h1 className="mt-4 text-[20px] font-bold text-ink">Masuk ke Panel IMA</h1>
          <p className="mt-1 text-[13px] text-ink-muted">
            Hanya pengurus yang sudah dibuatkan akun bisa masuk.
          </p>
        </div>

        <Kartu className="mt-7 p-6">
          <FormMasuk />
        </Kartu>

        <p className="mt-5 text-center text-[13px]">
          <Link href="/" className="text-brand-dark hover:underline">
            Kembali ke beranda
          </Link>
        </p>
      </div>
    </main>
  );
}