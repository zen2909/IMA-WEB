"use client";

import { useActionState } from "react";
import { masukAction, type FormState } from "@/app/actions";
import { Label, kelasInput, kelasTombol } from "./ui";

export function FormMasuk() {
  const [state, action, pending] = useActionState<FormState, FormData>(
    masukAction,
    undefined,
  );

  return (
    <form action={action} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className={kelasInput}
          placeholder="nama@arosbaya.ac.id"
        />
      </div>

      <div>
        <Label htmlFor="sandi">Kata sandi</Label>
        <input
          id="sandi"
          name="sandi"
          type="password"
          required
          autoComplete="current-password"
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

      <button type="submit" disabled={pending} className={`${kelasTombol("utama")} w-full`}>
        {pending ? "Memproses..." : "Masuk"}
      </button>
    </form>
  );
}