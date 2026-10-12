import { redirect } from "next/navigation";
import { getPengguna } from "@/lib/auth";
import { MENU_ADMIN } from "@/components/panel-nav";
import { PanelShell } from "@/components/panel-shell";

export default async function LayoutAdmin({ children }: LayoutProps<"/admin">) {
  const user = await getPengguna();
  if (!user) redirect("/masuk");

  // Kepala divisi punya ruang sendiri. Menahannya di sini bukan sekadar
  // kosmetik: tanpa ini, /admin hanya jadi jalan lain ke ruang yang sama.
  if (user.peran === "KEPALA_DIVISI") redirect("/kadiv");

  return (
    <PanelShell
      user={user}
      menu={MENU_ADMIN}
      basePath="/admin"
      judul="Panel Admin"
    >
      {children}
    </PanelShell>
  );
}