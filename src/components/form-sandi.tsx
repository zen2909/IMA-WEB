"use client";

import { useActionState } from "react";
import { gantiSandiAction, type FormState } from "@/app/actions";
import { Label, kelasInput, kelasTombol } from "@/components/ui";

export function FormSandi() {
  const [state, action, pending] = useActionState<FormState, FormData>(
    gantiSandiAction,
    undefined,
  );

  return (
    <form action={action} className="space-y-4">
      <div>
        <Label htmlFor="sandiLama">Kata sandi lama</Label>
        <input
          id="sandiLama"
          name="sandiLama"
          type="password"
          required
          autoComplete="current-password"
          className={kelasInput}
        />
      </div>

      <div>
        <Label htmlFor="sandiBaru">Kata sandi baru</Label>
        <input
          id="sandiBaru"
          name="sandiBaru"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={kelasInput}
        />
      </div>

      <div>
        <Label htmlFor="sandiUlang">Ulangi kata sandi baru</Label>
        <input
          id="sandiUlang"
          name="sandiUlang"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={kelasInput}
        />
      </div>

      {state?.error && (
        <p
          role="alert"
          className="rounded-[8px] bg-danger-soft border border-danger/30 px-3 py-2 text-[13px] text-danger-txt"
        >
          {state.error}
        </p>
      )}

      {state?.ok && (
        <p
          role="status"
          className="rounded-[8px] bg-brand-soft border border-brand-border px-3 py-2 text-[13px] text-brand-dark"
        >
          {state.ok}
        </p>
      )}

      <button type="submit" disabled={pending} className={kelasTombol("utama")}>
        {pending ? "Menyimpan..." : "Ganti kata sandi"}
      </button>
    </form>
  );
}