import { Kartu, Lencana } from "@/components/ui";
import { getPengguna } from "@/lib/auth";
import { FormSandi } from "@/components/form-sandi";

export default async function HalamanAkun() {
  const user = (await getPengguna())!;

  return (
    <div className="max-w-[760px]">
      <h1 className="text-[24px] font-bold text-ink">Akun Saya</h1>
      <p className="mt-1 text-[13px] text-ink-muted">
        Data akun dan ganti kata sandi.
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 items-start">
        <Kartu className="p-5">
          <dl className="space-y-3 text-[13px]">
            <div>
              <dt className="text-ink-muted">Nama</dt>
              <dd className="mt-0.5 font-medium text-ink">{user.nama}</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Email</dt>
              <dd className="mt-0.5 font-medium text-ink break-all">{user.email}</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Jabatan</dt>
              <dd className="mt-1">
                <Lencana peran={user.peran} />
              </dd>
            </div>
            <div>
              <dt className="text-ink-muted">Divisi</dt>
              <dd className="mt-0.5 font-medium text-ink">
                {user.divisi?.nama ?? "—"}
              </dd>
            </div>
          </dl>
        </Kartu>

        <Kartu className="p-5">
          <h2 className="text-[14px] font-semibold text-ink mb-4">
            Ganti kata sandi
          </h2>
          <FormSandi />
        </Kartu>
      </div>
    </div>
  );
}